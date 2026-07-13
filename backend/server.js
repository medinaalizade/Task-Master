require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch((error) => console.error('MongoDB connection error:', error));

const todoRoutes = require('./routes/todos');
app.use('/api/todos', todoRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Todo API!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});