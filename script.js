// Seleciona o container que faz o scroll
const scroller = document.querySelector('.scroll-container');

// posição inicial
document.body.style.backgroundPosition = 'center 0px';

function updateParallax() {
  // move o fundo mais devagar (25% da velocidade do scroll)
  const offset = scroller.scrollTop * 0.25;
  document.body.style.backgroundPosition = `center -${offset}px`;
}

// atualiza enquanto o container rola
scroller.addEventListener('scroll', updateParallax);

// chamada inicial
updateParallax();
