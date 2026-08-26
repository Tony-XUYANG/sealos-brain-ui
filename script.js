const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const menuButton = document.querySelector('.menu-button');
const siteHeader = document.querySelector('.site-header');

menuButton?.addEventListener('click', () => {
  const open = siteHeader.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

document.querySelectorAll('.desktop-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    siteHeader.classList.remove('menu-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open menu');
  });
});

const journeyMap = document.querySelector('.journey-map');
const journeyPhases = ['analyze', 'build', 'ready'];
let journeyIndex = 2;
let journeyTimer;

function setJourneyPhase(phase) {
  if (!journeyMap) return;
  journeyIndex = Math.max(0, journeyPhases.indexOf(phase));
  journeyMap.dataset.journeyPhase = journeyPhases[journeyIndex];
}

function scheduleJourney() {
  window.clearTimeout(journeyTimer);
  if (reducedMotion.matches || document.hidden) return;
  journeyTimer = window.setTimeout(() => {
    setJourneyPhase(journeyPhases[(journeyIndex + 1) % journeyPhases.length]);
    scheduleJourney();
  }, 2400);
}

const deployForm = document.querySelector('#deploy-form');
deployForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const label = deployForm.querySelector('.button-label');
  const original = label.textContent;
  label.textContent = 'Deploying';
  setJourneyPhase('analyze');
  window.clearTimeout(journeyTimer);
  window.setTimeout(() => setJourneyPhase('build'), reducedMotion.matches ? 0 : 700);
  window.setTimeout(() => {
    setJourneyPhase('ready');
    label.textContent = original;
    scheduleJourney();
  }, reducedMotion.matches ? 0 : 1500);
});

const opsTheater = document.querySelector('.ops-theater');
const stageButtons = [...document.querySelectorAll('[data-stage-button]')];

function setIssueStage(stage) {
  if (!opsTheater) return;
  opsTheater.dataset.stage = stage;
  stageButtons.forEach((button) => {
    const active = button.dataset.stageButton === stage;
    button.setAttribute('aria-selected', String(active));
  });

  document.querySelectorAll('.issue-card').forEach((card) => card.classList.remove('active'));
  const activeCard = stage === 'network'
    ? document.querySelector('.network-card')
    : document.querySelector('.container-card');
  activeCard?.classList.add('active');
}

stageButtons.forEach((button) => {
  button.addEventListener('click', () => setIssueStage(button.dataset.stageButton));
});

const aiMap = document.querySelector('.ai-map');
const aiPhases = ['discover', 'inject', 'complete'];
let aiIndex = 2;
let aiTimer;

function setAiPhase(phase) {
  if (!aiMap) return;
  aiIndex = Math.max(0, aiPhases.indexOf(phase));
  aiMap.dataset.aiPhase = aiPhases[aiIndex];
}

function scheduleAi() {
  window.clearTimeout(aiTimer);
  if (reducedMotion.matches || document.hidden) return;
  aiTimer = window.setTimeout(() => {
    setAiPhase(aiPhases[(aiIndex + 1) % aiPhases.length]);
    scheduleAi();
  }, 2600);
}

const skillsMap = document.querySelector('.skills-map');
const skillsPhases = ['analyze', 'build', 'config', 'complete'];
let skillsIndex = 3;
let skillsTimer;

function setSkillsPhase(phase) {
  if (!skillsMap) return;
  skillsIndex = Math.max(0, skillsPhases.indexOf(phase));
  skillsMap.dataset.skillsPhase = skillsPhases[skillsIndex];
}

function scheduleSkills() {
  window.clearTimeout(skillsTimer);
  if (reducedMotion.matches || document.hidden) return;
  skillsTimer = window.setTimeout(() => {
    setSkillsPhase(skillsPhases[(skillsIndex + 1) % skillsPhases.length]);
    scheduleSkills();
  }, 1700);
}

const copyButton = document.querySelector('.copy-button');
copyButton?.addEventListener('click', async () => {
  const command = copyButton.dataset.command;
  try {
    await navigator.clipboard.writeText(command);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = command;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }
  copyButton.classList.add('copied');
  copyButton.setAttribute('aria-label', 'Copied');
  window.setTimeout(() => {
    copyButton.classList.remove('copied');
    copyButton.setAttribute('aria-label', 'Copy Sealos Skills install command');
  }, 1400);
});

const iconAssets = [
  new URL('./assets/icons/openai.svg', import.meta.url).href,
  new URL('./assets/icons/anthropic.svg', import.meta.url).href,
  new URL('./assets/icons/googlegemini.svg', import.meta.url).href,
  new URL('./assets/icons/deepseek.svg', import.meta.url).href,
  new URL('./assets/icons/qwen.svg', import.meta.url).href,
  new URL('./assets/icons/kimi.svg', import.meta.url).href,
  new URL('./assets/icons/docker.svg', import.meta.url).href,
  new URL('./assets/icons/github.svg', import.meta.url).href,
  new URL('./assets/icons/wordpress.svg', import.meta.url).href,
  new URL('./assets/icons/supabase.svg', import.meta.url).href,
  new URL('./assets/icons/n8n.svg', import.meta.url).href
];

function createIconTile(className, asset) {
  const tile = document.createElement('span');
  tile.className = className;
  const image = document.createElement('img');
  image.src = asset;
  image.alt = '';
  tile.append(image);
  return tile;
}

document.querySelectorAll('.marquee-row').forEach((row, rowIndex) => {
  for (let index = 0; index < 38; index += 1) {
    const asset = iconAssets[(index + rowIndex * 4) % iconAssets.length];
    row.append(createIconTile('marquee-tile', asset));
  }
});

const providerMosaic = document.querySelector('.provider-mosaic');
if (providerMosaic) {
  for (let index = 0; index < 21; index += 1) {
    providerMosaic.append(createIconTile('mosaic-tile', iconAssets[index % iconAssets.length]));
  }
}

const storeGrid = document.querySelector('.store-grid');
const storeForm = document.querySelector('.store-form');
const storeInput = document.querySelector('#store-query');
const storeSubmitLabel = document.querySelector('.store-submit-label');
const appCards = [...document.querySelectorAll('.app-card')];

function selectStoreCard(card) {
  appCards.forEach((item) => item.classList.toggle('selected', item === card));
  if (storeInput) storeInput.value = `Deploy a ${card.dataset.storeApp} application`;
}

appCards.forEach((card) => {
  card.querySelector('button')?.addEventListener('click', () => {
    selectStoreCard(card);
    if (storeGrid) storeGrid.dataset.storePhase = 'selected';
  });
});

storeForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (storeGrid) storeGrid.dataset.storePhase = 'deploying';
  storeSubmitLabel.textContent = 'Deploying';
  window.setTimeout(() => {
    if (storeGrid) storeGrid.dataset.storePhase = 'complete';
    storeSubmitLabel.textContent = 'Deployed';
  }, reducedMotion.matches ? 0 : 1200);
  window.setTimeout(() => {
    storeSubmitLabel.textContent = 'Deploy';
  }, reducedMotion.matches ? 0 : 2600);
});

const counters = [...document.querySelectorAll('[data-count]')];
let countersRan = false;

function showCounterTargets() {
  counters.forEach((counter) => {
    counter.textContent = new Intl.NumberFormat('en-US').format(Number(counter.dataset.count));
  });
}

function animateCounters() {
  if (countersRan) return;
  countersRan = true;
  const formatter = new Intl.NumberFormat('en-US');
  const duration = 1400;

  counters.forEach((counter, index) => {
    const target = Number(counter.dataset.count);
    const start = performance.now() + index * 70;
    const update = (now) => {
      const progress = Math.max(0, Math.min(1, (now - start) / duration));
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = formatter.format(Math.round(target * eased));
      if (progress < 1) window.requestAnimationFrame(update);
    };
    window.requestAnimationFrame(update);
  });
}

if (reducedMotion.matches) {
  showCounterTargets();
} else {
  const scaleSection = document.querySelector('.scale-section');
  if (scaleSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      animateCounters();
      counterObserver.disconnect();
    }, { threshold: .22 });
    counterObserver.observe(scaleSection);
  }
}

function startMotion() {
  if (reducedMotion.matches) {
    setJourneyPhase('ready');
    setAiPhase('complete');
    setSkillsPhase('complete');
    return;
  }
  scheduleJourney();
  scheduleAi();
  scheduleSkills();
}

function stopMotion() {
  window.clearTimeout(journeyTimer);
  window.clearTimeout(aiTimer);
  window.clearTimeout(skillsTimer);
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopMotion();
  else startMotion();
});

reducedMotion.addEventListener('change', () => {
  stopMotion();
  startMotion();
  if (reducedMotion.matches) showCounterTargets();
});

setIssueStage('container');
setJourneyPhase('ready');
setAiPhase('complete');
setSkillsPhase('complete');
startMotion();
