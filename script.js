history.scrollRestoration = "manual";
window.scrollTo(0, 0);

document.documentElement.classList.add("js");

const modeToggle = document.getElementById("modeToggle");
const modeLabel = document.getElementById("modeLabel");

const MODES = ["normal", "dyslexic", "oversimplified"];
const MODE_LABEL = {
    normal: "Nonchalant",
    dyslexic: "Dyslexic",
    oversimplified: "Oversimplified",
};

// session-only modes: every fresh open starts normal; drop any stale saved pref
localStorage.removeItem("dyslexic");

function setMode(mode) {
    if (mode === "normal") {
        delete document.documentElement.dataset.mode;
    } else {
        document.documentElement.dataset.mode = mode;
    }
    // button previews the NEXT mode, not the current one
    const next = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
    if (modeLabel) {
        modeLabel.textContent = MODE_LABEL[next];
    }
    if (modeToggle) {
        modeToggle.setAttribute(
            "aria-label",
            "Reading mode: " +
                MODE_LABEL[mode] +
                ". Activate to switch to " +
                MODE_LABEL[next] +
                " mode.",
        );
        modeToggle.classList.toggle("is-on", mode !== "normal");
    }
}

if (modeToggle) {
    let flipping = false;
    modeToggle.addEventListener("click", () => {
        const current = document.documentElement.dataset.mode || "normal";
        const next = MODES[(MODES.indexOf(current) + 1) % MODES.length];
        if (reduceMotion || flipping) {
            setMode(next);
            return;
        }
        flipping = true;
        document.documentElement.classList.add("mode-flip");
        window.setTimeout(() => {
            setMode(next);
        }, 550);
        window.setTimeout(() => {
            document.documentElement.classList.remove("mode-flip");
            flipping = false;
        }, 1250);
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

// nav Contact isolates the footer card; any other nav target restores the page
const contactNavLink = document.querySelector(
    '.nav-links a[href="#contact"]',
);

if (contactNavLink) {
    contactNavLink.addEventListener("click", (e) => {
        e.preventDefault();
        document.body.classList.add("contact-focus");
        const footer = document.getElementById("contact");
        if (footer) {
            footer.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "center",
            });
        }
    });
}

document
    .querySelectorAll('.nav-links a:not([href="#contact"]), .logo')
    .forEach((link) => {
        link.addEventListener("click", () => {
            document.body.classList.remove("contact-focus");
        });
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
        if (document.documentElement.dataset.mode === "oversimplified") return;
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

// touch press: mirror desktop down-and-up on every tap (min 140ms visible)
if (window.matchMedia("(hover: none)").matches && !reduceMotion) {
    const MIN_PRESS = 140;
    document.querySelectorAll(".btn").forEach((btn) => {
        let downAt = 0;
        let timer = 0;
        btn.addEventListener("pointerdown", () => {
            window.clearTimeout(timer);
            downAt = Date.now();
            btn.classList.add("is-pressed");
        });
        const release = () => {
            if (!btn.classList.contains("is-pressed")) return;
            const wait = Math.max(0, MIN_PRESS - (Date.now() - downAt));
            window.clearTimeout(timer);
            timer = window.setTimeout(() => {
                btn.classList.remove("is-pressed");
            }, wait);
        };
        btn.addEventListener("pointerup", release);
        btn.addEventListener("pointercancel", release);
        btn.addEventListener("pointerleave", release);
    });
}
