const sections = document.querySelectorAll(".page-section");
let current = 0;
let isScrolling = false;

function scrollToSection(index) {
  if (index >= 0 && index < sections.length) {
    isScrolling = true;
    sections[index].scrollIntoView({ behavior: "smooth" });

    // espera a animação e atualiza a seção atual + parallax
    setTimeout(() => {
      isScrolling = false;
      current = index;
      updateParallax();
    }, 800);
  }
}

// controle do scroll travado
window.addEventListener("wheel", (e) => {
  if (isScrolling) return;
  if (e.deltaY > 0) {
    scrollToSection(current + 1);
  } else {
    scrollToSection(current - 1);
  }
});

// --- Parallax controlado pelo scroll ---
window.addEventListener("scroll", () => {
  const offset = window.scrollY * 0.25; // move mais devagar
  document.body.style.backgroundPosition = `center -${offset}px`;
});

// inicializa posição do fundo
updateParallax();
