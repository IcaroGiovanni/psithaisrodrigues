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