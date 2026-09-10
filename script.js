/* ============================================
   NAVIGATION SCROLL EFFECT
   ============================================ */
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

/* ============================================
   SMOOTH SCROLL
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
const observerOptions = {
  threshold: 0.08,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => {
  observer.observe(el);
});

/* ============================================
   HERO CANVAS — PARTICLE CONSTELLATION
   ============================================ */
const canvas = document.getElementById('heroCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let animId;
  const dpr = window.devicePixelRatio || 1;
  let mouseX = -1000, mouseY = -1000;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 6000), 80);
    const colors = [
      { r: 59, g: 130, b: 246 },   // blue
      { r: 139, g: 92, b: 246 },   // violet
      { r: 34, g: 211, b: 238 },   // cyan
      { r: 52, g: 211, b: 153 },   // emerald
    ];
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 1,
        color,
        pulse: Math.random() * Math.PI * 2,
        baseOpacity: Math.random() * 0.4 + 0.2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const time = Date.now() * 0.001;

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 140;

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.12;
          const c1 = particles[i].color;
          const c2 = particles[j].color;
          const gradient = ctx.createLinearGradient(
            particles[i].x, particles[i].y,
            particles[j].x, particles[j].y
          );
          gradient.addColorStop(0, `rgba(${c1.r}, ${c1.g}, ${c1.b}, ${opacity})`);
          gradient.addColorStop(1, `rgba(${c2.r}, ${c2.g}, ${c2.b}, ${opacity})`);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Mouse connections
    for (let i = 0; i < particles.length; i++) {
      const dx = particles[i].x - mouseX;
      const dy = particles[i].y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        const opacity = (1 - dist / 200) * 0.2;
        const c = particles[i].color;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${opacity})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }

    // Draw particles
    particles.forEach(p => {
      const pulse = Math.sin(time * 1.5 + p.pulse) * 0.3 + 0.7;
      const c = p.color;

      // Outer glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${0.04 * pulse})`;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${p.baseOpacity * pulse})`;
      ctx.fill();

      // Bright center
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * pulse})`;
      ctx.fill();

      // Mouse repulsion
      const mdx = p.x - mouseX;
      const mdy = p.y - mouseY;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mDist < 150 && mDist > 0) {
        const force = (150 - mDist) / 150 * 0.5;
        p.vx += (mdx / mDist) * force;
        p.vy += (mdy / mDist) * force;
      }

      // Damping
      p.vx *= 0.99;
      p.vy *= 0.99;

      // Speed limit
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 1.5) {
        p.vx = (p.vx / speed) * 1.5;
        p.vy = (p.vy / speed) * 1.5;
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) { p.x = 0; p.vx *= -0.5; }
      if (p.x > width) { p.x = width; p.vx *= -0.5; }
      if (p.y < 0) { p.y = 0; p.vy *= -0.5; }
      if (p.y > height) { p.y = height; p.vy *= -0.5; }
    });

    animId = requestAnimationFrame(draw);
  }

  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  canvas.parentElement.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  resize();
  createParticles();
  draw();

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      cancelAnimationFrame(animId);
      resize();
      createParticles();
      draw();
    }, 150);
  });
}

/* ============================================
   CONTACT FORM
   ============================================ */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span>Message Sent!</span>';
    btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
    btn.style.boxShadow = '0 0 30px rgba(16, 185, 129, 0.3)';
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.style.boxShadow = '';
      form.reset();
    }, 2500);
  });
}

/* ============================================
   ACTIVE NAV LINK ON SCROLL
   ============================================ */
const sections = document.querySelectorAll('.section, .hero');
const navLinksList = document.querySelectorAll('.nav-link');

function setActiveLink() {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });
  navLinksList.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', setActiveLink);
setActiveLink();

/* ============================================
   TILT EFFECT ON PROJECT CARDS
   ============================================ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / centerY * -3;
    const rotateY = (x - centerX) / centerX * 3;
    card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ============================================
   MAGNETIC BUTTON EFFECT
   ============================================ */
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translateY(-2px) translate(${x * 0.15}px, ${y * 0.15}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ============================================
   TYPING EFFECT FOR CODE BLOCK
   ============================================ */
const codeBlock = document.querySelector('.code-body code');
if (codeBlock) {
  const fullHTML = codeBlock.innerHTML;
  codeBlock.innerHTML = '';
  codeBlock.style.visibility = 'visible';

  // Extract text content for typing
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = fullHTML;
  const fullText = tempDiv.textContent;

  let charIndex = 0;

  function typeCode() {
    if (charIndex <= fullText.length) {
      // Build partial HTML by mapping character index to HTML
      codeBlock.innerHTML = getPartialHTML(fullHTML, charIndex);
      charIndex++;
      const delay = Math.random() * 20 + 10;
      setTimeout(typeCode, delay);
    }
  }

  function getPartialHTML(html, maxChars) {
    let result = '';
    let visibleCount = 0;
    let inTag = false;
    let i = 0;

    while (i < html.length && visibleCount < maxChars) {
      if (html[i] === '<') {
        inTag = true;
        // Find the end of this tag
        const closeIndex = html.indexOf('>', i);
        if (closeIndex !== -1) {
          result += html.substring(i, closeIndex + 1);
          i = closeIndex + 1;
          inTag = false;
        } else {
          break;
        }
      } else {
        result += html[i];
        visibleCount++;
        i++;
      }
    }

    // Close any open tags
    const openTags = [];
    const tagRegex = /<\/?([a-zA-Z]+)[^>]*>/g;
    let match;
    const tempResult = result;
    while ((match = tagRegex.exec(tempResult)) !== null) {
      if (match[0][1] !== '/') {
        openTags.push(match[1]);
      } else {
        openTags.pop();
      }
    }
    for (let t = openTags.length - 1; t >= 0; t--) {
      result += `</${openTags[t]}>`;
    }

    return result;
  }

  // Start typing after a short delay
  setTimeout(typeCode, 800);
}