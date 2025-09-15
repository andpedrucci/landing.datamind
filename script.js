// script.js

const sections = document.querySelectorAll(".page-section");
let current = 0; // começa na primeira seção
let isScrolling = false;

function scrollToSection(index) {
  if (index >= 0 && index < sections.length) {
    isScrolling = true;
    sections[index].scrollIntoView({ behavior: "smooth" });
    setTimeout(() => (isScrolling = false), 1000); // tempo pra evitar scroll duplo
    current = index;
  }
}

window.addEventListener("wheel", (e) => {
  if (isScrolling) return;
  if (e.deltaY > 0) {
    // scroll para baixo
    scrollToSection(current + 1);
  } else {
    // scroll para cima
    scrollToSection(current - 1);
  }
  // --- Parallax ---
window.addEventListener("scroll", () => {
  const offset = window.scrollY * 0.25; // 25% da velocidade do scroll
  document.querySelector(".bg1").style.backgroundPositionY = `-${offset}px`;
});
});
