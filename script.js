const sections = document.querySelectorAll(".page-section");
const step1 = document.querySelectorAll(".step1");
const step2 = document.querySelectorAll(".step2");
const step3 = document.querySelectorAll(".step3");

// ativa step1 na seção 1 quando em tela, desativa ao sair
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.target.id === "sec1") {
      step1.forEach(t => t.classList.toggle("active", entry.isIntersecting));
    }
    if (entry.target.id === "sec2") {
      step2.forEach(t => t.classList.toggle("active", entry.isIntersecting));
    }
    if (entry.target.id === "sec3") {
      step3.forEach(t => t.classList.toggle("active", entry.isIntersecting));
    }
  });
}, { threshold: 0.6 });

// observa só as seções que importam
sections.forEach(sec => observer.observe(sec));
