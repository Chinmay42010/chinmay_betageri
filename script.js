history.scrollRestoration = "manual";
window.scrollTo(0, 0);

document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const intro = document.getElementById("introOverlay");

if (intro && !reduceMotion) {
  intro.classList.add("show");
  window.setTimeout(() => {
    intro.classList.add("done");
  }, 1600);
  window.setTimeout(() => {
    intro.classList.add("hidden");
    document.body.classList.add("ready");
  }, 2400);
} else {
  document.body.classList.add("ready");
}

const nav = document.getElementById("nav");

function onScroll() {
  nav.classList.toggle("scrolled", window.scrollY > 40);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("active");
}

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    document.getElementById("navLinks").classList.remove("active");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  { threshold: 0.1 },
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === "r" || e.key === "R") {
    const a = document.createElement("a");
    a.href = "Chinmay Betageri FS.pdf";
    a.download = "Chinmay Betageri FS.pdf";
    a.click();
  }
});