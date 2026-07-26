history.scrollRestoration = "manual";
window.scrollTo(0, 0);

function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("active");
}

function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
}

(function () {
  const saved = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
})();

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

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    document.getElementById("navLinks").classList.remove("active");
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "r" || e.key === "R") {
    const a = document.createElement("a");
    a.href = "Chinmay Betageri FS.pdf";
    a.download = "Chinmay Betageri FS.pdf";
    a.click();
  }
});
