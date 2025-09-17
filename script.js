// Utilitários para animar trilhas SVG
function animatePath(path, duration = 2000) {
  return new Promise(resolve => {
    const length = path.getTotalLength();
    path.style.transition = "none";
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    // força reflow
    path.getBoundingClientRect();

    path.style.transition = `stroke-dashoffset ${duration}ms ease-out`;
    path.style.strokeDashoffset = "0";

    setTimeout(() => resolve(), duration);
  });
}

// Mapeia dependências de ramificação
function setupBranching(paths) {
  const graph = {};

  paths.forEach(path => {
    const parent = path.dataset.beginOn;
    const at = parseFloat(path.dataset.beginAt || "0");

    if (parent) {
      if (!graph[parent]) graph[parent] = [];
      graph[parent].push({ child: path, at });
    }
  });

  return graph;
}

// Controla quando ativar
function activateSection(sectionId, stepClass, branchingGraph) {
  const paths = document.querySelectorAll(stepClass);

  paths.forEach(path => {
    // só anima se ainda não foi feito
    if (!path.classList.contains("drawn")) {
      const parent = path.dataset.beginOn;
      const at = parseFloat(path.dataset.beginAt || "0");

      if (!parent) {
        // anima direto
        animatePath(path).then(() => {
          path.classList.add("drawn");
        });
      } else {
        // espera o pai estar pronto no ponto certo
        const parentPath = document.querySelector(parent);
        const parentLength = parentPath.getTotalLength();
        const triggerPoint = parentLength * at;

        const checkProgress = () => {
          const dashoffset = parseFloat(getComputedStyle(parentPath).strokeDashoffset);
          const currentProgress = (parentLength - dashoffset) / parentLength;

          if (currentProgress >= at) {
            animatePath(path).then(() => path.classList.add("drawn"));
            clearInterval(interval);
          }
        };

        const interval = setInterval(checkProgress, 100);
      }
    }
  });
}

// --- Main ---
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".page-section");
  const allPaths = document.querySelectorAll("path.trace");

  // cria grafo de dependências
  const branchingGraph = setupBranching(allPaths);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.id === "sec1") {
          activateSection("sec1", ".step1", branchingGraph);
        }
        if (entry.target.id === "sec2") {
          activateSection("sec2", ".step2", branchingGraph);
        }
        if (entry.target.id === "sec3") {
          activateSection("sec3", ".step3", branchingGraph);
        }
      }
    });
  }, { threshold: 0.6 });

  sections.forEach(sec => observer.observe(sec));
});
