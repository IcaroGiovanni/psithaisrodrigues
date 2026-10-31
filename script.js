// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  navToggle.classList.toggle('active');
  document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    document.body.style.overflow = '';
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('active')) {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
      item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });
    
    if (!isActive) {
      faqItem.classList.add('active');
      button.setAttribute('aria-expanded', 'true');
    }
  });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 100);
    }
  });
}, observerOptions);

document.querySelectorAll('[data-animate]').forEach(el => {
  observer.observe(el);
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== PARALLAX EFFECT =====
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const shapes = document.querySelectorAll('.shape');
  
  shapes.forEach((shape, index) => {
    const speed = (index + 1) * 0.1;
    shape.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// ===== TYPING EFFECT =====
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// ===== RIPPLE EFFECT ON BUTTONS =====
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.background = 'rgba(255, 255, 255, 0.4)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ===== SCROLL PROGRESS BAR =====
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
progressBar.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--brown) 0%, var(--brown-light) 100%);
  z-index: 10001;
  transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = (scrollTop / scrollHeight) * 100;
  progressBar.style.width = progress + '%';
});

// ===== TEXT REVEAL ON SCROLL =====
function revealText() {
  const reveals = document.querySelectorAll('.section-title, .section-text');
  
  reveals.forEach(element => {
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    
    if (elementTop < windowHeight - elementVisible) {
      element.classList.add('revealed');
    }
  });
}

window.addEventListener('scroll', revealText);

// ===== REVIEW MODAL & RATING INTERACTION =====
const btnOpenReviewModal = document.getElementById('btnOpenReviewModal');
const btnCloseReviewModal = document.getElementById('btnCloseReviewModal');
const reviewModal = document.getElementById('reviewModal');
const reviewForm = document.getElementById('reviewForm');
const starPicker = document.getElementById('starPicker');
const reviewRatingInput = document.getElementById('reviewRating');
const reviewSuccessMsg = document.getElementById('reviewSuccessMsg');

if (btnOpenReviewModal && reviewModal) {
  btnOpenReviewModal.addEventListener('click', () => {
    reviewModal.classList.add('active');
  });
}

if (btnCloseReviewModal && reviewModal) {
  btnCloseReviewModal.addEventListener('click', () => {
    reviewModal.classList.remove('active');
  });

  reviewModal.addEventListener('click', (e) => {
    if (e.target === reviewModal) {
      reviewModal.classList.remove('active');
    }
  });
}

if (starPicker) {
  const stars = starPicker.querySelectorAll('span');
  
  stars.forEach((star, idx) => {
    star.addEventListener('mouseenter', () => {
      stars.forEach((s, i) => {
        if (i <= idx) s.classList.add('hover');
        else s.classList.remove('hover');
      });
    });

    starPicker.addEventListener('mouseleave', () => {
      stars.forEach(s => s.classList.remove('hover'));
    });

    star.addEventListener('click', () => {
      const ratingVal = star.getAttribute('data-rating');
      reviewRatingInput.value = ratingVal;
      
      stars.forEach((s, i) => {
        if (i < ratingVal) s.classList.add('active');
        else s.classList.remove('active');
      });
    });
  });
}

if (reviewForm) {
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('reviewName').value.trim();
    const service = document.getElementById('reviewService').value;
    const rating = parseInt(reviewRatingInput.value, 10);
    const comment = document.getElementById('reviewComment').value.trim();
    
    if (!name || !comment) return;

    // Gerar estrelas
    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
      starsHtml += i < rating ? '★' : '☆';
    }

    // Criar o card e adicionar ao topo do grid
    const grid = document.querySelector('.avaliacoes-grid');
    if (grid) {
      const firstLetter = name.charAt(0).toUpperCase();
      const newCard = document.createElement('div');
      newCard.className = 'avaliacao-card visible';
      newCard.style.animation = 'fadeInUp 0.6s ease-out';
      newCard.innerHTML = `
        <div class="avaliacao-header">
          <div class="patient-avatar">${firstLetter}</div>
          <div class="patient-info">
            <h3 class="patient-name">${name}</h3>
            <span class="patient-tag">${service}</span>
          </div>
          <div class="avaliacao-stars">${starsHtml}</div>
        </div>
        <p class="avaliacao-text">"${comment}"</p>
        <span class="avaliacao-date">Agora mesmo</span>
      `;
      grid.prepend(newCard);
    }

    // Exibir mensagem de sucesso
    reviewForm.style.display = 'none';
    reviewSuccessMsg.style.display = 'block';

    setTimeout(() => {
      reviewModal.classList.remove('active');
      setTimeout(() => {
        reviewForm.reset();
        reviewForm.style.display = 'block';
        reviewSuccessMsg.style.display = 'none';
      }, 300);
    }, 2500);
  });
}

// ===== MÃE SECTION PARTICLES =====
function createMaeParticles() {
  const container = document.getElementById('maeParticles');
  if (!container) return;
  
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'mae-particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.width = (Math.random() * 4 + 2) + 'px';
    particle.style.height = particle.style.width;
    container.appendChild(particle);
  }
}

createMaeParticles();

// ===== MÃE SECTION TILT EFFECT =====
const maeImageContainer = document.querySelector('.mae-image-container');
if (maeImageContainer) {
  maeImageContainer.addEventListener('mousemove', (e) => {
    const rect = maeImageContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    maeImageContainer.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  
  maeImageContainer.addEventListener('mouseleave', () => {
    maeImageContainer.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    maeImageContainer.style.transition = 'transform 0.5s ease';
  });
  
  maeImageContainer.addEventListener('mouseenter', () => {
    maeImageContainer.style.transition = 'none';
  });
}

// ===== MÃE SECTION SCROLL REVEAL =====
function maeScrollReveal() {
  const elements = document.querySelectorAll('.mae-feature, .mae-quote-modern');
  
  elements.forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    const elementVisible = 100;
    
    if (elementTop < windowHeight - elementVisible) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }
  });
}

document.querySelectorAll('.mae-feature, .mae-quote-modern').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(40px)';
  el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
});

window.addEventListener('scroll', maeScrollReveal);
maeScrollReveal();

// ===== BLOG — MELHORADO =====
let blogToken = null;
let blogUser = null;
let editingPostId = null;
let allPosts = [];
let currentFilter = 'todos';
let currentSearch = '';
let currentPage = 1;
const POSTS_PER_PAGE = 9;

const btnBlogLogin = document.getElementById('btnBlogLogin');
const btnBlogNovoPost = document.getElementById('btnBlogNovoPost');
const btnBlogLogout = document.getElementById('btnBlogLogout');
const blogUserLabel = document.getElementById('blogUserLabel');
const blogGrid = document.getElementById('blogGrid');
const modalBlogLogin = document.getElementById('modalBlogLogin');
const modalBlogPost = document.getElementById('modalBlogPost');
const modalBlogDetalhe = document.getElementById('modalBlogDetalhe');
const btnCloseBlogDetalhe = document.getElementById('btnCloseBlogDetalhe');
const modalDetalheConteudo = document.getElementById('modalDetalheConteudo');
const formBlogLogin = document.getElementById('formBlogLogin');
const formBlogPost = document.getElementById('formBlogPost');
const blogLoginError = document.getElementById('blogLoginError');
const blogPostError = document.getElementById('blogPostError');
const blogSearchInput = document.getElementById('blogSearchInput');
const btnBlogSearchClear = document.getElementById('btnBlogSearchClear');
const blogCategories = document.getElementById('blogCategories');
const blogStatus = document.getElementById('blogStatus');
const btnBlogLoadMore = document.getElementById('btnBlogLoadMore');
const blogLoadMoreWrap = document.getElementById('blogLoadMoreWrap');

function abrirModal(modal) {
  if (!modal) return;
  modal.style.display = 'flex';
  modal.classList.add('active');
}
function fecharModal(modal) {
  if (!modal) return;
  modal.style.display = 'none';
  modal.classList.remove('active');
}

// Abrir modal login — botão "Entrar como criadora"
if (btnBlogLogin) {
  btnBlogLogin.addEventListener('click', () => abrirModal(modalBlogLogin));
}

// Fechar modal login — botão X e clique no overlay
const btnCloseBlogLogin = document.getElementById('btnCloseBlogLogin');
if (btnCloseBlogLogin && modalBlogLogin) {
  btnCloseBlogLogin.addEventListener('click', () => fecharModal(modalBlogLogin));
  modalBlogLogin.addEventListener('click', (e) => {
    if (e.target === modalBlogLogin) fecharModal(modalBlogLogin);
  });
}

// Login
if (formBlogLogin) {
  formBlogLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = document.getElementById('blogLoginUser').value.trim();
    const pass = document.getElementById('blogLoginPass').value;

    blogLoginError.style.display = 'none';

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass }),
      });
      const data = await res.json();

      if (data.success && data.token) {
        blogToken = data.token;
        blogUser = data.user || user;
        sessionStorage.setItem('blogToken', blogToken);
        sessionStorage.setItem('blogUser', blogUser);

        fecharModal(modalBlogLogin);
        formBlogLogin.reset();
        atualizarUIBlog();
        carregarPosts();
      } else {
        blogLoginError.textContent = data.message || 'Credenciais inválidas';
        blogLoginError.style.display = 'block';
      }
    } catch (err) {
      blogLoginError.textContent = 'Erro ao conectar com o servidor.';
      blogLoginError.style.display = 'block';
    }
  });
}

// Logout
if (btnBlogLogout) {
  btnBlogLogout.addEventListener('click', () => {
    blogToken = null;
    blogUser = null;
    sessionStorage.removeItem('blogToken');
    sessionStorage.removeItem('blogUser');
    atualizarUIBlog();
    carregarPosts();
  });
}

// Cancelar novo post
const btnCancelarBlogPost = document.getElementById('btnCancelarBlogPost');
if (btnCancelarBlogPost) {
  btnCancelarBlogPost.addEventListener('click', () => fecharModal(modalBlogPost));
}

// Salvar (criar ou editar)
if (formBlogPost) {
  formBlogPost.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('blogPostTitulo').value.trim();
    const content = document.getElementById('blogPostConteudo').value.trim();
    const imagemFile = document.getElementById('blogPostImagem').files[0];

    blogPostError.style.display = 'none';

    if (!blogToken) {
      blogPostError.textContent = 'Faça login primeiro.';
      blogPostError.style.display = 'block';
      return;
    }

    try {
      if (editingPostId) {
        const formData = new FormData();
        if (title) formData.append('title', title);
        if (content) formData.append('content', content);
        if (imagemFile) formData.append('imagem', imagemFile);

        const res = await fetch(`/api/posts/${editingPostId}`, {
          method: 'PUT',
          headers: { Authorization: 'Bearer ' + blogToken },
          body: formData,
        });

        if (res.ok) {
          fecharModal(modalBlogPost);
          carregarPosts();
        } else {
          const data = await res.json();
          blogPostError.textContent = data.message || 'Erro ao atualizar post.';
          blogPostError.style.display = 'block';
        }
      } else {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('author', blogUser);
        if (imagemFile) formData.append('imagem', imagemFile);

        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + blogToken },
          body: formData,
        });

        if (res.ok) {
          fecharModal(modalBlogPost);
          carregarPosts();
        } else {
          const data = await res.json();
          blogPostError.textContent = data.message || 'Erro ao publicar.';
          blogPostError.style.display = 'block';
        }
      }
    } catch (err) {
      blogPostError.textContent = 'Erro ao conectar com o servidor.';
      blogPostError.style.display = 'block';
    }
  });
}

// Abrir modal novo post
if (btnBlogNovoPost) {
  btnBlogNovoPost.addEventListener('click', () => {
    if (!blogToken) {
      abrirModal(modalBlogLogin);
      return;
    }
    editingPostId = null;
    document.getElementById('modalBlogPostTitulo').textContent = 'Nova Postagem';
    document.getElementById('blogPostId').value = '';
    document.getElementById('blogPostTitulo').value = '';
    document.getElementById('blogPostConteudo').value = '';
    document.getElementById('blogPostImagem').value = '';
    document.getElementById('blogPostTitulo').required = true;
    document.getElementById('blogPostConteudo').required = true;
    blogPostError.style.display = 'none';
    abrirModal(modalBlogPost);
  });
}

// Abrir modal para editar
window.abrirEdicaoPost = async (id) => {
  if (!blogToken) {
    abrirModal(modalBlogLogin);
    return;
  }
  try {
    const res = await fetch('/api/posts');
    const posts = await res.json();
    const post = posts.find(p => p.id == id);
    if (!post) {
      blogPostError.textContent = 'Post não encontrado.';
      blogPostError.style.display = 'block';
      return;
    }

    editingPostId = post.id;
    document.getElementById('modalBlogPostTitulo').textContent = 'Editar Postagem';
    document.getElementById('blogPostId').value = post.id;
    document.getElementById('blogPostTitulo').value = post.title || '';
    document.getElementById('blogPostConteudo').value = post.content || '';
    document.getElementById('blogPostTitulo').required = false;
    document.getElementById('blogPostConteudo').required = false;
    document.getElementById('blogPostImagem').value = '';
    blogPostError.style.display = 'none';

    abrirModal(modalBlogPost);
  } catch (err) {
    blogPostError.textContent = 'Erro ao carregar post.';
    blogPostError.style.display = 'block';
  }
};

// Excluir post
window.excluirPost = async (id) => {
  if (!blogToken) {
    abrirModal(modalBlogLogin);
    return;
  }
  if (!confirm('Tem certeza que deseja excluir este post?')) return;

  try {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + blogToken },
    });
    if (res.ok) {
      carregarPosts();
    } else {
      alert('Erro ao excluir post.');
    }
  } catch (err) {
    alert('Erro ao conectar com o servidor.');
  }
};

// Atualizar UI conforme estado de login
function atualizarUIBlog() {
  const logado = !!blogToken;

  if (btnBlogLogin) btnBlogLogin.style.display = logado ? 'none' : 'inline-flex';
  if (btnBlogNovoPost) btnBlogNovoPost.style.display = logado ? 'inline-flex' : 'none';
  if (btnBlogLogout) btnBlogLogout.style.display = logado ? 'inline-flex' : 'none';
  if (blogUserLabel) {
    blogUserLabel.style.display = logado ? 'flex' : 'none';
    blogUserLabel.innerHTML = logado ? `👩‍💼 ${blogUser}` : '';
  }
}

// Calcular tempo de leitura (aprox. 200 palavras por minuto)
function tempoLeitura(texto) {
  const palavras = texto.trim().split(/\s+/).length;
  const minutos = Math.ceil(palavras / 200);
  return minutos < 1 ? '1 min' : `${minutos} min`;
}

// Escape HTML simples para evitar XSS básico
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Extrair categorias únicas dos posts
function getCategorias(posts) {
  const cats = new Set(['todos']);
  for (const p of posts) {
    if (p.category) cats.add(p.category);
  }
  return Array.from(cats);
}

// Renderizar pills de categoria
function renderCategorias(categorias) {
  if (!blogCategories) return;
  blogCategories.innerHTML = categorias.map(cat => `
    <button type="button" class="blog-category-pill ${cat === currentFilter ? 'active' : ''}" data-category="${escapeHtml(cat)}">
      ${escapeHtml(cat)}
    </button>
  `).join('');

  blogCategories.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.getAttribute('data-category');
      currentPage = 1;
      blogCategories.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPosts();
    });
  });
}

// Filtrar e buscar posts
function filtrarPosts(posts) {
  let resultado = posts;

  // Filtro por categoria
  if (currentFilter !== 'todos') {
    resultado = resultado.filter(p => p.category === currentFilter);
  }

  // Busca por texto
  if (currentSearch) {
    const termo = currentSearch.toLowerCase();
    resultado = resultado.filter(p =>
      (p.title || '').toLowerCase().includes(termo) ||
      (p.content || '').toLowerCase().includes(termo) ||
      (p.author || '').toLowerCase().includes(termo) ||
      (p.category || '').toLowerCase().includes(termo)
    );
  }

  return resultado.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
}

// Renderizar posts com paginação
function renderPosts() {
  if (!blogGrid) return;

  const filtrados = filtrarPosts(allPosts);
  const total = filtrados.length;
  const inicio = 0;
  const fim = currentPage * POSTS_PER_PAGE;
  const paraMostrar = filtrados.slice(inicio, fim);
  const temMais = fim < total;

  // Atualizar status
  if (blogStatus) {
    if (currentSearch || currentFilter !== 'todos') {
      blogStatus.textContent = `${total} artigo${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`;
    } else {
      blogStatus.textContent = '';
    }
  }

  // Mostrar ou esconder "carregar mais"
  if (blogLoadMoreWrap) {
    blogLoadMoreWrap.hidden = !temMais;
  }

  if (paraMostrar.length === 0) {
    blogGrid.innerHTML = `
      <div class="blog-empty">
        <h3>Nenhum artigo encontrado</h3>
        <p>Tente ajustar a busca ou escolher outra categoria.</p>
        ${blogToken ? '<button class="blog-btn-primary" onclick="document.getElementById(\'btnBlogNovoPost\').click()">Criar primeiro artigo</button>' : ''}
      </div>
    `;
    return;
  }

  const logado = !!blogToken;

  blogGrid.innerHTML = paraMostrar.map(post => `
    <article class="blog-card">
      <div class="blog-card-img-wrap">
        ${post.image
          ? `<img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" class="blog-card-img" loading="lazy">`
          : `<div class="blog-card-img-placeholder">Sem imagem</div>`
        }
        <span class="blog-card-category">${escapeHtml(post.category || 'Artigos')}</span>
        <span class="blog-card-read-time">⏱ ${tempoLeitura(post.content || '')}</span>
      </div>
      <div class="blog-card-body">
        <div class="blog-card-meta">
          <span>📅 ${new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
          <span>✍️ ${escapeHtml(post.author)}</span>
        </div>
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml((post.content || '').substring(0, 200))}${post.content && post.content.length > 200 ? '…' : ''}</p>
        <div class="blog-card-actions">
          <button type="button" class="blog-btn-like" aria-label="Curtir" onclick="toggleLike(this, ${post.id})">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3.5 1.54-3.5 3.5 0 1.74 1.18 2.97 2.16 3.99 0.96-1.02 2.16-2.25 2.16-3.99 0-1.96-1.55-3.5-3.5-3.5S10.5 1.04 10.5 3c0 2.29 1.51 4.04 3 5.5 1.49 1.46 3 3.21 3 5.5 0 2.29-1.51 4.04-3 5.5-1.49-1.46-3-3.21-3-5.5 0-1.96 1.55-3.5 3.5-3.5 1.96 0 3.5 1.54 3.5 3.5 0 2.29-1.51 4.04-3 5.5z"/></svg>
            <span id="like-count-${post.id}">0</span>
          </button>
          ${logado ? `<button type="button" class="blog-btn-outline" onclick="abrirEdicaoPost(${post.id})">Editar</button>` : ''}
          ${logado ? `<button type="button" class="blog-btn-danger" onclick="excluirPost(${post.id})">Excluir</button>` : ''}
          <button type="button" class="bookmark-btn" aria-label="Salvar" onclick="toggleBookmark(this, ${post.id})">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
          <a href="#blog" class="blog-btn-primary" onclick="abrirDetalhePost(${post.id})">Ler mais →</a>
        </div>
      </div>
    </article>
  `).join('');
}

// Carregar posts da API
async function carregarPosts() {
  if (!blogGrid) return;

  blogGrid.innerHTML = `
    <div style="grid-column:1/-1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px; color:var(--gray-500);">
      <div class="blog-skeleton" style="width:40px;height:40px;border-radius:50%;margin-bottom:12px;"></div>
      <div class="blog-skeleton" style="width:120px;height:20px;margin-bottom:8px;"></div>
      <p style="margin-top:12px;">Carregando artigos…</p>
    </div>
  `;

  try {
    const res = await fetch('/api/posts');
    const posts = await res.json();

    allPosts = posts || [];

    renderCategorias(getCategorias(allPosts));
    renderPosts();

  } catch (err) {
    blogGrid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; color:#c0392b; padding:40px 0;">
        <p>Erro ao carregar artigos. Verifique se o servidor está rodando.</p>
        <button class="blog-btn-primary" onclick="carregarPosts()">Tentar novamente</button>
      </div>
    `;
  }
}

// Busca em tempo real
if (blogSearchInput) {
  blogSearchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.trim();
    currentPage = 1;
    if (btnBlogSearchClear) btnBlogSearchClear.hidden = !currentSearch;
    renderPosts();
  });
}

if (btnBlogSearchClear) {
  btnBlogSearchClear.addEventListener('click', () => {
    blogSearchInput.value = '';
    currentSearch = '';
    btnBlogSearchClear.hidden = true;
    currentPage = 1;
    renderPosts();
    blogSearchInput.focus();
  });
}

// Carregar mais
if (btnBlogLoadMore) {
  btnBlogLoadMore.addEventListener('click', () => {
    currentPage++;
    renderPosts();
  });
}

// Curtir post (localStorage)
function toggleLike(btn, postId) {
  const likes = JSON.parse(localStorage.getItem('blogLikes') || '{}');
  const countEl = document.getElementById(`like-count-${postId}`);
  let count = parseInt(countEl?.textContent || '0', 10);

  if (likes[postId]) {
    delete likes[postId];
    count--;
    btn.classList.remove('liked');
  } else {
    likes[postId] = true;
    count++;
    btn.classList.add('liked');
  }

  localStorage.setItem('blogLikes', JSON.stringify(likes));
  if (countEl) countEl.textContent = count.toString();
}

// Favoritar post (localStorage)
function toggleBookmark(btn, postId) {
  const bookmarks = JSON.parse(localStorage.getItem('blogBookmarks') || '{}');

  if (bookmarks[postId]) {
    delete bookmarks[postId];
    btn.classList.remove('bookmarked');
  } else {
    bookmarks[postId] = true;
    btn.classList.add('bookmarked');
  }

  localStorage.setItem('blogBookmarks', JSON.stringify(bookmarks));
}

// Inicializar blog se a seção existir
function initBlog() {
  if (!document.getElementById('blog')) return;

  // Restaurar login da sessão
  const savedToken = sessionStorage.getItem('blogToken');
  const savedUser = sessionStorage.getItem('blogUser');
  if (savedToken) {
    blogToken = savedToken;
    blogUser = savedUser;
  }

  atualizarUIBlog();
  carregarPosts();
}

initBlog();

// ===== DETALHE DO POST + COMENTÁRIOS =====

if (btnCloseBlogDetalhe && modalBlogDetalhe) {
  btnCloseBlogDetalhe.addEventListener('click', () => fecharModal(modalBlogDetalhe));
}

if (modalBlogDetalhe) {
  modalBlogDetalhe.addEventListener('click', (e) => {
    if (e.target === modalBlogDetalhe) fecharModal(modalBlogDetalhe);
  });
}

// Abrir modal de detalhe do post
window.abrirDetalhePost = async (id) => {
  if (!modalBlogDetalhe || !modalDetalheConteudo) return;

  abrirModal(modalBlogDetalhe);
  modalDetalheConteudo.innerHTML = `
    <div style="text-align:center; padding:20px; color:var(--text-light);">
      <div style="width:40px;height:40px;border:3px solid var(--brown);border-top:3px solid transparent;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 16px;"></div>
      <p>Carregando post…</p>
    </div>
  `;

  try {
    const [postRes, commentsRes] = await Promise.all([
      fetch(`/api/posts/${id}`),
      fetch(`/api/posts/${id}/comments`),
    ]);
    const post = await postRes.json();
    const comments = await commentsRes.json();

    modalDetalheConteudo.innerHTML = `
      <div class="blog-detalhe-header">
        ${post.image ? `<img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" class="blog-detalhe-img">` : `<div class="blog-detalhe-img-placeholder">Sem imagem</div>`}
        <div class="blog-detalhe-meta">
          <span>📅 ${new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
          <span>✍️ ${escapeHtml(post.author)}</span>
          <span>💬 ${comments.length} comentário${comments.length !== 1 ? 's' : ''}</span>
        </div>
        <h2 class="blog-detalhe-titulo">${escapeHtml(post.title)}</h2>
      </div>
      <div class="blog-detalhe-conteudo">
        <p>${escapeHtml(post.content)}</p>
      </div>

      <div class="blog-detalhe-comentarios">
        <h3 class="blog-detalhe-comentarios-titulo">Comentários (${comments.length})</h3>

        <div id="blogDetalheComentariosLista" class="blog-detalhe-comentarios-lista">
          ${comments.length === 0
            ? `<p style="color:var(--text-light); text-align:center; padding:20px;">Nenhum comentário ainda. Seja o primeiro!</p>`
            : comments.map(c => `
                <div class="blog-detalhe-comentario">
                  <div class="blog-detalhe-comentario-header">
                    <strong>${escapeHtml(c.name)}</strong>
                    <span>${new Date(c.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <p>${escapeHtml(c.content)}</p>
                </div>
              `).join('')
          }
        </div>

        <form id="blogFormNovoComentario" class="blog-detalhe-comentario-form">
          <div style="margin-bottom:14px;">
            <label style="display:block; font-size:0.85rem; font-weight:700; color:#5B5E54; margin-bottom:8px; letter-spacing:0.02em;">Seu nome</label>
            <input type="text" id="blogComentarioNome" placeholder="Como você gostaria de ser chamado" required maxlength="60" style="width:100%; padding:12px 16px; border:1px solid rgba(123,123,86,0.15); border-radius:14px; background:rgba(255,255,255,0.9); color:var(--text); font-size:0.95rem; font-family:inherit;">
          </div>
          <div style="margin-bottom:14px;">
            <label style="display:block; font-size:0.85rem; font-weight:700; color:#5B5E54; margin-bottom:8px; letter-spacing:0.02em;">Seu comentário</label>
            <textarea id="blogComentarioTexto" rows="4" placeholder="Escreva seu comentário aqui…" required style="width:100%; padding:12px 16px; border:1px solid rgba(123,123,86,0.15); border-radius:14px; background:rgba(255,255,255,0.9); color:var(--text); font-size:0.95rem; font-family:inherit; resize:vertical; min-height:100px;"></textarea>
          </div>
          <div id="blogComentarioError" style="color:#c0392b; font-size:0.85rem; margin-top:8px; display:none;"></div>
          <button type="submit" class="blog-btn-primary">Enviar comentário</button>
        </form>
      </div>
    `;

    // Enviar comentário
    const formComentario = document.getElementById('blogFormNovoComentario');
    const comentarioError = document.getElementById('blogComentarioError');

    if (formComentario) {
      formComentario.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('blogComentarioNome').value.trim();
        const content = document.getElementById('blogComentarioTexto').value.trim();

        comentarioError.style.display = 'none';

        try {
          const res = await fetch(`/api/posts/${id}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, content }),
          });

          if (res.ok) {
            const newComment = await res.json();
            const lista = document.getElementById('blogDetalheComentariosLista');
            lista.innerHTML = `
              <div class="blog-detalhe-comentario">
                <div class="blog-detalhe-comentario-header">
                  <strong>${escapeHtml(newComment.name)}</strong>
                  <span>${new Date(newComment.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <p>${escapeHtml(newComment.content)}</p>
              </div>
              ${lista.innerHTML.replace(/<p style="color:var\(--text-light\);\s*text-align:center;\s*padding:20px;">Nenhum comentário ainda\. Seja o primeiro!<\/p>/, '')}
            `;
            formComentario.reset();
            const contador = modalDetalheConteudo.querySelector('.blog-detalhe-comentarios-titulo');
            if (contador) {
              const atual = parseInt(contador.textContent.match(/\d+/)[0]);
              contador.textContent = `Comentários (${atual + 1})`;
            }
          } else {
            comentarioError.textContent = 'Erro ao enviar comentário.';
            comentarioError.style.display = 'block';
          }
        } catch (err) {
          comentarioError.textContent = 'Erro ao conectar com o servidor.';
          comentarioError.style.display = 'block';
        }
      });
    }

  } catch (err) {
    modalDetalheConteudo.innerHTML = `
      <div style="text-align:center; padding:40px; color:#c0392b;">
        <p>Erro ao carregar o post.</p>
        <button class="blog-btn-primary" onclick="fecharModal(modalBlogDetalhe)">Fechar</button>
      </div>
    `;
  }
};

// ===== ACTIVE NAV LINK =====
const sectionLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));

if (sectionLinks.length) {
  const linkSections = sectionLinks
    .map((link) => {
      const section = document.querySelector(link.getAttribute('href'));
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  const setActiveLink = () => {
    const marker = window.scrollY + window.innerHeight * 0.32;
    let current = null;

    linkSections.forEach(({ link, section }) => {
      if (section.offsetTop <= marker) {
        current = link;
      }
    });

    sectionLinks.forEach((link) => {
      link.classList.toggle('is-active', link === current);
    });
  };

  let navTick = false;
  window.addEventListener('scroll', () => {
    if (navTick) return;
    navTick = true;
    requestAnimationFrame(() => {
      setActiveLink();
      navTick = false;
    });
  }, { passive: true });

  setActiveLink();
}
