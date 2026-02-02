// Load environment variables FIRST (before any other imports)
import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { apiRouter } from './routes/index.routes';
import { errorHandler } from './middleware/error-handler';

const app: Application = express();
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development to allow inline scripts
})); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Redirect root to login page (BEFORE static middleware)
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use(`/api/${API_VERSION}`, apiRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚗 DriveWell API Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Dashboard: http://localhost:${PORT}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api/${API_VERSION}`);
  });
}

export default app;
