history.scrollRestoration = "manual";
window.scrollTo(0, 0);

document.documentElement.classList.add("js");

const themeToggle = document.getElementById("themeToggle");

function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    themeToggle.setAttribute(
        "aria-checked",
        theme === "light" ? "true" : "false",
    );
}

if (themeToggle) {
    setTheme(document.documentElement.dataset.theme);
    themeToggle.addEventListener("click", () => {
        const next =
            document.documentElement.dataset.theme === "dark"
                ? "light"
                : "dark";
        setTheme(next);
    });
}

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
).matches;
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

const navLinks = document.getElementById("navLinks");
const hamburger = document.getElementById("hamburger");

function closeMenu() {
    navLinks.classList.remove("active");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
}

function toggleMenu() {
    const open = navLinks.classList.toggle("active");
    hamburger.classList.toggle("active", open);
    hamburger.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
}

document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("click", (e) => {
    if (navLinks.classList.contains("active") && !nav.contains(e.target)) {
        closeMenu();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
});

function setAccordion(header, expand) {
    if (!window.matchMedia("(max-width: 768px)").matches) return;
    const body = document.getElementById(header.getAttribute("aria-controls"));
    if (!body) return;
    header.setAttribute("aria-expanded", String(expand));
    body.style.maxHeight = expand ? body.scrollHeight + "px" : "0px";
}

document.querySelectorAll(".accordion-header").forEach((header) => {
    const toggle = () => {
        const willExpand = header.getAttribute("aria-expanded") !== "true";
        document.querySelectorAll(".accordion-header").forEach((h) => {
            if (h !== header) setAccordion(h, false);
        });
        setAccordion(header, willExpand);
    };
    header.addEventListener("click", toggle);
    header.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
        }
    });
});

window.addEventListener("resize", () => {
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    document.querySelectorAll(".accordion-header").forEach((header) => {
        const body = document.getElementById(
            header.getAttribute("aria-controls"),
        );
        if (!body) return;
        if (!mobile) {
            body.style.maxHeight = "";
        } else if (header.getAttribute("aria-expanded") === "true") {
            body.style.maxHeight = body.scrollHeight + "px";
        }
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

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxLink = document.getElementById("lightboxLink");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(cert) {
    if (!lightbox) return;
    lightboxImg.src = cert.dataset.certImg;
    lightboxImg.alt = cert.getAttribute("aria-label");
    lightboxLink.href = cert.dataset.certUrl;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
}

document.querySelectorAll(".cert-thumb").forEach((thumb) => {
    thumb.addEventListener("click", (e) => {
        e.stopPropagation();
        openLightbox(thumb);
    });
});

document.querySelectorAll(".cert-name").forEach((name) => {
    name.addEventListener("click", (e) => {
        e.stopPropagation();
        openLightbox(name.closest(".cert-row").querySelector(".cert-thumb"));
    });
});

document.querySelectorAll(".cert-row").forEach((row) => {
    row.addEventListener("click", (e) => {
        if (e.target.classList.contains("cert-view")) return;
        const thumb = row.querySelector(".cert-thumb");
        if (thumb) openLightbox(thumb);
    });
});

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

if (lightbox) {
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
});

document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "r" || e.key === "R") {
        const a = document.createElement("a");
        a.href = "Chinmay Betageri.pdf";
        a.download = "Chinmay Betageri.pdf";
        a.click();
    }
});

// hero photo cursor tilt — rAF throttled
const heroVisual = document.querySelector(".hero-visual");
const heroPhoto = document.querySelector(".hero-photo");
if (
    heroVisual &&
    heroPhoto &&
    !reduceMotion &&
    window.matchMedia("(hover: hover)").matches
) {
    let raf = 0;
    let mx = 0,
        my = 0;
    heroVisual.addEventListener("mousemove", (e) => {
        const r = heroVisual.getBoundingClientRect();
        mx = (e.clientX - r.left) / r.width - 0.5;
        my = (e.clientY - r.top) / r.height - 0.5;
        if (raf) return;
        raf = requestAnimationFrame(() => {
            raf = 0;
            heroPhoto.style.transform = `perspective(900px) rotateY(${mx * 7}deg) rotateX(${-my * 7}deg) scale(1.02)`;
        });
    });
    heroVisual.addEventListener("mouseleave", () => {
        cancelAnimationFrame(raf);
        raf = 0;
        heroPhoto.style.transform = "";
    });
}

const heroResume = document.querySelector(
    '.hero-cta a[href="Chinmay Betageri.pdf"]',
);
if (heroResume) {
    heroResume.addEventListener("click", (e) => {
        if (window.matchMedia("(max-width: 768px)").matches) {
            e.preventDefault();
            const a = document.createElement("a");
            a.href = "Chinmay Betageri.pdf";
            a.download = "Chinmay Betageri FS.pdf";
            a.click();
        }
    });
}
