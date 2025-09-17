// ======== CONFIG ========
const DEFAULT_DUR = 2.4;   // duração padrão (s) se não houver data-dur
const JITTER_MAX = 0.18;   // jitter opcional para deixar orgânico (s)

// ======== PREP ========
const scroller = document.querySelector('.scroll-container');
const sections = document.querySelectorAll('.page-section');
const traces = Array.from(document.querySelectorAll('path.trace'));

// Map de id -> elemento (para dependências)
const byId = new Map();
traces.forEach(el => { if (el.id) byId.set(`#${el.id}`, el); });

// Pré-calcula comprimento e prepara stroke-dash
traces.forEach(el => {
  const len = el.getTotalLength();
  el.style.strokeDasharray = len;
  el.style.strokeDashoffset = len;
  el.dataset._len = String(len);
});

// Cache de delays/durações efetivas
const delayCache = new Map();
const durCache = new Map();

// duração efetiva (pode vir de data-dur; senão, padrão)
function getDur(el) {
  if (durCache.has(el)) return durCache.get(el);
  const d = parseFloat(el.dataset.dur || '') || DEFAULT_DUR;
  durCache.set(el, d);
  return d;
}

// atraso efetivo com dependência de tronco (recursivo)
function getDelay(el) {
  if (delayCache.has(el)) return delayCache.get(el);

  let delay = parseFloat(el.dataset.delay || '0') || 0;

  const parentSel = el.dataset.beginOn;   // ex: "#L1"
  const at = parseFloat(el.dataset.beginAt || ''); // fração (0..1)
  if (parentSel) {
    const parent = byId.get(parentSel);
    if (parent) {
      const parentDelay = getDelay(parent);
      const parentDur = getDur(parent);
      const frac = isFinite(at) ? Math.min(Math.max(at, 0), 1) : 0.5; // default 0.5
      delay += parentDelay + parentDur * frac;
    }
  } else {
    // sem dependência → dá um micro-jitter opcional pra ficar menos robótico
    const jitter = (Math.random() * (2 * JITTER_MAX)) - JITTER_MAX; // [-JITTER, +JITTER]
    delay += jitter;
  }

  delay = Math.max(0, delay);
  delayCache.set(el, delay);
  return delay;
}

// aplica duração e delay (inline) p/ cada path
function applyTiming(el) {
  const dur = getDur(el);
  const delay = getDelay(el);
  el.style.transitionProperty = 'stroke-dashoffset';
  el.style.transitionTimingFunction = 'ease-in-out';
  el.style.transitionDuration = `${dur}s`;
  el.style.transitionDelay = `${delay}s`;
}

// prepara todos os paths com duração/delay computados
traces.forEach(applyTiming);

// ======== ATIVAÇÃO PROGRESSIVA (ACUMULANDO) ========
// stepIndex: seção → nível
const stepIndex = new Map([['sec1',1], ['sec2',2], ['sec3',3]]);
let maxStepActivated = 0;

function activateUpTo(step) {
  for (let s = 1; s <= step; s++) {
    document.querySelectorAll(`.trace.step${s}:not(.active)`).forEach(el => {
      // adicionar .active dispara a transição com o delay já configurado
      el.classList.add('active');
    });
  }
  if (step > maxStepActivated) maxStepActivated = step;
}

// Observer baseado no container com snap (mais robusto que viewport)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const secId = entry.target.id;
    const step = stepIndex.get(secId) || 0;
    if (step > 0) activateUpTo(step);
  });
}, { root: scroller, threshold: 0.75 });

// Observa as seções
sections.forEach(sec => observer.observe(sec));

// Ativa step1 imediatamente se a sec1 já está à vista no load
// (garante impacto inicial mesmo se o observer disparar com leve atraso)
window.addEventListener('load', () => {
  const sec1 = document.getElementById('sec1');
  if (sec1) {
    const rect = sec1.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh * 0.25 && rect.bottom > vh * 0.25) {
      activateUpTo(1);
    }
  }
});
