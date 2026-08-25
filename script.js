const journeyMap = document.querySelector('.journey-map');
const journeyPauseButton = document.querySelector('.journey-pause');
const journeyStatus = document.querySelector('.journey-status');
const journeyPhaseLabel = document.querySelector('.journey-phase-label');
const journeyPhaseTitle = document.querySelector('.journey-phase-title');
const journeyPhases = ['inputs', 'agent', 'ready', 'live'];
const journeyCopy = {
  inputs: ['01 · INPUT', 'Code enters from a repository or your coding agent.', 'RECEIVING CODE'],
  agent: ['02 · SEALOS', 'Analyze, build and deploy.', 'BUILDING PROJECT'],
  ready: ['03 · PRODUCTION', 'The production environment comes online.', 'GOING LIVE'],
  live: ['04 · READY', 'Your project is live.', 'PRODUCTION READY']
};
let journeyIndex = 0;
let journeyTimer;
let journeyDetailTimers = [];
let journeyPaused = false;
const reducedJourneyMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function clearJourneyDetails() {
  journeyDetailTimers.forEach((timer) => window.clearTimeout(timer));
  journeyDetailTimers = [];
}

function journeyLater(callback, delay) {
  const timer = window.setTimeout(callback, reducedJourneyMotion ? 0 : delay);
  journeyDetailTimers.push(timer);
}

function resetJourneyDetails() {
  clearJourneyDetails();
  document.querySelectorAll('[data-agent-step], [data-ready-unit]').forEach((item) => item.classList.remove('done'));
  document.querySelector('.sealos-agent-state').textContent = 'WAITING';
  document.querySelector('.ready-state').textContent = 'ASSEMBLING';
  document.querySelector('.agent-state').textContent = 'READY';
}

function setJourneyPhase(phase, restart = true) {
  journeyIndex = journeyPhases.indexOf(phase);
  if (journeyIndex < 0) journeyIndex = 0;
  resetJourneyDetails();
  const activePhase = journeyPhases[journeyIndex];
  journeyMap.dataset.journeyPhase = activePhase;
  const copy = journeyCopy[activePhase];
  journeyPhaseLabel.textContent = copy[0];
  journeyPhaseTitle.textContent = copy[1];
  journeyStatus.textContent = copy[2];
  const track = document.querySelector('.journey-phase-track i');
  track.style.animation = 'none';
  void track.offsetWidth;
  track.style.animation = '';

  if (journeyIndex >= 1) {
    const steps = [...document.querySelectorAll('[data-agent-step]')];
    document.querySelector('.agent-state').textContent = activePhase === 'agent' ? 'ANALYZING' : 'ANALYZED';
    document.querySelector('.sealos-agent-state').textContent = activePhase === 'agent' ? 'EXECUTING' : 'PLAN READY';
    steps.forEach((item, index) => journeyLater(() => item.classList.add('done'), activePhase === 'agent' ? 320 + index * 760 : 0));
  }
  if (journeyIndex >= 2) {
    const units = [...document.querySelectorAll('[data-ready-unit]')];
    document.querySelector('.agent-state').textContent = activePhase === 'ready' ? 'DEPLOYING' : 'DEPLOYED';
    units.forEach((item, index) => journeyLater(() => item.classList.add('done'), activePhase === 'ready' ? 250 + index * 650 : 0));
    journeyLater(() => { document.querySelector('.ready-state').textContent = 'READY'; }, activePhase === 'ready' ? 2700 : 0);
  }
  if (journeyIndex >= 3) {
    document.querySelector('.agent-state').textContent = 'URL RETURNED';
    document.querySelectorAll('[data-ready-unit]').forEach((item) => item.classList.add('done'));
  }
  if (restart && !journeyPaused && !reducedJourneyMotion) scheduleJourney();
}

function scheduleJourney() {
  window.clearTimeout(journeyTimer);
  journeyTimer = window.setTimeout(() => setJourneyPhase(journeyPhases[(journeyIndex + 1) % journeyPhases.length]), 3500);
}

journeyPauseButton.addEventListener('click', () => {
  journeyPaused = !journeyPaused;
  journeyMap.classList.toggle('paused', journeyPaused);
  journeyPauseButton.textContent = journeyPaused ? '▶' : 'Ⅱ';
  journeyPauseButton.setAttribute('aria-label', journeyPaused ? 'Play journey animation' : 'Pause journey animation');
  if (journeyPaused) window.clearTimeout(journeyTimer);
  else setJourneyPhase(journeyPhases[journeyIndex]);
});

const theater = document.querySelector('.deploy-theater');
const stageButtons = [...document.querySelectorAll('[data-stage-button]')];
const pauseButton = document.querySelector('.demo-pause');
const opsLiveStatus = document.querySelector('.ops-live-status');
const opsAgentState = document.querySelector('.ops-agent-state');
const opsRootCause = document.querySelector('.ops-root-cause');
const opsEvidence = document.querySelector('.ops-evidence');
const opsHealth = document.querySelector('.ops-health');
let opsTargetState = document.querySelector('.ops-target-state');
const opsMttr = document.querySelector('.ops-mttr');
const captionKicker = document.querySelector('.caption-kicker');
const captionTitle = document.querySelector('.caption-title');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const stages = ['network', 'container', 'config', 'logs'];
const opsIncidents = {
  network: { target: 'api', prompt: 'Why is the API unreachable?', observe: 'I found an abnormal route and elevated 502s.', action: 'Repairing the service route now.', result: 'Traffic restored. No request loss detected.', cause: 'Service selector mismatch', evidence: 'Ingress 502 · no endpoints', state: 'UNREACHABLE', alert: '502 rate above threshold', detail: 'Auto-alert · 12 seconds ago', repair: 'Patch service selector', mttr: '38s' },
  container: { target: 'api', prompt: 'Why does checkout keep restarting?', observe: 'The new container exits before readiness.', action: 'Correcting the startup command and rolling out.', result: 'Container stable across all replicas.', cause: 'Invalid startup command', evidence: 'CrashLoop · exit 1 · 8 restarts', state: 'CRASHLOOP', alert: 'Container restart spike', detail: 'Predictive alert · 18 seconds ago', repair: 'Patch command + rollout', mttr: '46s' },
  config: { target: 'database', prompt: 'Fix the failed production configuration.', observe: 'DATABASE_URL uses an invalid internal host.', action: 'Binding the managed database secret safely.', result: 'Configuration accepted and connection verified.', cause: 'Invalid database host', evidence: 'Config failed · DNS mismatch', state: 'CONFIG ERROR', alert: 'Release readiness blocked', detail: 'Policy alert · before rollout', repair: 'Bind verified secret', mttr: '29s' },
  logs: { target: 'worker', prompt: 'Find and fix the errors in the worker logs.', observe: 'A queue timeout is exhausting the connection pool.', action: 'Applying safe concurrency and timeout limits.', result: 'Error rate returned to zero.', cause: 'Worker pool is full', evidence: 'Timeouts · queue latency 4.2s', state: 'ERROR SPIKE', alert: 'Error pattern detected', detail: 'Log intelligence · 9 seconds ago', repair: 'Tune worker concurrency', mttr: '41s' }
};
const opsPhaseCopy = {
  alert: ['01 · ALERT', 'Production signal crossed its safe threshold.', 'INCIDENT DETECTED'],
  diagnose: ['02 · DIAGNOSE', 'AI correlates metrics, logs, config and runtime state.', 'ROOT CAUSE FOUND'],
  repair: ['03 · REPAIR', 'The Agent applies the smallest safe production change.', 'APPLYING REPAIR'],
  verify: ['04 · VERIFIED', 'Health checks pass and the incident is closed.', 'PRODUCTION HEALTHY']
};

let currentStage = 0;
let stageTimer;
let detailTimers = [];
let paused = false;

const later = (callback, delay) => {
  const timer = window.setTimeout(callback, prefersReducedMotion ? 0 : delay);
  detailTimers.push(timer);
};

function clearDetailTimers() {
  detailTimers.forEach((timer) => window.clearTimeout(timer));
  detailTimers = [];
}

function resetScene() {
  clearDetailTimers();
  document.querySelectorAll('[data-ops-step], [data-ops-line]').forEach((item) => item.classList.remove('done', 'active'));
  document.querySelectorAll('.ops-problem').forEach((item) => {
    item.classList.remove('fixed');
    const label = item.querySelector('strong');
    const state = item.querySelector('em');
    if (label) label.textContent = item.dataset.alertLabel || label.dataset.alertLabel || label.textContent;
    if (state) state.textContent = item.dataset.alertState || state.dataset.alertState || state.textContent;
    if (label) label.dataset.alertLabel = label.textContent;
    if (state) state.dataset.alertState = state.textContent;
  });
  document.querySelectorAll('.ops-problem-group').forEach((item) => item.classList.remove('healthy'));
  theater.dataset.opsPhase = 'alert';
}

function setOpsPhase(phase) {
  theater.dataset.opsPhase = phase;
  const order = ['alert', 'diagnose', 'repair', 'verify'];
  const phaseIndex = order.indexOf(phase);
  document.querySelectorAll('[data-ops-step]').forEach((item, index) => {
    item.classList.toggle('done', index < phaseIndex);
    item.classList.toggle('active', index === phaseIndex);
  });
  const copy = opsPhaseCopy[phase];
  captionKicker.textContent = copy[0];
  captionTitle.textContent = copy[1];
  opsLiveStatus.textContent = copy[2];
  opsAgentState.textContent = phase === 'alert' ? 'OBSERVING' : phase === 'diagnose' ? 'REASONING' : phase === 'repair' ? 'EXECUTING' : 'VERIFIED';
  document.querySelector('[data-ops-line="observe"]')?.classList.toggle('done', phaseIndex >= 1);
  document.querySelector('[data-ops-line="action"]')?.classList.toggle('done', phaseIndex >= 2);
  document.querySelector('[data-ops-line="verified"]')?.classList.toggle('done', phaseIndex >= 3);
  opsHealth.textContent = phase === 'verify' ? 'HEALTHY' : phase === 'repair' ? 'RECOVERING' : 'DEGRADED';
  opsTargetState.textContent = phase === 'verify' ? 'ALL SYSTEMS NORMAL' : phase === 'repair' ? 'FIXING ISSUES' : 'ISSUES ACTIVE';
  opsMttr.textContent = phase === 'verify' ? opsIncidents[stages[currentStage]].mttr : '--';
  if (phase === 'verify') document.querySelectorAll('.ops-problem-group').forEach((item) => item.classList.add('healthy'));
}

function setStage(stageName, restartTimer = true) {
  currentStage = stages.indexOf(stageName);
  if (currentStage < 0) currentStage = 0;
  resetScene();
  theater.dataset.stage = stages[currentStage];
  stageButtons.forEach((button) => {
    const active = button.dataset.stageButton === stages[currentStage];
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
    if (active) {
      const line = button.querySelector('i');
      line.style.animation = 'none';
      void line.offsetWidth;
      line.style.animation = '';
    }
  });
  const incident = opsIncidents[stages[currentStage]];
  if (document.querySelector('.ops-user-prompt')) document.querySelector('.ops-user-prompt').textContent = incident.prompt;
  opsRootCause.textContent = incident.cause;
  opsEvidence.textContent = incident.evidence;
  document.querySelector('.ops-alert-title').textContent = incident.alert;
  document.querySelector('.ops-alert-detail').textContent = incident.detail;
  document.querySelector('[data-ops-step="repair"] b').textContent = incident.repair;
  const captionLine = document.querySelector('.caption-progress i');
  captionLine.style.animation = 'none';
  void captionLine.offsetWidth;
  captionLine.style.animation = '';
  setOpsPhase('alert');
  later(() => setOpsPhase('diagnose'), 950);
  later(() => setOpsPhase('repair'), 2200);
  document.querySelectorAll('.ops-problem').forEach((item, index) => later(() => {
    item.classList.add('fixed');
    const label = item.querySelector('strong');
    const state = item.querySelector('em');
    if (label && item.dataset.normalLabel) label.textContent = item.dataset.normalLabel;
    if (state && item.dataset.normalState) state.textContent = item.dataset.normalState;
  }, 2450 + index * 145));
  later(() => setOpsPhase('verify'), 3600);
  if (restartTimer && !paused && !prefersReducedMotion) scheduleNextStage();
}

function scheduleNextStage() {
  window.clearTimeout(stageTimer);
  stageTimer = window.setTimeout(() => setStage(stages[(currentStage + 1) % stages.length]), 7200);
}

stageButtons.forEach((button) => button.addEventListener('click', () => setStage(button.dataset.stageButton)));

pauseButton.addEventListener('click', () => {
  paused = !paused;
  theater.classList.toggle('paused', paused);
  pauseButton.textContent = paused ? '▶' : 'Ⅱ';
  pauseButton.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
  if (paused) window.clearTimeout(stageTimer);
  else setStage(stages[currentStage]);
});

document.querySelector('.ops-command-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  setStage(stages[currentStage]);
});

const aiTheater = document.querySelector('.ai-theater');
const aiPauseButton = document.querySelector('.ai-pause');
const aiPhaseStatus = document.querySelector('.ai-phase-status');
const aiPhaseLabel = document.querySelector('.ai-phase-label');
const aiPhaseTitle = document.querySelector('.ai-phase-title');
const aiPhases = ['empty', 'proxy', 'inject', 'models', 'complete'];
const aiCopy = {
  empty: ['01 · SERVICES FOUND', 'Two containers are ready for model access.', 'DISCOVERING SERVICES'],
  proxy: ['02 · PROXY CREATED', 'One compatible gateway is created for the project.', 'PROVISIONING MODEL ACCESS'],
  inject: ['03 · RUNTIME INJECTION', 'Endpoint, key and model name enter each container.', 'INJECTING ENVIRONMENT'],
  models: ['04 · PROVIDER ROUTING', 'Mainstream global and Chinese models come online.', 'CONNECTING PROVIDERS'],
  complete: ['05 · BINDING COMPLETE', 'Both services can call every supported model.', 'AI RUNTIME READY']
};
let aiPhaseIndex = 0;
let aiTimer;
let aiDetailTimers = [];
let aiPaused = false;
const reducedAiMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function clearAiDetails() {
  aiDetailTimers.forEach((timer) => window.clearTimeout(timer));
  aiDetailTimers = [];
}

function aiLater(callback, delay) {
  const timer = window.setTimeout(callback, reducedAiMotion ? 0 : delay);
  aiDetailTimers.push(timer);
}

function scheduleAiPhase() {
  window.clearTimeout(aiTimer);
  aiTimer = window.setTimeout(() => setAiPhase(aiPhases[(aiPhaseIndex + 1) % aiPhases.length]), 2400);
}

function setAiPhase(phase, restart = true) {
  aiPhaseIndex = aiPhases.indexOf(phase);
  if (aiPhaseIndex < 0) aiPhaseIndex = 0;
  clearAiDetails();
  document.querySelectorAll('[data-env], .model-chip').forEach((item) => item.classList.remove('done'));
  document.querySelectorAll('.runtime-container').forEach((item) => item.classList.remove('injected'));
  document.querySelectorAll('.container-state').forEach((item) => { item.textContent = 'EMPTY'; });
  document.querySelectorAll('.inject-state').forEach((item) => { item.textContent = 'Waiting for binding'; });
  aiTheater.dataset.aiPhase = aiPhases[aiPhaseIndex];
  const copy = aiCopy[aiPhases[aiPhaseIndex]];
  aiPhaseLabel.textContent = copy[0];
  aiPhaseTitle.textContent = copy[1];
  aiPhaseStatus.textContent = copy[2];
  const progress = document.querySelector('.ai-progress i');
  progress.style.animation = 'none';
  void progress.offsetWidth;
  progress.style.animation = '';

  if (aiPhaseIndex >= 2) {
    const envRows = [...document.querySelectorAll('[data-env]')];
    envRows.forEach((item, index) => aiLater(() => item.classList.add('done'), phase === 'inject' ? 150 + index * 180 : 0));
    document.querySelectorAll('.runtime-container').forEach((container, index) => aiLater(() => {
      container.classList.add('injected');
      container.querySelector('.container-state').textContent = 'INJECTED';
      container.querySelector('.inject-state').textContent = '✓ Runtime binding complete';
    }, phase === 'inject' ? 800 + index * 500 : 0));
  }
  if (aiPhaseIndex >= 3) {
    document.querySelectorAll('.model-chip').forEach((item) => aiLater(() => item.classList.add('done'), phase === 'models' ? 760 : 0));
  }
  document.querySelector('.proxy-state').textContent = aiPhaseIndex === 0 ? 'CREATING' : aiPhaseIndex < 4 ? 'ACTIVE' : 'READY';
  if (restart && !aiPaused && !reducedAiMotion) scheduleAiPhase();
}

aiPauseButton.addEventListener('click', () => {
  aiPaused = !aiPaused;
  aiTheater.classList.toggle('paused', aiPaused);
  aiPauseButton.textContent = aiPaused ? '▶' : 'Ⅱ';
  aiPauseButton.setAttribute('aria-label', aiPaused ? 'Play AI connection animation' : 'Pause AI connection animation');
  if (aiPaused) {
    window.clearTimeout(aiTimer);
    clearAiDetails();
  } else {
    setAiPhase(aiPhases[aiPhaseIndex]);
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    window.clearTimeout(stageTimer);
    window.clearTimeout(journeyTimer);
    window.clearTimeout(aiTimer);
  } else {
    if (!paused && !prefersReducedMotion) scheduleNextStage();
    if (!journeyPaused && !reducedJourneyMotion) scheduleJourney();
    if (!aiPaused && !reducedAiMotion) scheduleAiPhase();
  }
});

const deployForm = document.querySelector('#deploy-form');
deployForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const button = deployForm.querySelector('button');
  const original = button.innerHTML;
  button.textContent = 'Deploying…';
  setJourneyPhase('agent');
  setStage('network');
  later(() => {
    button.innerHTML = original;
    document.querySelector('.journey-map').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 1300);
});

document.querySelectorAll('.faq-item button').forEach((button) => button.addEventListener('click', () => {
  const item = button.closest('.faq-item');
  const opening = !item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach((row) => {
    row.classList.remove('open');
    row.querySelector('button').setAttribute('aria-expanded', 'false');
    row.querySelector('i').textContent = '+';
  });
  if (opening) {
    item.classList.add('open');
    button.setAttribute('aria-expanded', 'true');
    button.querySelector('i').textContent = '−';
  }
}));

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (!entry.isIntersecting) return;
  entry.target.classList.add('visible');
  observer.unobserve(entry.target);
}), { threshold: .1 });
document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));

const menuButton = document.querySelector('.menu-button');
menuButton.addEventListener('click', () => {
  const header = document.querySelector('.site-header');
  const open = header.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? '×' : '☰';
});

setJourneyPhase(reducedJourneyMotion ? 'live' : 'inputs');
setStage(prefersReducedMotion ? 'network' : 'network');
setAiPhase(reducedAiMotion ? 'complete' : 'empty');

const skillsTheater = document.querySelector('.skills-theater');
const skillsPauseButton = document.querySelector('.skills-pause');
const skillsCopyButton = document.querySelector('.skills-copy');
const skillsPhases = ['analyze', 'build', 'config', 'deploy', 'complete'];
const skillsCopy = {
  analyze: ['01 · PROJECT ANALYSIS', 'Skills maps the application and every dependency.', 'ANALYZING PROJECT', 'Reading project graph', 'package.json · Dockerfile · source'],
  build: ['02 · SOURCE BUILD', 'The right runtime and image are built for the project.', 'BUILDING SOURCE', 'Building production image', 'runtime · architecture · exposed port'],
  config: ['03 · CONFIGURATION', 'Deployment configuration is generated from the analyzed graph.', 'GENERATING CONFIG', 'Writing deployment files', 'Dockerfile · Sealos template · env'],
  deploy: ['04 · SEALOS DEPLOY', 'Services roll out and health checks verify the release.', 'DEPLOYING TO SEALOS', 'Running health checks', 'rollout · service · ingress'],
  complete: ['05 · PRODUCTION LIVE', 'The agent receives a healthy, reachable production URL.', 'DEPLOYMENT COMPLETE', 'Production is live', 'https://app.sealos.run']
};
let skillsPhaseIndex = 0;
let skillsTimer;
let skillsPaused = false;
const reducedSkillsMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function scheduleSkillsPhase() {
  window.clearTimeout(skillsTimer);
  const delay = skillsPhases[skillsPhaseIndex] === 'complete' ? 2600 : 1250;
  skillsTimer = window.setTimeout(() => {
    skillsPhaseIndex = (skillsPhaseIndex + 1) % skillsPhases.length;
    setSkillsPhase(skillsPhases[skillsPhaseIndex]);
  }, delay);
}

function setSkillsPhase(phase) {
  if (!skillsTheater) return;
  skillsPhaseIndex = skillsPhases.indexOf(phase);
  skillsTheater.dataset.skillsPhase = phase;
  const [label, title, status, coreTitle, detail] = skillsCopy[phase];
  document.querySelector('.skills-phase-label').textContent = label;
  document.querySelector('.skills-phase-title').textContent = title;
  document.querySelector('.skills-live-status').textContent = status;
  document.querySelector('.skills-core-title').textContent = coreTitle;
  document.querySelector('.skills-core-detail').textContent = detail;
  document.querySelector('.skills-core-state').textContent = phase === 'complete' ? 'READY' : 'RUNNING';
  document.querySelectorAll('[data-skill-stage]').forEach((stage, index) => {
    const phasePosition = Math.min(skillsPhaseIndex, 3);
    stage.classList.toggle('active', phase !== 'complete' && index === phasePosition);
    stage.classList.toggle('done', phase === 'complete' || index < phasePosition);
  });
  const progress = document.querySelector('.skills-progress i');
  progress.style.animation = 'none';
  void progress.offsetWidth;
  progress.style.animation = '';
  if (!skillsPaused && !reducedSkillsMotion) scheduleSkillsPhase();
}

skillsPauseButton?.addEventListener('click', () => {
  skillsPaused = !skillsPaused;
  skillsTheater.classList.toggle('paused', skillsPaused);
  skillsPauseButton.textContent = skillsPaused ? '▶' : 'Ⅱ';
  skillsPauseButton.setAttribute('aria-label', skillsPaused ? 'Play Skills workflow animation' : 'Pause Skills workflow animation');
  if (skillsPaused) window.clearTimeout(skillsTimer);
  else setSkillsPhase(skillsPhases[skillsPhaseIndex]);
});

skillsCopyButton?.addEventListener('click', async () => {
  const command = skillsCopyButton.dataset.command;
  skillsCopyButton.classList.add('copied');
  skillsCopyButton.querySelector('b').textContent = 'Copied';
  skillsCopyButton.querySelector('span').textContent = '✓';
  try {
    await navigator.clipboard.writeText(command);
  } catch {
    const input = document.createElement('textarea');
    input.value = command;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();
  }
  window.setTimeout(() => {
    skillsCopyButton.classList.remove('copied');
    skillsCopyButton.querySelector('b').textContent = 'Copy';
    skillsCopyButton.querySelector('span').textContent = '□';
  }, 1800);
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) window.clearTimeout(skillsTimer);
  else if (!skillsPaused && !reducedSkillsMotion) scheduleSkillsPhase();
});

setSkillsPhase(reducedSkillsMotion ? 'complete' : 'analyze');

const storeExperience = document.querySelector('.store-experience');
const storeApps = [...document.querySelectorAll('.store-app')];
const storeForm = document.querySelector('.store-agent-form');
const storeInput = storeForm?.querySelector('input');
const storePhases = ['search', 'match', 'configure', 'deploy', 'complete'];
const storePhaseCopy = {
  search: ['SEARCHING', 'Searching App Store'],
  match: ['MATCH FOUND', 'Matching app requirements'],
  configure: ['CONFIGURING', 'Preparing production config'],
  deploy: ['DEPLOYING', 'Deploying to Sealos'],
  complete: ['APPLICATION LIVE', 'Deployment verified']
};
let storePhaseIndex = 0;
let storeAppIndex = 0;
let storeTimer;
const reducedStoreMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setStoreApp(index, restart = false) {
  if (!storeApps.length) return;
  storeAppIndex = (index + storeApps.length) % storeApps.length;
  storeApps.forEach((app, appIndex) => app.classList.toggle('active', appIndex === storeAppIndex));
  const name = storeApps[storeAppIndex].dataset.storeApp;
  if (storeInput && restart) storeInput.value = `Deploy ${name === 'n8n' ? 'an n8n workflow service' : `a ${name} application`}`;
  document.querySelector('.store-result-name').textContent = `${name} is ready`;
}

function scheduleStorePhase() {
  window.clearTimeout(storeTimer);
  const delay = storePhases[storePhaseIndex] === 'complete' ? 2200 : 1050;
  storeTimer = window.setTimeout(() => {
    if (storePhaseIndex === storePhases.length - 1) setStoreApp(storeAppIndex + 1, true);
    storePhaseIndex = (storePhaseIndex + 1) % storePhases.length;
    setStorePhase(storePhases[storePhaseIndex]);
  }, delay);
}

function setStorePhase(phase) {
  if (!storeExperience) return;
  storePhaseIndex = storePhases.indexOf(phase);
  storeExperience.dataset.storePhase = phase;
  const [state, title] = storePhaseCopy[phase];
  document.querySelector('.store-agent-state').textContent = state;
  document.querySelector('.store-agent-title').textContent = title;
  document.querySelectorAll('[data-store-step]').forEach((step, index) => {
    const activeIndex = Math.min(storePhaseIndex, 3);
    step.classList.toggle('active', phase !== 'complete' && index === activeIndex);
    step.classList.toggle('done', phase === 'complete' || index < activeIndex);
  });
  if (!reducedStoreMotion) scheduleStorePhase();
}

storeApps.forEach((app, index) => app.addEventListener('click', () => {
  setStoreApp(index, true);
  setStorePhase('search');
  storeExperience.scrollIntoView({ behavior: 'smooth', block: 'center' });
}));

storeForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = storeInput.value.trim();
  if (query) {
    const directMatch = storeApps.findIndex((app) => query.toLowerCase().includes(app.dataset.storeApp.toLowerCase()));
    if (directMatch >= 0) setStoreApp(directMatch);
    document.querySelector('.store-result-name').textContent = `${storeApps[storeAppIndex].dataset.storeApp} is ready`;
  }
  setStorePhase('search');
});

setStoreApp(0);
setStorePhase(reducedStoreMotion ? 'complete' : 'search');

const scalePage = document.querySelector('.scale-page');
const scaleNumbers = [...document.querySelectorAll('[data-count]')];
let scaleCounted = false;

function runScaleCounters() {
  if (scaleCounted || !scalePage) return;
  scaleCounted = true;
  scalePage.classList.add('counted');
  const numberFormat = new Intl.NumberFormat('en-US');
  const duration = 1500;

  scaleNumbers.forEach((number, index) => {
    const target = Number(number.dataset.count);
    const start = performance.now() + index * 90;
    const update = (now) => {
      const progress = Math.min(Math.max((now - start) / duration, 0), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      number.textContent = numberFormat.format(Math.round(target * eased));
      if (progress < 1) window.requestAnimationFrame(update);
    };
    window.requestAnimationFrame(update);
  });
}

if (scalePage) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    scaleNumbers.forEach((number) => { number.textContent = new Intl.NumberFormat('en-US').format(Number(number.dataset.count)); });
    scalePage.classList.add('counted');
    scaleCounted = true;
  } else {
    const scaleObserver = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      runScaleCounters();
      scaleObserver.disconnect();
    }, { threshold: .25 });
    scaleObserver.observe(scalePage);
  }
}
