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

// --- Parallax (movimento mais lento do fundo) ---
function updateParallax() {
  // cada seção tem 100vh → o fundo anda só 25% disso
  const offset = current * window.innerHeight * 0.25;
  document.body.style.backgroundPosition = `center -${offset}px`;
}

// inicializa posição do fundo
updateParallax();
