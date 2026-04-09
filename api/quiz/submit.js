/* eslint-env node */
import { BlobServiceClient } from "@azure/storage-blob";
import { readStore, writeStore } from "../../api/_store.js";

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

  const store = await readStore();
  const settings = store.settings || {};
  if (settings.quizOpen === false) {
    return res.status(403).json({ message: "Quiz is currently closed" });
  }

  if (settings.oneAttempt) {
    const alreadySubmitted = (store.submissions || []).some(
      (item) => item.studentInfo?.email?.toLowerCase() === payload.studentInfo.email.toLowerCase()
    );
    if (alreadySubmitted) {
      return res.status(409).json({ message: "Student has already submitted the quiz" });
    }
  }

  const newSubmissionId = (store.submissions || []).reduce((max, item) => Math.max(max, item.id || 0), 0) + 1;
  const percentage = payload.totalQuestions > 0 ? Math.round((payload.score / payload.totalQuestions) * 100 * 10) / 10 : 0;
  const submission = {
    id: newSubmissionId,
    studentInfo: payload.studentInfo,
    assessmentType: payload.assessmentType,
    results: payload.results,
    score: payload.score,
    totalQuestions: payload.totalQuestions,
    percentage,
    submittedAt: payload.submittedAt || new Date().toISOString(),
    pdfUrl: null,
  };

  if (payload.pdfBase64 && payload.fileName) {
    try {
      submission.pdfUrl = await uploadPdf(payload.fileName, payload.pdfBase64);
    } catch (error) {
      console.error("PDF Upload Error:", error);
    }
  }

  const updatedStore = {
    ...store,
    submissions: [...(store.submissions || []), submission],
  };

  await writeStore(updatedStore);
  return res.status(201).json({ submission });
}
