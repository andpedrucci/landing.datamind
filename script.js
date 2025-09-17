// Seleciona as seções e as trilhas dos circuitos
const sections = document.querySelectorAll(".page-section");
const traces = document.querySelectorAll(".trace");

// Observa quando a seção entra em tela
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      // quando a seção 2 ou 3 entra em tela, aciona animação
      if(entry.target.id === "sec2" || entry.target.id === "sec3"){
        traces.forEach(t => t.classList.add("grow"));
      }
    }
  })
},{threshold:0.6});

sections.forEach(sec=>observer.observe(sec));
