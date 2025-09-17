// ======= Seleções =======
const scroller = document.querySelector('.scroll-container');
const sections = document.querySelectorAll('.page-section');
const traces = Array.from(document.querySelectorAll('path.trace'));
const pulses = Array.from(document.querySelectorAll('.pulse'));

// ======= Map id -> elemento (para dependências) =======
const byId = new Map();
traces.forEach(el => { if (el.id) byId.set(`#${el.id}`, el); });

// ======= Utilitários =======
const DEFAULT_DUR = 2.4;  // s
const JITTER = 0.16;      // s

function getDur(el) {
  const d = parseFloat(el.dataset.dur || '');
  return Number.isFinite(d) ? d : DEFAULT_DUR;
}

const delayCache = new Map();
function getDelay(el) {
  if (delayCache.has(el)) return delayCache.get(el);

  let delay = parseFloat(el.dataset.delay || '0') || 0;
  const parentSel = el.dataset.beginOn;
  const at = parseFloat(el.dataset.beginAt || '');
  if (parentSel) {
    const parent = byId.get(parentSel);
    if (parent) {
      const parentDelay = getDelay(parent);
      const parentDur = getDur(parent);
      const frac = Number.isFinite(at) ? Math.min(Math.max(at, 0), 1) : 0.5;
      delay += parentDelay + parentDur * frac;
    }
  } else {
    // pequeno jitter para não ficar robótico
    delay += (Math.random() * (2 * JITTER)) - JITTER;
  }
  delay = Math.max(0, delay);
  delayCache.set(el, delay);
  return delay;
}

// ======= Preparação: só step2/step3 animam =======
// step1 fica estático e visível
traces
  .filter(el => !el.classList.contains('step1')) // apenas step2/3
  .forEach(el => {
    const len = el.getTotalLength();
    el.style.setProperty('--len', `${len}`);
    el.style.setProperty('--dur', `${getDur(el)}s`);
    el.style.setProperty('--delay', `${getDelay(el)}s`);
    el.classList.add('prep');           // esconde com dash e prepara a transição
  });

// ======= Ativação progressiva (ACUMULA) =======
const stepIndex = new Map([['sec1',1], ['sec2',2], ['sec3',3]]);
let maxStepActivated = 1;               // sec1 é estática já

function activateStep(stepNumber) {
  // ativa trilhas daquela etapa
  document.querySelectorAll(`.trace.step${stepNumber}.prep:not(.grow)`)
    .forEach(el => el.classList.add('grow'));

  // mostra pulses que têm data-step <= etapa
  pulses.forEach(p => {
    const s = parseInt(p.dataset.step || '2', 10);
    if (s <= stepNumber) p.style.visibility = 'visible';
  });

  if (stepNumber > maxStepActivated) maxStepActivated = stepNumber;
}

// observer baseado no container com snap
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const step = stepIndex.get(entry.target.id) || 0;
    if (step >= 2) activateStep(step);  // step1 já estática; ativa 2/3
  });
}, { root: scroller, threshold: 0.8 });

// Observar as seções
sections.forEach(sec => observer.observe(sec));

// Garantir estado inicial (sec1 visível)
window.addEventListener('load', () => {
  // nada a fazer: step1 já está visível e estática por padrão
});
