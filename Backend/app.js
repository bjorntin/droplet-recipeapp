const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const routes = require('./routes');
const { connectToDatabase, createTables, testConnection } = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Use routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server and initialize the database connection
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await connectToDatabase();
    await createTables();
    await testConnection();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    console.log('Server is running, but database connection failed. Some features may not work properly.');
  }
});