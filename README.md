# Internship Quiz Portal

A React-based quiz application with admin portal for managing questions and viewing submissions.

## Features

- Admin portal for managing questions and assessment types
- Quiz interface for students
- PDF generation and Azure Blob Storage integration
- PostgreSQL database for persistent storage

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Azure Storage SAS URL
   - For Vercel deployment, the `POSTGRES_URL` will be provided automatically

### Database Setup

This application uses PostgreSQL for data storage. For Vercel deployment:

1. In your Vercel dashboard, go to your project
2. Go to the "Storage" tab
3. Add a PostgreSQL database
4. The `POSTGRES_URL` environment variable will be automatically set

For local development:

1. Set up a local PostgreSQL instance or use a cloud provider
2. Set the `POSTGRES_URL` environment variable in your `.env` file

### Initialize Database

After setting up the database connection:

```bash
npm run init-db
```

This will create the necessary tables and seed initial data from the existing JSON files.

### Development

```bash
# Start the development server
npm run dev

# Start the API server (for local development)
npm run server
```

### Deployment

The application is configured for Vercel deployment with serverless functions for the API routes.

## API Routes

- `GET/POST/PUT/DELETE /api/admin/questions` - Manage questions
- `GET/POST/PUT /api/admin/assessment-types` - Manage assessment types
- `GET/DELETE /api/admin/submissions` - View/delete submissions
- `GET/PATCH /api/admin/settings` - Get/update settings
- `GET /api/quiz/questions` - Get questions for quiz
- `POST /api/quiz/submit` - Submit quiz results
