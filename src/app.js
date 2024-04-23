// src/app.js

import express from 'express';
import cors from 'cors';
import petProfileRoutes from './api/routes/petProfileRoutes.js'; // Ensure correct path

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Routes
app.use('/api/pets', petProfileRoutes);

// Catch-all route for handling 404 (Not Found) errors
app.use((req, res, next) => {
  res.status(404).send({ message: 'Resource not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something broke!' });
});

export default app;
