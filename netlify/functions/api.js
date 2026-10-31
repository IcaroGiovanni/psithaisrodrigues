/**
 * Netlify Function — API do blog (somente leitura)
 * ---------------------------------------------------------------------------
 * Esta função responde as rotas GET da API pública.
 *
 * Rotas suportadas:
 *   GET /api/posts
 *   GET /api/posts/:id
 *   GET /api/posts/:id/comments
 *
 * Observação: funções serverless da Netlify têm sistema de arquivos
 * só-leitura/efêmero, então POST/PUT/DELETE (login, criar posts, uploads)
 * não funcionam aqui. Para o painel admin completo, seria necessário um
 * backend com banco de dados (ex.: Supabase, Firebase, etc.).
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const postsPath = path.join(projectRoot, 'posts.json');
const commentsPath = path.join(projectRoot, 'comments.json');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8',
};

function readJson(filePath, fallback = []) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function normalizePost(post) {
  return {
    id: Number(post.id),
    title: String(post.title || ''),
    content: String(post.content || ''),
    author: String(post.author || ''),
    category: String(post.category || ''),
    image: post.image || null,
    created_at: post.created_at || new Date().toISOString(),
    updated_at: post.updated_at || null,
  };
}

function normalizeComment(comment) {
  return {
    id: Number(comment.id),
    postId: Number(comment.postId),
    name: String(comment.name || ''),
    content: String(comment.content || ''),
    created_at: comment.created_at || new Date().toISOString(),
  };
}

function readPosts() {
  return readJson(postsPath).map(normalizePost).filter((post) => post.id && post.title);
}

function readComments() {
  return readJson(commentsPath).map(normalizeComment).filter((comment) => comment.id && comment.postId);
}

function sortByDateDesc(a, b) {
  const dateA = new Date(a.created_at || 0).getTime() || 0;
  const dateB = new Date(b.created_at || 0).getTime() || 0;
  if (dateB !== dateA) return dateB - dateA;
  return (Number(b.id) || 0) - (Number(a.id) || 0);
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  // Somente GET é suportado neste serverless (sem banco persistente)
  if (event.httpMethod !== 'GET') {
    return json(501, {
      error: 'Método não suportado em serverless. Use um backend com banco de dados.',
    });
  }

  // O event.path vem como /.netlify/functions/api/posts/123/comments
  // Extrai a parte após /api/
  const rawPath = event.path || '/';
  const match = rawPath.match(/\/api\/(.*)/);
  const apiPath = match ? '/' + match[1] : '/';

  // GET /api/posts
  if (apiPath === '/posts') {
    const posts = readPosts();
    const comments = readComments();
    const counts = new Map();
    for (const comment of comments) {
      counts.set(comment.postId, (counts.get(comment.postId) || 0) + 1);
    }
    const result = posts
      .map((post) => ({ ...post, commentsCount: counts.get(post.id) || 0 }))
      .sort(sortByDateDesc);
    return json(200, result);
  }

  // GET /api/posts/:id
  const postDetailMatch = apiPath.match(/^\/posts\/(\d+)$/);
  if (postDetailMatch) {
    const id = Number(postDetailMatch[1]);
    const post = readPosts().find((item) => item.id === id);
    if (!post) {
      return json(404, { success: false, message: 'Post não encontrado.' });
    }
    return json(200, post);
  }

  // GET /api/posts/:id/comments
  const commentsMatch = apiPath.match(/^\/posts\/(\d+)\/comments$/);
  if (commentsMatch) {
    const postId = Number(commentsMatch[1]);
    if (!readPosts().some((post) => post.id === postId)) {
      return json(404, { success: false, message: 'Post não encontrado.' });
    }
    const comments = readComments()
      .filter((comment) => comment.postId === postId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return json(200, comments);
  }

  return json(404, { success: false, message: 'Endpoint não encontrado.' });
};
