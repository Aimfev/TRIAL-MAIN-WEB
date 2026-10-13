
/* TRIALS SMP — reversible scroll animations */
(() => {
  function initTrialsEffects() {
    if (document.querySelector("#ts-motion-style")) return;

    const motionStyle = document.createElement("style");
    motionStyle.id = "ts-motion-style";
    motionStyle.textContent = `
      .ts-reveal {
        opacity: 0;
        transform: translateY(42px) scale(.97);
        filter: blur(5px);
        transition: opacity .65s ease, transform .65s cubic-bezier(.2,.7,.2,1), filter .65s ease;
        transition-delay: var(--ts-delay, 0ms);
        will-change: opacity, transform;
      }
      .ts-reveal.ts-visible {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
      }
      .section-heading.ts-visible h2 {
        animation: ts-title-in .7s ease both;
      }
      .section-heading.ts-visible .heading-line {
        animation: ts-line-in .7s ease both;
      }
      .feature-card.ts-visible,
      .mod-card.ts-visible {
        animation: ts-card-in .7s cubic-bezier(.2,.7,.2,1) both;
        animation-delay: var(--ts-delay, 0ms);
      }
      .hero-logo {
        animation: ts-float 3.8s ease-in-out infinite;
      }
      .status-dot {
        animation: ts-pulse 2s ease-in-out infinite;
      }
      .scroll-hint {
        animation: ts-hint 1.8s ease-in-out infinite;
      }
      .feature-card:hover,
      .mod-card:hover,
      .about-card:hover,
      .custom-card:hover,
      .join-card:hover {
        filter: brightness(1.08);
      }
      .feature-card:hover .feature-icon,
      .mod-card:hover .mod-icon,
      .about-card:hover .about-icon,
      .custom-card:hover .custom-symbol {
        transform: scale(1.12) rotate(-5deg);
      }
      .feature-icon,.mod-icon,.about-icon,.custom-symbol {
        transition: transform .3s ease;
      }
      .ts-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 3px;
        z-index: 99999;
        background: linear-gradient(90deg,#ff75dc,#b58aff,#f5c5ff);
        pointer-events: none;
        box-shadow: 0 0 10px #d78aff;
      }
      .ts-top {
        position: fixed;
        right: 18px;
        bottom: 18px;
        z-index: 99999;
        width: 46px;
        height: 46px;
        border: 1px solid #ffffff66;
        border-radius: 50%;
        background: rgba(35,19,54,.9);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        color: white;
        font-size: 23px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(14px) scale(.85);
        transition: opacity .3s, transform .3s, visibility .3s;
        cursor: pointer;
      }
      .ts-top.ts-visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
      }
      @keyframes ts-title-in {
        from { opacity: 0; transform: translateY(20px); filter: blur(4px); }
        to { opacity: 1; transform: translateY(0); filter: blur(0); }
      }
      @keyframes ts-line-in {
        from { transform: scaleX(0); }
        to { transform: scaleX(1); }
      }
      @keyframes ts-card-in {
        0% { transform: translateY(18px) scale(.98); }
        70% { transform: translateY(-2px) scale(1.005); }
        100% { transform: translateY(0) scale(1); }
      }
      @keyframes ts-float {
        0%,100% { transform: translateY(0); }
        50% { transform: translateY(-12px); }
      }
      @keyframes ts-pulse {
        0%,100% { box-shadow: 0 0 4px #6dffb0; }
        50% { box-shadow: 0 0 17px #6dffb0; }
      }
      @keyframes ts-hint {
        0%,100% { transform: translateY(0); }
        50% { transform: translateY(6px); }
      }
      @media(prefers-reduced-motion:reduce) {
        .ts-reveal,.ts-reveal.ts-visible {
          opacity: 1;
          transform: none;
          filter: none;
          transition: none;
          animation: none;
        }
        .hero-logo,.status-dot,.scroll-hint {
          animation: none !important;
        }
      }
    `;
    document.head.appendChild(motionStyle);

    const items = document.querySelectorAll(
      ".section-heading,.about-card,.feature-card,.mod-card,.custom-card,.join-card,.join-step,.server-details,.footer"
    );

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          entry.target.classList.toggle("ts-visible", entry.isIntersecting);
        });
      }, {
        threshold: 0.08,
        rootMargin: "0px 0px -25px 0px"
      });

      items.forEach((item, i) => {
        item.classList.add("ts-reveal");
        item.style.setProperty("--ts-delay", (i % 4) * 90 + "ms");
        observer.observe(item);
      });
    } else {
      items.forEach(item => item.classList.add("ts-visible"));
    }

    const progress = document.createElement("div");
    progress.className = "ts-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.appendChild(progress);

    const topButton = document.createElement("button");
    topButton.className = "ts-top";
    topButton.type = "button";
    topButton.textContent = "↑";
    topButton.setAttribute("aria-label", "Back to top");
    document.body.appendChild(topButton);

    topButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    let scheduled = false;

    function updateEffects() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const percent = maxScroll > 0 ? window.scrollY / maxScroll * 100 : 0;
      progress.style.width = percent + "%";
      topButton.classList.toggle("ts-visible", window.scrollY > 350);
      scheduled = false;
    }

    window.addEventListener("scroll", () => {
      if (!scheduled) {
        window.requestAnimationFrame(updateEffects);
        scheduled = true;
      }
    }, { passive: true });

    window.addEventListener("resize", updateEffects);
    updateEffects();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTrialsEffects, { once: true });
  } else {
    initTrialsEffects();
  }
})();
