// script.js

document.addEventListener("DOMContentLoaded", () => {
  // Scroll animation
  const sections = document.querySelectorAll(".section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal");
        }
      });
    },
    { threshold: 0.1 }
  );

  sections.forEach((section) => {
    section.classList.add("hidden");
    observer.observe(section);
  });

  // Sliding smooth scroll for nav links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
          const headerOffset = 80; // Adjust if your header height changes
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          // Sliding scroll animation
          const start = window.pageYOffset;
          const distance = offsetPosition - start;
          const duration = 700; // ms
          let startTime = null;

          function slideScroll(currentTime) {
            if (!startTime) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            // Ease in-out cubic
            const ease = t => t < 0.5
              ? 4 * t * t * t
              : 1 - Math.pow(-2 * t + 2, 3) / 2;
            const progress = Math.min(timeElapsed / duration, 1);
            window.scrollTo(0, start + distance * ease(progress));
            if (progress < 1) {
              requestAnimationFrame(slideScroll);
            }
          }
          requestAnimationFrame(slideScroll);
        }
      }
    });
  });

  // Sliding smooth scroll for sidebar navigation with scale animation
  const navLinks = document.querySelectorAll('.left-nav a');

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        let target;
        if (href === "#top") {
          target = document.body;
        } else {
          target = document.querySelector(href);
        }
        if (target) {
          // Remove scale from all sections first
          document.querySelectorAll('.section').forEach(sec => {
            sec.classList.remove('scale-section');
          });

          // Smooth scroll
          const targetPosition = href === "#top" ? 0 : target.getBoundingClientRect().top + window.pageYOffset - 20;
          smoothScrollTo(targetPosition, 700);

          // Add scale animation after scroll
          setTimeout(() => {
            if (href !== "#top" && target.classList.contains('section')) {
              target.classList.add('scale-section');
              setTimeout(() => {
                target.classList.remove('scale-section');
              }, 500); // Animation duration
            }
          }, 720); // Wait for scroll to finish
        }
      }
    });
  });

  function smoothScrollTo(targetY, duration) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    let startTime = null;

    function animation(currentTime) {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = 0.5 * (1 - Math.cos(Math.PI * progress)); // easeInOutSine
      window.scrollTo(0, startY + distance * ease);
      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    }
    requestAnimationFrame(animation);
  }

  // Optional: Make scroll-behavior slower for all smooth scrolls
  document.documentElement.style.scrollBehavior = "smooth";

  // Interactive "snake" cursor animation in the vertical space
  const cursorArea = document.getElementById('cursorArea');
  if (cursorArea) {
    const SEGMENTS = 12;
    const snake = [];
    for (let i = 0; i < SEGMENTS; i++) {
      const seg = document.createElement('div');
      seg.className = 'snake-segment';
      seg.style.opacity = `${0.7 - i * 0.05}`;
      cursorArea.appendChild(seg);
      snake.push({ el: seg, x: 0, y: 0 });
    }

    cursorArea.style.pointerEvents = 'auto';

    let mouseX = 170, mouseY = window.innerHeight / 2;
    let animating = false;

    cursorArea.addEventListener('mousemove', (e) => {
      const rect = cursorArea.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      if (!animating) {
        animating = true;
        requestAnimationFrame(function animate() {
          // Move head towards mouse
          snake[0].x += (mouseX - snake[0].x) * 0.35;
          snake[0].y += (mouseY - snake[0].y) * 0.35;
          snake[0].el.style.left = `${snake[0].x}px`;
          snake[0].el.style.top = `${snake[0].y}px`;

          // Each segment follows the previous
          for (let i = 1; i < SEGMENTS; i++) {
            snake[i].x += (snake[i - 1].x - snake[i].x) * 0.35;
            snake[i].y += (snake[i - 1].y - snake[i].y) * 0.35;
            snake[i].el.style.left = `${snake[i].x}px`;
            snake[i].el.style.top = `${snake[i].y}px`;
          }

          // Continue animating if close to mouse or still moving
          if (
            Math.abs(snake[0].x - mouseX) > 0.5 ||
            Math.abs(snake[0].y - mouseY) > 0.5
          ) {
            requestAnimationFrame(animate);
          } else {
            animating = false;
          }
        });
      }
    });

    cursorArea.addEventListener('mouseleave', () => {
      // Fade out snake segments
      snake.forEach((seg, i) => {
        seg.el.style.opacity = '0.15';
      });
    });

    cursorArea.addEventListener('mouseenter', () => {
      // Restore opacity
      snake.forEach((seg, i) => {
        seg.el.style.opacity = `${0.7 - i * 0.05}`;
      });
    });
  }

  // Galaxy debris animation in the interactive-cursor-area
  const debrisCount = 300;
  const debrisArray = [];
  if (cursorArea) {
    for (let i = 0; i < debrisCount; i++) {
      const d = document.createElement('div');
      d.className = 'galaxy-debris';
      // Randomize initial size and position
      const size = Math.random() * 3 + 1.5;
      d.style.width = `${size}px`;
      d.style.height = `${size}px`;
      d.style.left = `${Math.random() * cursorArea.offsetWidth}px`;
      d.style.top = `${Math.random() * cursorArea.offsetHeight}px`;
      d.style.opacity = Math.random() * 0.3 + 0.08;
      cursorArea.appendChild(d);
      debrisArray.push({
        el: d,
        x: parseFloat(d.style.left),
        y: parseFloat(d.style.top),
        speed: Math.random() * 1.5 + 0.7,
        drift: (Math.random() - 0.5) * 0.5,
        size: size
      });
    }

    function animateDebris() {
      for (let i = 0; i < debrisArray.length; i++) {
        let debris = debrisArray[i];
        debris.y += debris.speed;
        debris.x += debris.drift;
        // If out of bounds, respawn at top
        if (debris.y > cursorArea.offsetHeight + 10) {
          debris.y = -10;
          debris.x = Math.random() * cursorArea.offsetWidth;
          debris.speed = Math.random() * 1.5 + 0.7;
          debris.drift = (Math.random() - 0.5) * 0.5;
          debris.size = Math.random() * 3 + 1.5;
          debris.el.style.width = `${debris.size}px`;
          debris.el.style.height = `${debris.size}px`;
          debris.el.style.opacity = Math.random() * 0.3 + 0.08;
        }
        debris.el.style.transform = `translate(${debris.x}px, ${debris.y}px)`;
      }
      requestAnimationFrame(animateDebris);
    }
    animateDebris();
  }
});
