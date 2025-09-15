// --- Parallax controlado pelo scroll ---
window.addEventListener("scroll", () => {
  const offset = window.scrollY * 0.25; // 25% da velocidade
  document.body.style.backgroundPosition = `center -${offset}px`;
});
