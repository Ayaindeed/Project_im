const express = require('express');
const app = require('./src/app');
const db = require('./src/models');

const PORT = process.env.PORT || 3001;

// Database synchronization
db.sequelize.sync()
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });

// Start the server with error handling
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Trying port ${PORT + 1}`);
        server.listen(PORT + 1);
    } else {
        console.error('Server error:', err);
    }
});