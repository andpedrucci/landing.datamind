const sections = document.querySelectorAll(".page-section");

// pega todas as trilhas separadas por etapa
const step1 = document.querySelectorAll(".step1");
const step2 = document.querySelectorAll(".step2");
const step3 = document.querySelectorAll(".step3");

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      if(entry.target.id === "sec1"){
        step1.forEach(t => t.classList.add("active"));
      }
      if(entry.target.id === "sec2"){
        step2.forEach(t => t.classList.add("active"));
      }
      if(entry.target.id === "sec3"){
        step3.forEach(t => t.classList.add("active"));
      }
    }
  })
},{threshold:0.6});

sections.forEach(sec=>observer.observe(sec));
