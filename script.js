const sections = document.querySelectorAll(".page-section");
let current = 0; 
let isScrolling = false;

function scrollToSection(index) {
  if (index >= 0 && index < sections.length) {
    isScrolling = true;
    sections[index].scrollIntoView({ behavior: "smooth" });
    setTimeout(() => (isScrolling = false), 1000);
    current = index;
  }
}

// Scroll travado por seções
window.addEventListener("wheel", (e) => {
  if (isScrolling) return;
  if (e.deltaY > 0) {
    scrollToSection(current + 1);
  } else {
    scrollToSection(current - 1);
  }
});

// --- Parallax ---
window.addEventListener("scroll", () => {
  const offset = window.scrollY * 0.25; // 25% da velocidade
  document.body.style.backgroundPosition = `center ${-offset}px`;
});
