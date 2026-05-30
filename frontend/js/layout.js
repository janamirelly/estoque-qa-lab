// js/layout.js

const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const sidebar = document.getElementById("sidebar");

if (mobileMenuToggle && sidebar) {
  mobileMenuToggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("is-open");

    mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));
    mobileMenuToggle.textContent = isOpen ? "×" : "☰";
    mobileMenuToggle.setAttribute(
      "aria-label",
      isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação",
    );
  });
}
