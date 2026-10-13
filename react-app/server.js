const express = require('express');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;
const SERVER_NAME = process.env.SERVER_NAME || os.hostname().toUpperCase();

// Serve static files from React build directory
app.use(express.static(path.join(__dirname, 'build')));

// Health check endpoint returning HTTP 200
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', server: SERVER_NAME });
});

// API endpoint to return server identifier for dynamic UI
app.get('/api/info', (req, res) => {
  res.json({ server: SERVER_NAME, timestamp: new Date().toISOString() });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server [${SERVER_NAME}] running on port ${PORT}`);
});