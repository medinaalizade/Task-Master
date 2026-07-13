require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? true
    : 'http://localhost:5173',
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch((error) => console.error('MongoDB connection error:', error));

const todoRoutes = require('./routes/todos');
app.use('/api/todos', todoRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Todo API!' });
});

// Serve React frontend (ONLY in production) - MUST be before app.listen()
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

// Start server - ONLY ONCE at the very end
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});