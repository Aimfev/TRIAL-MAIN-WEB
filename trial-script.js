
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      menuToggle.textContent = "☰";
    });
  });
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

async function copyText(text, button) {
  const originalText = button.textContent;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const input = document.createElement("textarea");
      input.value = text;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      const copied = document.execCommand("copy");
      input.remove();
      if (!copied) throw new Error("Copy failed");
    }

    button.textContent = "COPIED!";
  } catch {
    button.textContent = "COPY FAILED";
  }

  setTimeout(() => {
    button.textContent = originalText;
  }, 1800);
}

const addressButton = document.getElementById("copyAddress");
const portButton = document.getElementById("copyPort");
const addressElement = document.getElementById("serverAddress");
const portElement = document.getElementById("serverPort");

if (addressButton && addressElement) {
  addressButton.addEventListener("click", () => {
    const address = addressElement.textContent.trim();
    if (address === "ADD_YOUR_SERVER_IP") {
      addressButton.textContent = "ADD SERVER IP FIRST";
      setTimeout(() => addressButton.textContent = "COPY IP", 1800);
      return;
    }
    copyText(address, addressButton);
  });
}

if (portButton && portElement) {
  portButton.addEventListener("click", () => {
    copyText(portElement.textContent.trim(), portButton);
  });
}
