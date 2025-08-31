/**
 * API Entry Point
 * Exports the server for starting the application
 * @module apps/api/index
 */

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Start the server
import './server';

export * from './server';