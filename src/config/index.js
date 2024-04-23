// index.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app.js'; // Update path as necessary

dotenv.config();

const PORT = process.env.PORT || 5003;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB...');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Could not connect to MongoDB:', err);
  });
