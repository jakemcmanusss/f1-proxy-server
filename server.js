// server.js
import express from 'express';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

// Convert `import.meta.url` to a file path to handle ES module issues
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Proxy route to fetch data from the Ergast API
app.get('/api/*', async (req, res) => {
  const apiUrl = `http://ergast.com/api/f1/${req.params[0]}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch from Ergast API. Status: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from Ergast API:', error);
    res.status(500).json({ message: 'Error fetching data from the API' });
  }
});

// Serve static files (HTML, CSS, JS) from the parent directory
app.use(express.static(path.join(__dirname, '..')));

// Route to serve simulate.html directly
app.get('/simulate', (req, res) => {
  const simulatePath = path.join(__dirname, '..', 'simulate.html');
  console.log(`Serving simulate.html from path: ${simulatePath}`);
  res.sendFile(simulatePath, (err) => {
    if (err) {
      console.error('Error sending simulate.html:', err);
      res.status(500).send('Failed to load simulate.html');
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
