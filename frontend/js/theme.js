const THEME_STORAGE_KEY = "varejosync-estoque-theme";

document.addEventListener("DOMContentLoaded", () => {
  inicializarTema();
});

function inicializarTema() {
  const themeToggle = document.getElementById("themeToggle");

  const temaSalvo = localStorage.getItem(THEME_STORAGE_KEY);
  const temaInicial = temaSalvo || "light";

  aplicarTema(temaInicial);

  if (!themeToggle) return;

  themeToggle.addEventListener("click", () => {
    const temaAtual = document.documentElement.dataset.theme || "light";
    const novoTema = temaAtual === "dark" ? "light" : "dark";

    aplicarTema(novoTema);
    localStorage.setItem(THEME_STORAGE_KEY, novoTema);
  });
}

function aplicarTema(tema) {
  const themeToggle = document.getElementById("themeToggle");

  document.documentElement.dataset.theme = tema;

  if (themeToggle) {
    themeToggle.textContent = tema === "dark" ? "Tema claro" : "Tema escuro";
  }
}
