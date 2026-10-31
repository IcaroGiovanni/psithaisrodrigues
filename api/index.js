const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
};

module.exports = async (req, res) => {
  const rawUrl = req.url || '/';
  // Remove query string and hash to get the actual path
  const urlPath = rawUrl.split('?')[0].split('#')[0];
  const ext = path.extname(urlPath).toLowerCase();

  // 1. Serve static files from the project root
  if (ext && MIME_TYPES[ext]) {
    // Resolve the file path relative to the project root (one level up from this file)
    const projectRoot = path.resolve(__dirname, '..');
    const filePath = path.join(projectRoot, urlPath);

    try {
      if (!fs.existsSync(filePath)) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('Arquivo não encontrado');
      }
      const content = fs.readFileSync(filePath);
      res.setHeader('Content-Type', MIME_TYPES[ext]);
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.end(content);
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      return res.end('Erro ao carregar arquivo');
    }
  }

  // 2. API routes
  if (urlPath.startsWith('/api/')) {
    try {
      // server.js is at the project root, so require it from there
      const serverApp = require(path.join(path.resolve(__dirname, '..'), 'server.js'));
      return serverApp(req, res);
    } catch (err) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'API endpoint not found' }));
    }
  }

  // 3. SPA fallback: serve index.html for any other route
  const indexPath = path.join(path.resolve(__dirname, '..'), 'index.html');
  try {
    const content = fs.readFileSync(indexPath, 'utf8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.end(content);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    return res.end('Erro ao carregar página');
  }
};