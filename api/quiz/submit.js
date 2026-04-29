/* eslint-env node */
import { BlobServiceClient } from "@azure/storage-blob";
import pool from '../db.js';

async function uploadPdf(fileName, pdfBase64) {
  const sasUrl = process.env.AZURE_STORAGE_SAS_URL;
  if (!sasUrl) {
    return null;
  }

  const blobServiceClient = new BlobServiceClient(sasUrl);
  const containerName = "quiz-results";
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateFolder = `${year}-${month}-${day}`;
  const fullFileName = `${dateFolder}/${fileName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(fullFileName);
  const buffer = Buffer.from(pdfBase64, "base64");

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: "application/pdf" },
  });

  return `https://${containerClient.accountName}.blob.core.windows.net/${containerName}/${fullFileName}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const payload = req.body;
  if (!payload || !payload.studentInfo || !payload.assessmentType || !Array.isArray(payload.results)) {
    return res.status(400).json({ message: "Invalid submission payload" });
  }

  const client = await pool.connect();

  try {
    // Check settings
    const settingsResult = await client.query('SELECT * FROM settings');
    const settings = {};
    settingsResult.rows.forEach(row => {
      settings[row.key] = JSON.parse(row.value);
    });

    if (settings.quizOpen === false) {
      return res.status(403).json({ message: "Quiz is currently closed" });
    }

    if (settings.oneAttempt) {
      const existingSubmission = await client.query(
        'SELECT id FROM submissions WHERE student_info->>\'email\' = $1',
        [payload.studentInfo.email.toLowerCase()]
      );
      if (existingSubmission.rows.length > 0) {
        return res.status(409).json({ message: "Student has already submitted the quiz" });
      }
    }

    const percentage = payload.totalQuestions > 0 ? Math.round((payload.score / payload.totalQuestions) * 100 * 10) / 10 : 0;

    let pdfUrl = null;
    if (payload.pdfBase64 && payload.fileName) {
      try {
        pdfUrl = await uploadPdf(payload.fileName, payload.pdfBase64);
      } catch (error) {
        console.error("PDF Upload Error:", error);
      }
    }

    const result = await client.query(
      `INSERT INTO submissions (student_info, assessment_type, results, score, total_questions, percentage, submitted_at, pdf_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        JSON.stringify(payload.studentInfo),
        payload.assessmentType,
        JSON.stringify(payload.results),
        payload.score,
        payload.totalQuestions,
        percentage,
        payload.submittedAt ? new Date(payload.submittedAt) : new Date(),
        pdfUrl,
      ]
    );

    const submission = result.rows[0];
    const formattedSubmission = {
      ...submission,
      studentInfo: JSON.parse(submission.student_info),
      results: JSON.parse(submission.results),
    };

    return res.status(201).json({ submission: formattedSubmission });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
}
