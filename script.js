const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const THEME_KEY = "kyah-portfolio-theme";
const THEME_COLORS = {
  light: "#f6f3ec",
  dark: "#141a20"
};

function applyTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  root.setAttribute("data-theme", nextTheme);

  if (themeToggle) {
    const darkModeActive = nextTheme === "dark";
    themeToggle.setAttribute("aria-pressed", String(darkModeActive));
    themeToggle.setAttribute(
      "aria-label",
      darkModeActive ? "Switch to light theme" : "Switch to dark theme"
    );

    const label = themeToggle.querySelector(".theme-toggle__label");
    if (label) {
      label.textContent = darkModeActive ? "Light" : "Dark";
    }
  }

  if (themeMeta) {
    themeMeta.setAttribute("content", THEME_COLORS[nextTheme]);
  }

  try {
    localStorage.setItem(THEME_KEY, nextTheme);
  } catch (error) {
    // Ignore storage limitations.
  }
}

function initTheme() {
  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem(THEME_KEY);
  } catch (error) {
    savedTheme = null;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme");
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }
}

function closeMenu() {
  if (!navLinks || !navToggle) return;
  navLinks.setAttribute("data-open", "false");
  navToggle.setAttribute("aria-expanded", "false");
}

function initNavMenu() {
  if (!navLinks || !navToggle) return;

  navLinks.setAttribute("data-open", "false");

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.getAttribute("data-open") === "true";
    navLinks.setAttribute("data-open", String(!isOpen));
    navToggle.setAttribute("aria-expanded", String(!isOpen));
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!navLinks.contains(target) && !navToggle.contains(target)) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 840) closeMenu();
  });
}

function initReveal() {
  const revealItems = document.querySelectorAll(".reveal");
  if (!revealItems.length) return;

  revealItems.forEach((item) => {
    const delay = item.getAttribute("data-delay");
    if (delay) {
      item.style.transitionDelay = `${delay}ms`;
    }
  });

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

function initSectionSpy() {
  const links = document.querySelectorAll(".nav-link");
  const sections = Array.from(links)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length || !("IntersectionObserver" in window)) return;

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        links.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    { rootMargin: "-38% 0px -52% 0px", threshold: 0.01 }
  );

  sections.forEach((section) => spyObserver.observe(section));
}

function initExpandCards() {
  const buttons = document.querySelectorAll("[data-expand]");
  if (!buttons.length) return;

  buttons.forEach((button) => {
    const targetId = button.getAttribute("aria-controls");
    const content = targetId ? document.getElementById(targetId) : null;
    const card = button.closest(".expand-card");
    if (!content || !card) return;

    const closedLabel = button.dataset.closedLabel || button.textContent.trim();
    const openLabel = button.dataset.openLabel || "Hide details";
    const defaultOpen = button.dataset.defaultOpen === "true";

    const setOpen = (open) => {
      card.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
      content.setAttribute("aria-hidden", String(!open));
      button.textContent = open ? openLabel : closedLabel;
    };

    setOpen(defaultOpen);

    button.addEventListener("click", () => {
      const currentlyOpen = button.getAttribute("aria-expanded") === "true";
      setOpen(!currentlyOpen);
    });
  });
}

function initSkillTabs() {
  const tabs = document.querySelectorAll("[data-skill-tab]");
  const tagContainer = document.getElementById("skill-tags");
  if (!tabs.length || !tagContainer) return;

  const skillMap = {
    instructional: [
      "Differentiated Learning Support",
      "Curriculum-Aligned Lesson Planning",
      "Constructive Student Feedback",
      "Classroom Environment Management"
    ],
    communication: [
      "Written and Oral Communication",
      "Parent and Guardian Communication",
      "Collaborative Teamwork",
      "Student-Centered Clarity"
    ],
    organization: [
      "Time Management",
      "Task Prioritization",
      "Documentation Accuracy",
      "Instructional Workflow Consistency"
    ],
    technical: [
      "SIS Database",
      "PowerTeacher",
      "Google Workspace",
      "Microsoft Office"
    ],
    languages: [
      "English",
      "Russian (Intermediate)"
    ]
  };

  const render = (key) => {
    const skills = skillMap[key] || [];
    tagContainer.innerHTML = "";

    skills.forEach((skill) => {
      const li = document.createElement("li");
      li.className = "skill-tag";
      li.textContent = skill;
      tagContainer.appendChild(li);
    });

    tabs.forEach((tab) => {
      const active = tab.dataset.skillTab === key;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.setAttribute("tabindex", active ? "0" : "-1");
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => render(tab.dataset.skillTab));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();

      const currentIndex = Array.from(tabs).indexOf(tab);
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
      const nextTab = tabs[nextIndex];
      nextTab.focus();
      render(nextTab.dataset.skillTab);
    });
  });

  const defaultTab = document.querySelector(".skill-tab.is-active");
  render(defaultTab ? defaultTab.dataset.skillTab : "instructional");
}

function initTiltCards() {
  const cards = document.querySelectorAll("[data-tilt]");
  const canTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotion;

  if (!cards.length || !canTilt) return;

  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const rotateY = ((x - 0.5) * 8).toFixed(2);
      const rotateX = ((0.5 - y) * 7).toFixed(2);

      card.style.setProperty("--rx", `${rotateX}deg`);
      card.style.setProperty("--ry", `${rotateY}deg`);
    });

    const reset = () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    };

    card.addEventListener("pointerleave", reset);
    card.addEventListener("pointerup", reset);
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent =
      "Thanks for reaching out. This demo form has no backend on GitHub Pages, so please email kmorris21487@gmail.com directly.";
    form.reset();
  });
}

function initLenis() {
  if (reducedMotion || typeof window.Lenis !== "function") return null;

  const lenis = new window.Lenis({
    duration: 1.05,
    smoothWheel: true,
    wheelMultiplier: 0.92,
    touchMultiplier: 1
  });

  const raf = (time) => {
    lenis.raf(time);
    window.requestAnimationFrame(raf);
  };

  window.requestAnimationFrame(raf);
  return lenis;
}

function initAnchorScroll(lenisInstance) {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  if (!anchorLinks.length) return;

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();

      if (lenisInstance) {
        lenisInstance.scrollTo(target, { offset: -86 });
      } else {
        target.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start"
        });
      }

      closeMenu();
    });
  });
}

function setYear() {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
}

initTheme();
initNavMenu();
initReveal();
initSectionSpy();
initExpandCards();
initSkillTabs();
initTiltCards();
initContactForm();
setYear();

const lenis = initLenis();
initAnchorScroll(lenis);
