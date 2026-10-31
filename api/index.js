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
  // Remove query string para pegar o caminho real do arquivo
  const urlPath = rawUrl.split('?')[0].split('#')[0];
  const ext = path.extname(urlPath).toLowerCase();

  // 1. Arquivos estáticos — serve direto com content-type correto
  if (ext && MIME_TYPES[ext]) {
    const filePath = path.join(__dirname, '..', urlPath);
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

  // 2. Rotas da API
  if (urlPath.startsWith('/api/')) {
    try {
      const app = require('../server.js');
      return app(req, res);
    } catch (err) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'API endpoint not found' }));
    }
  }

  // 3. Qualquer outra rota — serve index.html (SPA fallback)
  const indexPath = path.join(__dirname, '..', 'index.html');
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
