/* eslint-env node */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { BlobServiceClient } from '@azure/storage-blob'
import { promises as fs } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'api-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            // Handle upload API
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

            // Handle other API routes
            if (req.url.startsWith('/api/')) {
              try {
                let handler;

                if (req.url.startsWith('/api/admin/auth')) {
                  handler = (await import('./api/admin/auth.js')).default;
                } else if (req.url.startsWith('/api/admin/questions')) {
                  handler = (await import('./api/admin/questions.js')).default;
                } else if (req.url.startsWith('/api/admin/submissions')) {
                  handler = (await import('./api/admin/submissions.js')).default;
                } else if (req.url.startsWith('/api/admin/dashboard')) {
                  handler = (await import('./api/admin/dashboard.js')).default;
                } else if (req.url.startsWith('/api/admin/settings')) {
                  handler = (await import('./api/admin/settings.js')).default;
                } else if (req.url.startsWith('/api/quiz/questions')) {
                  handler = (await import('./api/quiz/questions.js')).default;
                } else if (req.url.startsWith('/api/quiz/config')) {
                  handler = (await import('./api/quiz/config.js')).default;
                } else if (req.url.startsWith('/api/quiz/submit')) {
                  handler = (await import('./api/quiz/submit.js')).default;
                }

                if (handler) {
                  // Mock request/response objects
                  const mockReq = {
                    method: req.method,
                    url: req.url,
                    headers: req.headers,
                    query: {},
                  };

                  // Parse query parameters
                  const url = new URL(req.url, `http://${req.headers.host}`);
                  mockReq.query = Object.fromEntries(url.searchParams);

                  let body = '';
                  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
                    req.on('data', chunk => { body += chunk; });
                    await new Promise(resolve => req.on('end', resolve));
                    if (body) {
                      try {
                        mockReq.body = JSON.parse(body);
                      } catch (e) {
                        mockReq.body = body;
                      }
                    }
                  }

                  const mockRes = {
                    status: (code) => {
                      res.statusCode = code;
                      return mockRes;
                    },
                    json: (data) => {
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify(data));
                    },
                    end: (data) => {
                      res.end(data);
                    },
                    setHeader: (name, value) => {
                      res.setHeader(name, value);
                    }
                  };

                  await handler(mockReq, mockRes);
                  return;
                }
              } catch (error) {
                console.error('API Error:', error);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Internal Server Error', error: error.message }));
                return;
              }
            }

            next();
          });
        }
      }
    ],
  }
})

