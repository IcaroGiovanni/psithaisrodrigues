const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // Se for rota da API, tenta usar o server.js
  if (req.url.startsWith('/api')) {
    try {
      const app = require('../server.js');
      return app(req, res);
    } catch (err) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
  }

  // Servir index.html para qualquer outra rota (SPA fallback)
  const filePath = path.join(__dirname, '..', 'index.html');

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.send(content);
  } catch (err) {
    res.status(500).send('Error loading page');
  }
};
