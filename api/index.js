const fs = require('fs');
const path = require('path');

const STATIC_EXTENSIONS = ['.html', '.css', '.js', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.ico', '.svg', '.json', '.woff', '.woff2', '.ttf', '.eot'];

const TEXT_TYPES = ['.html', '.css', '.js', '.json', '.svg', '.txt'];

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
  '.svg': 'image/svg+xml; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

module.exports = async (req, res) => {
  const url = req.url || '/';

  // Arquivos estáticos — serve direto do disco como buffer binário
  const ext = path.extname(url).toLowerCase();
  if (STATIC_EXTENSIONS.includes(ext)) {
    const filePath = path.join(__dirname, '..', url);
    try {
      if (!fs.existsSync(filePath)) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return res.end('Arquivo não encontrado');
      }
      const content = fs.readFileSync(filePath);
      res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
      return res.end(content);
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.end('Erro ao carregar arquivo');
    }
  }

  // Rotas da API — delega para o server.js se existir
  if (url.startsWith('/api/')) {
    try {
      const app = require('../server.js');
      return app(req, res);
    } catch (err) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'API endpoint not found' }));
    }
  }

  // Qualquer outra rota — serve index.html (SPA fallback)
  const indexPath = path.join(__dirname, '..', 'index.html');
  try {
    const content = fs.readFileSync(indexPath);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.end(content);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end('Erro ao carregar página');
  }
};
