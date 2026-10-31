/**
 * Blog — servidor HTTP (Express)
 * ---------------------------------------------------------------------------
 * API do blog: posts, comentários e área restrita da criadora.
 *
 *  POST   /api/login              autentica e devolve um token de sessão
 *  POST   /api/logout             encerra a sessão
 *  GET    /api/session            valida o token guardado no navegador
 *  GET    /api/posts              lista os posts (mais recentes primeiro)
 *  GET    /api/posts/:id          detalhe de um post
 *  POST   /api/posts              cria post            (autenticado)
 *  PUT    /api/posts/:id          atualiza post        (autenticado)
 *  DELETE /api/posts/:id          exclui post          (autenticado)
 *  GET    /api/posts/:id/comments comentários de um post
 *  POST   /api/posts/:id/comments publica comentário
 *  DELETE /api/comments/:id       exclui comentário    (autenticado)
 */

'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const app = express();

/* ==========================================================================
 * Configuração
 * ========================================================================== */

const PORT = Number(process.env.PORT) || 3000;

// Credenciais da criadora — podem ser sobrescritas por variáveis de ambiente.
const CREDENTIALS = {
  user: process.env.BLOG_USER || 'Thais Rodrigues',
  password: process.env.BLOG_PASSWORD || '123456',
};

// Limites de conteúdo (evitam payloads absurdos e layout quebrado).
const LIMITS = {
  title: 120,
  content: 20000,
  commentName: 60,
  commentContent: 1500,
  imageBytes: 5 * 1024 * 1024,
};

// Duração da sessão do painel (8 horas).
const SESSION_TTL_MS = Number(process.env.BLOG_SESSION_TTL_MS) || 8 * 60 * 60 * 1000;

// Intervalo mínimo entre dois comentários do mesmo IP.
const COMMENT_COOLDOWN_MS = 15000;

// Categorias aceitas no formulário de publicação.
const CATEGORIES = [
  'Artigos',
  'Ansiedade',
  'Neurodivergência',
  'Autocuidado',
  'TCC',
  'Avaliação',
  'Relacionamentos',
];

const DEFAULT_CATEGORY = 'Artigos';

/* ==========================================================================
 * Middlewares
 * ========================================================================== */

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});
app.use(express.static(path.join(__dirname)));

/* ==========================================================================
 * Uploads
 * ========================================================================== */

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif']);
const ALLOWED_MIMETYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    // Nome gerado no servidor: nunca usamos o nome original do arquivo.
    const unique = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    cb(null, unique + path.extname(file.originalname).toLowerCase());
  },
});

const upload = multer({
  storage,
  limits: { fileSize: LIMITS.imageBytes, files: 1 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const mime = (file.mimetype || '').toLowerCase();
    if (ALLOWED_EXTENSIONS.has(ext) && ALLOWED_MIMETYPES.has(mime)) {
      return cb(null, true);
    }
    cb(new Error('Formato de imagem não suportado (use JPG, PNG, GIF ou WebP).'));
  },
});

/* ==========================================================================
 * Persistência (JSON atômico — nunca deixa o arquivo pela metade)
 * ========================================================================== */

const postsPath = path.join(__dirname, 'posts.json');
const commentsPath = path.join(__dirname, 'comments.json');

function writeJsonAtomic(filePath, data) {
  const tmp = `${filePath}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, filePath);
}

function readJson(filePath, fallback = []) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (err) {
    return fallback;
  }
}

/** Remove caracteres de controle e normaliza espaços nas bordas. */
function cleanText(value) {
  if (value === undefined || value === null) return '';
  return String(value)
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim();
}

function normalizePost(post) {
  const created = cleanText(post.created_at) || new Date().toISOString();
  return {
    id: Number(post.id),
    title: cleanText(post.title),
    content: cleanText(post.content),
    author: cleanText(post.author) || CREDENTIALS.user,
    category: cleanText(post.category) || DEFAULT_CATEGORY,
    image: cleanText(post.image) || null,
    created_at: created,
    updated_at: cleanText(post.updated_at) || null,
  };
}

function normalizeComment(comment) {
  return {
    id: Number(comment.id),
    postId: Number(comment.postId),
    name: cleanText(comment.name),
    content: cleanText(comment.content),
    created_at: cleanText(comment.created_at) || new Date().toISOString(),
  };
}

function readPosts() {
  return readJson(postsPath).map(normalizePost).filter((post) => post.id && post.title);
}

function writePosts(posts) {
  writeJsonAtomic(postsPath, posts);
}

function readComments() {
  return readJson(commentsPath).map(normalizeComment).filter((comment) => comment.id && comment.postId);
}

function writeComments(comments) {
  writeJsonAtomic(commentsPath, comments);
}

/** Gera o próximo id livre (nunca duplica, mesmo após exclusões). */
function nextId(items) {
  return items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
}

/** Ordena do mais recente para o mais antigo. */
function sortByDateDesc(a, b) {
  const dateA = new Date(a.created_at || 0).getTime() || 0;
  const dateB = new Date(b.created_at || 0).getTime() || 0;
  if (dateB !== dateA) return dateB - dateA;
  return (Number(b.id) || 0) - (Number(a.id) || 0);
}

/* ==========================================================================
 * Sessões
 * ========================================================================== */

const sessions = new Map();

function createSession(user) {
  const token = crypto.randomBytes(24).toString('hex');
  const expiresAt = Date.now() + SESSION_TTL_MS;
  sessions.set(token, { user, expiresAt });
  return { token, user, expiresAt };
}

function getSession(token) {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return session;
}

function readToken(req) {
  const header = req.headers.authorization || '';
  const [scheme, value] = header.split(' ');
  if (!value || String(scheme).toLowerCase() !== 'bearer') return null;
  return value.trim() || null;
}

function authenticate(req, res, next) {
  const session = getSession(readToken(req));
  if (!session) {
    return res.status(401).json({
      success: false,
      message: 'Sessão expirada ou inválida. Entre novamente.',
    });
  }
  req.session = session;
  next();
}

// Limpeza periódica das sessões expiradas.
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [token, session] of sessions) {
    if (session.expiresAt < now) sessions.delete(token);
  }
}, 10 * 60 * 1000);
cleanupTimer.unref();

/* ==========================================================================
 * Validação
 * ========================================================================== */

function validatePostFields(body, { partial = false } = {}) {
  const errors = [];

  const title = cleanText(body.title);
  const content = cleanText(body.content);

  if (!partial || body.title !== undefined) {
    if (!title) errors.push('Informe um título para a postagem.');
    else if (title.length > LIMITS.title) errors.push(`O título deve ter no máximo ${LIMITS.title} caracteres.`);
  }

  if (!partial || body.content !== undefined) {
    if (!content) errors.push('Escreva o conteúdo da postagem.');
    else if (content.length > LIMITS.content) errors.push(`O conteúdo deve ter no máximo ${LIMITS.content} caracteres.`);
  }

  return { ok: errors.length === 0, message: errors.join(' '), title, content };
}

function validateCommentFields(body) {
  const name = cleanText(body.name);
  const content = cleanText(body.content);
  const errors = [];

  if (!name) errors.push('Informe seu nome.');
  else if (name.length > LIMITS.commentName) errors.push(`O nome deve ter no máximo ${LIMITS.commentName} caracteres.`);

  if (!content) errors.push('Escreva o seu comentário.');
  else if (content.length > LIMITS.commentContent) errors.push(`O comentário deve ter no máximo ${LIMITS.commentContent} caracteres.`);

  return { ok: errors.length === 0, message: errors.join(' '), name, content };
}

/* ==========================================================================
 * API — autenticação
 * ========================================================================== */

app.post('/api/login', (req, res) => {
  const username = cleanText(req.body && req.body.username);
  const password = typeof (req.body && req.body.password) === 'string' ? req.body.password : '';

  const userOk = username.toLowerCase() === CREDENTIALS.user.toLowerCase();
  const passOk = password.length > 0 && password === CREDENTIALS.password;

  if (!userOk || !passOk) {
    return res.status(401).json({ success: false, message: 'Usuário ou senha incorretos.' });
  }

  const { token, user, expiresAt } = createSession(CREDENTIALS.user);
  res.json({ success: true, token, user, expiresAt });
});

app.post('/api/logout', authenticate, (req, res) => {
  sessions.delete(readToken(req));
  res.json({ success: true, message: 'Sessão encerrada.' });
});

app.get('/api/session', authenticate, (req, res) => {
  res.json({ success: true, user: req.session.user, expiresAt: req.session.expiresAt });
});

/* ==========================================================================
 * API — posts
 * ========================================================================== */

app.get('/api/posts', (req, res) => {
  const posts = readPosts();
  const comments = readComments();

  const counts = new Map();
  for (const comment of comments) {
    counts.set(comment.postId, (counts.get(comment.postId) || 0) + 1);
  }

  const result = posts
    .map((post) => ({ ...post, commentsCount: counts.get(post.id) || 0 }))
    .sort(sortByDateDesc);

  res.json(result);
});

app.get('/api/posts/:id', (req, res) => {
  const post = readPosts().find((item) => item.id === Number(req.params.id));
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post não encontrado.' });
  }
  res.json(post);
});

app.post('/api/posts', authenticate, upload.single('imagem'), (req, res) => {
  const validation = validatePostFields(req.body || {});
  if (!validation.ok) {
    return res.status(400).json({ success: false, message: validation.message });
  }

  const category = cleanText(req.body.category);
  const posts = readPosts();

  const newPost = normalizePost({
    id: nextId(posts),
    title: validation.title,
    content: validation.content,
    author: cleanText(req.body.author) || req.session.user,
    category: CATEGORIES.includes(category) ? category : DEFAULT_CATEGORY,
    image: req.file ? `/uploads/${req.file.filename}` : null,
    created_at: new Date().toISOString(),
  });

  posts.push(newPost);
  writePosts(posts);
  res.status(201).json(newPost);
});

app.put('/api/posts/:id', authenticate, upload.single('imagem'), (req, res) => {
  const id = Number(req.params.id);
  const posts = readPosts();
  const index = posts.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Post não encontrado.' });
  }

  const body = req.body || {};
  const validation = validatePostFields(body, { partial: true });
  if (!validation.ok) {
    return res.status(400).json({ success: false, message: validation.message });
  }

  const post = posts[index];

  if (body.title !== undefined) post.title = validation.title;
  if (body.content !== undefined) post.content = validation.content;

  if (body.category !== undefined) {
    const category = cleanText(body.category);
    post.category = CATEGORIES.includes(category) ? category : DEFAULT_CATEGORY;
  }

  // Remoção explícita da capa.
  if (String(body.removeImage) === 'true') {
    removeUpload(post.image);
    post.image = null;
  }

  // Nova imagem substitui a anterior.
  if (req.file) {
    removeUpload(post.image);
    post.image = `/uploads/${req.file.filename}`;
  }

  post.updated_at = new Date().toISOString();

  posts[index] = post;
  writePosts(posts);
  res.json(post);
});

app.delete('/api/posts/:id', authenticate, (req, res) => {
  const id = Number(req.params.id);
  const posts = readPosts();
  const index = posts.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Post não encontrado.' });
  }

  removeUpload(posts[index].image);

  // Comentários do post são removidos junto.
  writeComments(readComments().filter((comment) => comment.postId !== id));

  posts.splice(index, 1);
  writePosts(posts);

  res.json({ success: true, message: 'Post excluído com sucesso.' });
});

/* ==========================================================================
 * API — comentários
 * ========================================================================== */

app.get('/api/posts/:id/comments', (req, res) => {
  const postId = Number(req.params.id);
  const comments = readComments()
    .filter((comment) => comment.postId === postId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(comments);
});

app.post('/api/posts/:id/comments', (req, res) => {
  const postId = Number(req.params.id);

  if (!readPosts().some((post) => post.id === postId)) {
    return res.status(404).json({ success: false, message: 'Post não encontrado.' });
  }

  const validation = validateCommentFields(req.body || {});
  if (!validation.ok) {
    return res.status(400).json({ success: false, message: validation.message });
  }

  // Filtro simples contra spam (links em excesso).
  const links = validation.content.match(/https?:\/\//gi) || [];
  if (links.length > 2) {
    return res.status(400).json({
      success: false,
      message: 'O comentário contém excesso de links e não foi publicado.',
    });
  }

  // Intervalo mínimo entre comentários do mesmo IP.
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const lastComment = commentCooldowns.get(ip);
  if (lastComment && now - lastComment < COMMENT_COOLDOWN_MS) {
    const wait = Math.ceil((COMMENT_COOLDOWN_MS - (now - lastComment)) / 1000);
    return res.status(429).json({
      success: false,
      message: `Aguarde ${wait}s para enviar outro comentário.`,
    });
  }
  commentCooldowns.set(ip, now);

  const comments = readComments();
  const newComment = normalizeComment({
    id: nextId(comments),
    postId,
    name: validation.name,
    content: validation.content,
    created_at: new Date().toISOString(),
  });

  comments.push(newComment);
  writeComments(comments);

  res.status(201).json(newComment);
});

app.delete('/api/comments/:id', authenticate, (req, res) => {
  const id = Number(req.params.id);
  const comments = readComments();
  const index = comments.findIndex((comment) => comment.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Comentário não encontrado.' });
  }

  comments.splice(index, 1);
  writeComments(comments);

  res.json({ success: true, message: 'Comentário excluído.' });
});

/* ==========================================================================
 * Erros e rotas desconhecidas
 * ========================================================================== */

const commentCooldowns = new Map();

app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint não encontrado.' });
});

// Tratamento de erros do multer e demais.
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'A imagem excede o limite de 5MB.'
        : 'Não foi possível enviar a imagem.';
    return res.status(400).json({ success: false, message });
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message || 'Erro inesperado.' });
  }
  next();
});

/* ==========================================================================
 * Utilidades de upload
 * ========================================================================== */

function removeUpload(imagePath) {
  if (!imagePath || !imagePath.startsWith('/uploads/')) return;
  const absolute = path.join(__dirname, imagePath);
  // Garante que o arquivo está dentro da pasta de uploads.
  if (!absolute.startsWith(uploadsDir)) return;
  try {
    if (fs.existsSync(absolute)) fs.unlinkSync(absolute);
  } catch (err) {
    console.warn('Não foi possível remover a imagem:', err.message);
  }
}

/* ==========================================================================
 * Fallback SPA — serve index.html para rotas não encontradas
 * ========================================================================== */

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ success: false, message: 'Endpoint não encontrado.' });
  res.sendFile(path.join(__dirname, 'index.html'));
});

/* ==========================================================================
 * Início
 * ========================================================================== */

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Blog rodando em http://localhost:${PORT}`);
    if (!process.env.BLOG_PASSWORD) {
      console.log('Login padrão: usuário "Thais Rodrigues" · senha "123456" (defina BLOG_PASSWORD no ambiente).');
    }
  });
}

module.exports = app;
