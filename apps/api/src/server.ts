/**
 * Simple API Server
 * Minimal Express server without database
 * @module apps/api/server
 */

import express from 'express';
import cors from 'cors';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'api'
  });
});

// Basic API endpoint
app.get('/api/courses', (req, res) => {
  res.json({
    courses: [
      {
        id: 1,
        title: 'AI Transformation Manager',
        price: 1000,
        duration: '3 months'
      },
      {
        id: 2,
        title: 'No-Code Website Development',
        price: 1200,
        duration: '2 months'
      },
      {
        id: 3,
        title: 'AI Video & Avatar Generation',
        price: 1500,
        duration: '4 months'
      }
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Server configuration - Changed to port 4000 to avoid conflicts
const PORT = process.env.API_PORT || process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ API Server running at http://${HOST}:${PORT}`);
  console.log(`📍 Health check: http://${HOST}:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;