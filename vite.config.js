import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { BlobServiceClient } from '@azure/storage-blob'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'upload-api-mock',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/upload' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', async () => {
                try {
                  const { fileName, pdfBase64 } = JSON.parse(body);
                  const sasUrl = env.AZURE_STORAGE_SAS_URL;

                  if (!sasUrl) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ message: 'AZURE_STORAGE_SAS_URL not found in .env' }));
                    return;
                  }

                  const blobServiceClient = new BlobServiceClient(sasUrl);
                  const containerClient = blobServiceClient.getContainerClient('quiz-results');
                  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
                  const buffer = Buffer.from(pdfBase64, 'base64');

                  await blockBlobClient.uploadData(buffer, {
                    blobHTTPHeaders: { blobContentType: 'application/pdf' }
                  });

                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ message: 'Local upload successful' }));
                } catch (error) {
                  console.error('Local Upload Error:', error);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ message: 'Local upload failed', error: error.message }));
                }
              });
              return;
            }
            next();
          });
        }
      }
    ],
  }
})

