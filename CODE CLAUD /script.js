// ===== Mobile nav toggle =====
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// ===== Homepage scroll reveal =====
const revealTargets = document.querySelectorAll(
  ".work-card, .skill, .about-grid, .contact-headline"
);

if (!prefersReducedMotion && revealTargets.length > 0) {
  revealTargets.forEach((el) => el.classList.add("reveal"));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealTargets.forEach((el) => observer.observe(el));
}

// ===== Image deck + full-screen slideshow (project pages) =====
const deck = document.querySelector(".deck");

if (deck) {
  const cards = Array.from(deck.querySelectorAll(".deck-card"));
  const countEl = document.querySelector(".deck-count");
  let order = cards.map((_, i) => i); // order[0] = card on top

  // Position every card according to its depth in the stack
  const layout = () => {
    order.forEach((cardIndex, depth) => {
      const el = cards[cardIndex];
      const d = Math.min(depth, 3); // cards deeper than 3 hide behind
      el.style.zIndex = cards.length - depth;
      el.style.opacity = depth > 3 ? "0" : "1";
      el.style.transform =
        `translate(${d * 16}px, ${d * 12}px) ` +
        `rotate(${d * 2.4}deg) scale(${1 - d * 0.04})`;
    });
    if (countEl) countEl.textContent = `${order[0] + 1} / ${cards.length}`;
  };

  // Entrance: cards fly up into the stack one by one
  cards.forEach((el, i) => {
    setTimeout(() => {
      el.style.opacity = "1";
      layout();
    }, prefersReducedMotion ? 0 : 350 + i * 120);
  });

  // Arrows shuffle the stack
  const advance = (dir) => {
    if (dir > 0) order.push(order.shift());
    else order.unshift(order.pop());
    layout();
  };
  document.querySelectorAll(".deck-btn").forEach((btn) => {
    btn.addEventListener("click", () => advance(Number(btn.dataset.dir)));
  });

  // ===== Lightbox slideshow =====
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML =
    '<button class="lb-close" aria-label="Close">×</button>' +
    '<button class="lb-btn lb-prev" aria-label="Previous image">←</button>' +
    '<img src="" alt="" />' +
    '<button class="lb-btn lb-next" aria-label="Next image">→</button>' +
    '<span class="lb-count mono"></span>';
  document.body.appendChild(lightbox);

  const lbImg = lightbox.querySelector("img");
  const lbCount = lightbox.querySelector(".lb-count");
  let lbIndex = 0;

  const showSlide = (i) => {
    lbIndex = (i + cards.length) % cards.length; // wraps around
    lbImg.src = cards[lbIndex].src;
    lbImg.alt = cards[lbIndex].alt;
    lbCount.textContent = `${lbIndex + 1} / ${cards.length}`;
  };
  const openLb = (i) => { showSlide(i); lightbox.classList.add("open"); };
  const closeLb = () => lightbox.classList.remove("open");

  // Click the top card to open the slideshow at that image
  cards.forEach((card, i) => {
    card.addEventListener("click", () => {
      if (order[0] === i) openLb(i);
      else { // clicking a lower card brings it to the top
        order = [i, ...order.filter((n) => n !== i)];
        layout();
      }
    });
  });

  lightbox.querySelector(".lb-close").addEventListener("click", closeLb);
  lightbox.querySelector(".lb-prev").addEventListener("click", () => showSlide(lbIndex - 1));
  lightbox.querySelector(".lb-next").addEventListener("click", () => showSlide(lbIndex + 1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLb(); // click the dark backdrop to close
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowRight") showSlide(lbIndex + 1);
    if (e.key === "ArrowLeft") showSlide(lbIndex - 1);
  });
}

// ===== Footer year =====
document.getElementById("year").textContent = new Date().getFullYear();