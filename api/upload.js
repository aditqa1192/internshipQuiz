import { BlobServiceClient } from '@azure/storage-blob';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { fileName, pdfBase64 } = req.body;

    if (!fileName || !pdfBase64) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const sasUrl = process.env.AZURE_STORAGE_SAS_URL;
        if (!sasUrl) {
            throw new Error('AZURE_STORAGE_SAS_URL is not configured');
        }

        const blobServiceClient = new BlobServiceClient(sasUrl);
        const containerName = 'quiz-results';
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Create container if it doesn't exist (optional, but good practice if SAS allows)
        // Note: SAS tokens usually have limited permissions, so we assume container exists.

        // Append date (YYYY-MM-DD) as folder prefix
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const dateFolder = `${year}-${month}-${day}`;
        const fullFileName = `${dateFolder}/${fileName}`;

        const blockBlobClient = containerClient.getBlockBlobClient(fullFileName);

        // Convert base64 to buffer
        const buffer = Buffer.from(pdfBase64, 'base64');

        await blockBlobClient.uploadData(buffer, {
            blobHTTPHeaders: { blobContentType: 'application/pdf' }
        });

        return res.status(200).json({ message: 'Upload successful', fileName });
    } catch (error) {
        console.error('Azure Upload Error:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
