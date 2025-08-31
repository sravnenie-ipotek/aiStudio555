/**
 * Simple Express Application
 * Minimal app configuration
 * @module apps/api/app
 */

import express from 'express';
import cors from 'cors';

// Create Express app
const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'API Server is running' });
});

export default app;