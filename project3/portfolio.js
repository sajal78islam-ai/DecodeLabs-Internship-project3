'use strict';

// ============================================================
// 1. TYPEWRITER
// ============================================================
const roles = ['Frontend Developer.', 'DOM Enthusiast.', 'Accessibility-first.', 'Pixel-precise.'];
const typewriterEl = document.getElementById('typewriter');
let roleIdx = 0,
  charIdx = 0,
  deleting = false;

function typewriterTick() {
  const full = roles[roleIdx];
  typewriterEl.textContent = deleting ? full.slice(0, charIdx - 1) : full.slice(0, charIdx + 1);
  charIdx += deleting ? -1 : 1;

  let delay = deleting ? 40 : 70;

  if (!deleting && charIdx === full.length) {
    delay = 1200;
    deleting = true;
  } else if (deleting && charIdx === 0) {
    deleting = false;
    roleIdx = (roleIdx + 1) % roles.length;
    delay = 300;
  }
  setTimeout(typewriterTick, delay);
}
typewriterTick();

// ============================================================
//                  2. PROJECTS DATA 
// ============================================================
const PROJECTS = [
  {
    id: 'p1',
    tag: '01',
    category: 'internship',
    title: 'decode lab project 1',
    stack: ['HTML', 'CSS'],
    code: 'https://github.com/sajal78islam-ai/DecodeLabs-Internship-project1'
  },
  {
    id: 'p2',
    tag: '02',
    category: 'internship',
    title: 'decode lab project2',
    stack: ['HTML', 'CSS', 'JavaScript'],
    code: 'https://github.com/sajal78islam-ai/DecodeLabs-Internship-project2'
  },
  {
    id: 'p3',
    tag: '03',
    category: 'internship',
    title: 'decode lab project3',
    stack: ['HTML', 'CSS', 'JavaScript', 'Responsive UI'],
    code: 'https://github.com/sajal78islam-ai/DecodeLabs-Internship-project3'
  }
];

const CAT_LABEL = {
  internship: 'DecodeLabs Training Platform'
};

// ============================================================
// 3. RENDER PROJECTS
// ============================================================
const grid = document.querySelector('.js-project-grid');

function renderProjects() {
  grid.innerHTML = '';

  PROJECTS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card';

    const stackHtml = p.stack.map(s => `<span>${s}</span>`).join('');

    card.innerHTML = `
      <span class="project-tag">${p.tag}</span>
      <h3 class="project-title">${p.title}</h3>
      <span class="project-cat">${CAT_LABEL[p.category] || p.category}</span>
      <div class="project-stack" style="margin-top: 12px;">${stackHtml}</div>
      <div class="project-links">
        <a href="${p.code}" target="_blank" rel="noopener">
          GitHub Repository
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 17L17 7"/><path d="M8 7h9v9"/>
          </svg>
        </a>
      </div>
    `;

    grid.appendChild(card);
  });
}

renderProjects();

// ============================================================
// 4. SKILL BARS — animate once on scroll
// ============================================================
let skillsAnimated = false;

function animateSkills() {
  document.querySelectorAll('.skill-row').forEach(row => {
    const level = parseInt(row.dataset.level, 10);
    const fill = row.querySelector('.js-skill-fill');
    const pct = row.querySelector('.js-skill-pct');
    fill.style.width = level + '%';
    pct.textContent = level + '%';
  });
  skillsAnimated = true;
}

const skillsSection = document.getElementById('skills');
const skillsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !skillsAnimated) {
      animateSkills();
    }
  });
}, { threshold: 0.3 });

skillsObserver.observe(skillsSection);

// Re-measure button
document.querySelector('.js-remeasure').addEventListener('click', () => {
  document.querySelectorAll('.js-skill-fill').forEach(f => { f.style.width = '0%'; });
  document.querySelectorAll('.js-skill-pct').forEach(p => { p.textContent = '0%'; });
  // Force reflow
  void skillsSection.offsetWidth;
  setTimeout(animateSkills, 60);
});

// ============================================================
// 5. CONTACT FORM VALIDATION
// ============================================================
const contactForm = document.querySelector('.js-contact-form');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const messageInput = document.getElementById('messageInput');
const charCount = document.querySelector('.js-char-count');
const formStatus = document.querySelector('.js-form-status');
const MAX_MESSAGE = 400;

function setError(input, message) {
  const field = input.closest('.form-field');
  const errorEl = field.querySelector('.js-error');
  field.classList.toggle('has-error', Boolean(message));
  errorEl.textContent = message || '';
}

function validateName() {
  const val = nameInput.value.trim();
  if (!val) { setError(nameInput, 'Please enter your name.'); return false; }
  if (val.length < 2) { setError(nameInput, 'Name looks too short.'); return false; }
  setError(nameInput, '');
  return true;
}

function validateEmail() {
  const val = emailInput.value.trim();
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!val) { setError(emailInput, 'Please enter your email.'); return false; }
  if (!pattern.test(val)) { setError(emailInput, 'That email address doesn\'t look valid.'); return false; }
  setError(emailInput, '');
  return true;
}

function validateMessage() {
  const val = messageInput.value.trim();
  if (!val) { setError(messageInput, 'Tell me a bit about the project.'); return false; }
  if (val.length < 10) { setError(messageInput, 'A little more detail would help.'); return false; }
  setError(messageInput, '');
  return true;
}

nameInput.addEventListener('blur', validateName);
emailInput.addEventListener('blur', validateEmail);
messageInput.addEventListener('blur', validateMessage);

messageInput.addEventListener('input', () => {
  let len = messageInput.value.length;
  if (len > MAX_MESSAGE) {
    messageInput.value = messageInput.value.slice(0, MAX_MESSAGE);
    len = MAX_MESSAGE;
  }
  charCount.textContent = len + ' / ' + MAX_MESSAGE;
});

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const validName = validateName();
  const validEmail = validateEmail();
  const validMessage = validateMessage();

  if (validName && validEmail && validMessage) {
    const firstName = nameInput.value.trim().split(' ')[0];
    formStatus.textContent = 'Thanks ' + firstName + ' — message captured. (Demo form: no server is wired up yet.)';
    contactForm.reset();
    charCount.textContent = '0 / ' + MAX_MESSAGE;
    showToast('Message ready to send');
  } else {
    formStatus.textContent = 'Please fix the highlighted fields.';
    const firstError = contactForm.querySelector('.has-error input, .has-error textarea');
    if (firstError) firstError.focus();
  }
});

// ============================================================
// 6. TOAST
// ============================================================
const toastEl = document.querySelector('.js-toast');
let toastTimer = null;

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 2400);
}

// ============================================================
// 7. THEME TOGGLE
// ============================================================
const themeToggle = document.querySelector('.js-theme-toggle');
const themeIcon = document.querySelector('.js-theme-icon');

themeToggle.addEventListener('click', function() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  document.documentElement.setAttribute('data-theme', isLight ? 'dark' : 'light');
  this.setAttribute('aria-pressed', String(isLight));
  themeIcon.textContent = isLight ? '☀' : '☽';
});

// ============================================================
// 8. MOBILE NAV
// ============================================================
const navToggle = document.querySelector('.js-nav-toggle');
const navList = document.querySelector('.js-nav-list');

navToggle.addEventListener('click', function() {
  const isOpen = navList.classList.toggle('js-open');
  this.setAttribute('aria-expanded', String(isOpen));
});

navList.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    navList.classList.remove('js-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

// ============================================================
// 9. BACK TO TOP
// ============================================================
document.querySelector('.js-back-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// 10. KEYBOARD SHORTCUT: Escape to close mobile nav
// ============================================================
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navList.classList.contains('js-open')) {
    navList.classList.remove('js-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.focus();
  }
});
