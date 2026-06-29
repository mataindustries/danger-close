import './style.css'

const app = document.querySelector('#app')

app.innerHTML = `
  <section class="game-shell" aria-label="Danger Close game">
    <header class="topbar">
      <div class="brand">
        <span class="brand-mark" aria-hidden="true"></span>
        <div>
          <h1>Danger Close</h1>
          <p>Dead Zone // Sector 07</p>
        </div>
      </div>
      <div class="mission-status">
        <span class="status-dot"></span>
        <span>Drone online</span>
      </div>
    </header>

    <div class="arena">
      <canvas id="game-canvas" aria-label="Danger Close gameplay area"></canvas>

      <div class="hud hud-top" aria-live="polite">
        <div class="health-panel">
          <div class="stat-label">
            <span>Hull integrity</span>
            <div class="hull-readout">
              <b id="shield-text">SHD 00</b>
              <strong id="health-text">100 / 100</strong>
            </div>
          </div>
          <div class="health-track"><div id="health-bar" class="health-fill"></div></div>
        </div>
        <div class="primary-stats">
          <div class="hud-stat"><span>Time</span><strong id="timer">00:00</strong></div>
          <div class="hud-stat"><span>Level</span><strong id="level">01</strong></div>
          <div class="hud-stat gpu-stat"><span>GPU</span><strong id="gpu-count">0 / 6</strong></div>
          <div class="hud-stat scrap-stat"><span>Scrap</span><strong id="scrap-count">000</strong></div>
          <div class="hud-stat"><span>Kills</span><strong id="kill-count">000</strong></div>
        </div>
      </div>

      <div id="mission-panel" class="mission-panel" aria-live="polite">
        <div class="mission-heading">
          <span>Mission objective</span>
          <strong id="mission-status">Collecting salvage</strong>
        </div>
        <p id="mission-copy">Collect salvage to call extraction</p>
        <div class="mission-progress"><i id="mission-progress-bar"></i></div>
        <div class="mission-readout">
          <b id="mission-salvage">0 / 220</b>
          <button id="extraction-button" type="button" hidden>
            Call extraction <small>E</small>
          </button>
          <strong id="extraction-countdown" hidden>60s</strong>
        </div>
      </div>

      <div id="onboarding-hint" class="onboarding-hint">
        <strong>Survive as long as possible</strong>
        <span class="desktop-control">Move with WASD / arrow keys</span>
        <span class="touch-control">Touch and drag to move</span>
      </div>

      <div id="reactor-status" class="reactor-status" hidden>
        <div>
          <span>High-output state</span>
          <strong>Reactor surge</strong>
        </div>
        <b id="reactor-time">10.0s</b>
        <div class="reactor-meter"><i id="reactor-meter"></i></div>
      </div>

      <div id="performance-readout" class="performance-readout">
        <span id="performance-values">FPS -- · EN 0 · BLT 0 · PCK 0 · PRT 0 · TXT 0 · FX 0 · FT --MS</span>
        <b id="spike-indicator" class="spike-indicator" hidden>SPIKE</b>
      </div>

      <div class="hud hud-bottom">
        <div class="weapon-card">
          <span class="eyebrow">Weapon systems</span>
          <div class="weapon-status-list">
            <div class="weapon-status-row">
              <strong>ARC PULSE</strong>
              <span><b id="damage-stat">18</b> DMG · <b id="rate-stat">1.9</b>/S</span>
            </div>
            <div id="orbit-status" class="weapon-status-row" hidden>
              <strong>ORBIT DRONES</strong>
              <span><b id="orbit-count-stat">1</b> UNIT · <b id="orbit-damage-stat">14</b> DMG</span>
            </div>
            <div id="emp-status" class="weapon-status-row" hidden>
              <strong>EMP BURST</strong>
              <span><b id="emp-cooldown-stat">6.0</b>S CD · <b id="emp-radius-stat">120</b>R</span>
            </div>
          </div>
          <span class="weapon-mobility">THRUSTERS <b id="speed-stat">230</b></span>
          <span id="weapon-confirmation" class="weapon-confirmation" aria-live="polite"></span>
        </div>
        <div class="controls-hint">
          <span>THREAT RESPONSE // ONLINE</span>
          <span>AUTO-TARGET ACTIVE</span>
        </div>
      </div>

      <div id="level-up" class="modal-overlay" hidden>
        <div class="modal-panel level-panel" role="dialog" aria-modal="true" aria-labelledby="level-title">
          <span class="modal-kicker">System evolution available</span>
          <h2 id="level-title">Choose an upgrade</h2>
          <p>Integrate salvaged hardware into the drone.</p>
          <div id="upgrade-options" class="upgrade-grid"></div>
        </div>
      </div>

      <div id="main-menu" class="modal-overlay front-screen">
        <div class="modal-panel menu-panel" role="dialog" aria-modal="true" aria-labelledby="menu-title">
          <span class="modal-kicker">Salvage command // Sector 07</span>
          <h2 id="menu-title">Danger Close</h2>
          <p>Deploy. Recover dead-zone hardware. Extract before the swarm closes in.</p>
          <div class="profile-wallet" aria-label="Saved resources">
            <div><span>Saved scrap</span><strong id="menu-scrap">0</strong></div>
            <div><span>GPU fragments</span><strong id="menu-gpu">0</strong></div>
            <div><span>Reactor fragments</span><strong id="menu-reactor">0</strong></div>
          </div>
          <div class="screen-actions">
            <button id="menu-start-button" class="primary-action" type="button">Start run</button>
            <button id="menu-hangar-button" class="secondary-action" type="button">Hangar upgrades</button>
            <button id="reset-save-button" class="danger-action" type="button">Reset save</button>
          </div>
          <p id="reset-save-status" class="screen-status" aria-live="polite"></p>
        </div>
      </div>

      <div id="hangar" class="modal-overlay front-screen" hidden>
        <div class="modal-panel hangar-panel" role="dialog" aria-modal="true" aria-labelledby="hangar-title">
          <div class="hangar-heading">
            <div>
              <span class="modal-kicker">Drone repair bay</span>
              <h2 id="hangar-title">Hangar upgrades</h2>
              <p>Permanent hardware applies at the start of every run.</p>
            </div>
            <div class="hangar-wallet" aria-label="Saved resources">
              <span>SCR <b id="hangar-scrap">0</b></span>
              <span>GPU <b id="hangar-gpu">0</b></span>
              <span>RCT <b id="hangar-reactor">0</b></span>
            </div>
          </div>
          <div id="hangar-upgrades" class="hangar-grid"></div>
          <div class="hangar-actions">
            <button id="hangar-back-button" class="secondary-action" type="button">Main menu</button>
            <button id="hangar-start-button" class="primary-action" type="button">Start run</button>
          </div>
        </div>
      </div>

      <div id="run-summary" class="modal-overlay front-screen" hidden>
        <div class="modal-panel summary-panel" role="dialog" aria-modal="true" aria-labelledby="summary-title">
          <span id="summary-kicker" class="modal-kicker">Run complete</span>
          <h2 id="summary-title">Sector salvaged</h2>
          <p id="summary-copy">Recovered hardware transferred to the hangar.</p>
          <div class="run-summary detailed-summary">
            <div><span>Survival time</span><strong id="summary-time">00:00</strong></div>
            <div><span>Bots destroyed</span><strong id="summary-kills">0</strong></div>
            <div><span>Level reached</span><strong id="summary-level">1</strong></div>
            <div><span>Scrap collected</span><strong id="summary-scrap">0</strong></div>
            <div><span>GPUs collected</span><strong id="summary-gpus">0</strong></div>
            <div><span>Reactor cores</span><strong id="summary-reactors">0</strong></div>
          </div>
          <div class="reward-panel">
            <span>Permanent resources earned</span>
            <div>
              <strong>+<b id="reward-scrap">0</b> SCR</strong>
              <strong>+<b id="reward-gpu">0</b> GPU</strong>
              <strong>+<b id="reward-reactor">0</b> RCT</strong>
            </div>
          </div>
          <div class="summary-actions">
            <button id="summary-hangar-button" class="secondary-action" type="button">Return to hangar</button>
            <button id="summary-restart-button" class="primary-action" type="button">
              Start new run
              <small>Press Enter</small>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
`

const canvas = document.querySelector('#game-canvas')
const ctx = canvas.getContext('2d')

const ui = {
  healthPanel: document.querySelector('.health-panel'),
  healthText: document.querySelector('#health-text'),
  healthBar: document.querySelector('#health-bar'),
  shieldText: document.querySelector('#shield-text'),
  timer: document.querySelector('#timer'),
  level: document.querySelector('#level'),
  gpu: document.querySelector('#gpu-count'),
  scrap: document.querySelector('#scrap-count'),
  kills: document.querySelector('#kill-count'),
  damage: document.querySelector('#damage-stat'),
  rate: document.querySelector('#rate-stat'),
  speed: document.querySelector('#speed-stat'),
  missionPanel: document.querySelector('#mission-panel'),
  missionStatus: document.querySelector('#mission-status'),
  missionCopy: document.querySelector('#mission-copy'),
  missionProgress: document.querySelector('#mission-progress-bar'),
  missionSalvage: document.querySelector('#mission-salvage'),
  extractionButton: document.querySelector('#extraction-button'),
  extractionCountdown: document.querySelector('#extraction-countdown'),
  orbitStatus: document.querySelector('#orbit-status'),
  orbitCount: document.querySelector('#orbit-count-stat'),
  orbitDamage: document.querySelector('#orbit-damage-stat'),
  empStatus: document.querySelector('#emp-status'),
  empCooldown: document.querySelector('#emp-cooldown-stat'),
  empRadius: document.querySelector('#emp-radius-stat'),
  levelUp: document.querySelector('#level-up'),
  upgradeOptions: document.querySelector('#upgrade-options'),
  mainMenu: document.querySelector('#main-menu'),
  menuScrap: document.querySelector('#menu-scrap'),
  menuGpu: document.querySelector('#menu-gpu'),
  menuReactor: document.querySelector('#menu-reactor'),
  menuStartButton: document.querySelector('#menu-start-button'),
  menuHangarButton: document.querySelector('#menu-hangar-button'),
  resetSaveButton: document.querySelector('#reset-save-button'),
  resetSaveStatus: document.querySelector('#reset-save-status'),
  hangar: document.querySelector('#hangar'),
  hangarScrap: document.querySelector('#hangar-scrap'),
  hangarGpu: document.querySelector('#hangar-gpu'),
  hangarReactor: document.querySelector('#hangar-reactor'),
  hangarUpgrades: document.querySelector('#hangar-upgrades'),
  hangarBackButton: document.querySelector('#hangar-back-button'),
  hangarStartButton: document.querySelector('#hangar-start-button'),
  runSummary: document.querySelector('#run-summary'),
  summaryKicker: document.querySelector('#summary-kicker'),
  summaryTitle: document.querySelector('#summary-title'),
  summaryCopy: document.querySelector('#summary-copy'),
  summaryTime: document.querySelector('#summary-time'),
  summaryKills: document.querySelector('#summary-kills'),
  summaryLevel: document.querySelector('#summary-level'),
  summaryScrap: document.querySelector('#summary-scrap'),
  summaryGpus: document.querySelector('#summary-gpus'),
  summaryReactors: document.querySelector('#summary-reactors'),
  rewardScrap: document.querySelector('#reward-scrap'),
  rewardGpu: document.querySelector('#reward-gpu'),
  rewardReactor: document.querySelector('#reward-reactor'),
  summaryHangarButton: document.querySelector('#summary-hangar-button'),
  summaryRestartButton: document.querySelector('#summary-restart-button'),
  onboardingHint: document.querySelector('#onboarding-hint'),
  reactorStatus: document.querySelector('#reactor-status'),
  reactorTime: document.querySelector('#reactor-time'),
  reactorMeter: document.querySelector('#reactor-meter'),
  performanceValues: document.querySelector('#performance-values'),
  spikeIndicator: document.querySelector('#spike-indicator'),
  weaponCard: document.querySelector('.weapon-card'),
  weaponConfirmation: document.querySelector('#weapon-confirmation'),
}

const TAU = Math.PI * 2
const keys = new Set()
const movementVector = { x: 0, y: 0 }
const pointer = {
  active: false,
  id: null,
  originX: 0,
  originY: 0,
  x: 0,
  y: 0,
}

let width = 0
let height = 0
let dpr = 1
let lastFrame = performance.now()
let state
let backgroundMarks = []
let ambientDust = []
let ambientGlows = []
const backgroundLayer = document.createElement('canvas')
const vignetteLayer = document.createElement('canvas')
let reducedEffects = false
let resetSaveArmed = false

const MOBILE_CAPS = {
  enemies: 64,
  heavyEnemies: 7,
  reclaimers: 1,
  bullets: 90,
  pickups: 40,
  particles: 130,
  rings: 28,
  floatingTexts: 18,
  reducedEffectsEnemies: 42,
  surge: {
    enemies: 48,
    heavyEnemies: 5,
    reclaimers: 1,
    bullets: 48,
    pickups: 24,
    particles: 52,
    rings: 16,
    floatingTexts: 10,
  },
}

const DESKTOP_CAPS = {
  enemies: 96,
  heavyEnemies: 10,
  reclaimers: 2,
  bullets: 150,
  pickups: 60,
  particles: 220,
  rings: 45,
  floatingTexts: 26,
  reducedEffectsEnemies: 68,
  surge: {
    enemies: 72,
    heavyEnemies: 8,
    reclaimers: 1,
    bullets: 86,
    pickups: 36,
    particles: 90,
    rings: 24,
    floatingTexts: 14,
  },
}

const MIN_FIRE_INTERVAL = 0.22
const MAX_ORBIT_DRONES = 4
const MIN_EMP_COOLDOWN = 2.8
const MAX_EMP_RADIUS = 210
const MAX_SIMULATION_DT = 1 / 30
const SPIKE_THRESHOLD_MS = 80
const SPIKE_INDICATOR_DURATION = 1.25
const SAVE_KEY = 'danger-close-save-v1'
const SAVE_VERSION = 1
const MAX_UPGRADE_RANK = 5
const MISSION_SALVAGE_REQUIRED = 220
const EXTRACTION_DURATION = 60
const SALVAGE_VALUES = {
  gpu: 3,
  scrap: 2,
  battery: 1,
  reactor: 24,
}
const SURGE_FIRE_INTERVAL_MULTIPLIER = 0.7
const SURGE_MIN_FIRE_INTERVAL = 0.18
const SURGE_SPAWN_INTERVAL_MULTIPLIER = 0.94
const PICKUP_LIFETIME = 20
let entityCaps = DESKTOP_CAPS

const hangarUpgrades = [
  {
    id: 'hullPlating',
    icon: 'HP',
    title: 'Hull Plating',
    description: 'Reinforced shell increases starting hull integrity.',
    cost: (rank) => ({ scrap: 20 + rank * 18 }),
    effect: (rank) => `${100 + rank * 8} starting hull`,
  },
  {
    id: 'arcCapacitor',
    icon: 'AC',
    title: 'Arc Capacitor',
    description: 'Higher-density capacitors improve starting Arc Pulse damage.',
    cost: (rank) => ({ gpu: 10 + rank * 9 }),
    effect: (rank) => `${18 + rank * 2} Arc damage`,
  },
  {
    id: 'thrusterTuning',
    icon: 'TT',
    title: 'Thruster Tuning',
    description: 'Calibrated drive units increase starting movement speed.',
    cost: (rank) => ({
      scrap: 18 + rank * 15,
      gpu: 7 + rank * 6,
    }),
    effect: (rank) => `${230 + rank * 8} movement speed`,
  },
  {
    id: 'salvageMagnet',
    icon: 'SM',
    title: 'Salvage Magnet',
    description: 'Expanded induction coils pull pickups from farther away.',
    cost: (rank) => ({ scrap: 16 + rank * 14 }),
    effect: (rank) =>
      rank === 0 ? 'Standard pickup reach' : `+${rank * 6}% pickup reach`,
  },
  {
    id: 'batteryReserve',
    icon: 'BR',
    title: 'Battery Reserve',
    description: 'Stored charge provides a shield buffer at deployment.',
    cost: (rank) => ({
      scrap: 22 + rank * 18,
      gpu: 8 + rank * 7,
    }),
    effect: (rank) => `${rank * 5} starting shield`,
  },
  {
    id: 'reactorHandling',
    icon: 'RH',
    title: 'Reactor Handling',
    description: 'Improved containment extends Reactor Surge modestly.',
    cost: (rank) => ({ reactor: 2 + rank * 2 }),
    effect: (rank) => `${(10 + rank * 0.5).toFixed(1)}s Reactor Surge`,
  },
]

function createDefaultSaveData() {
  const upgrades = {}
  for (const upgrade of hangarUpgrades) upgrades[upgrade.id] = 0
  return {
    version: SAVE_VERSION,
    currencies: { scrap: 0, gpu: 0, reactor: 0 },
    upgrades,
  }
}

function safeInteger(value, maximum = Number.MAX_SAFE_INTEGER) {
  const number = Number(value)
  if (!Number.isFinite(number)) return 0
  return Math.max(0, Math.min(maximum, Math.floor(number)))
}

function loadSaveData() {
  const fallback = createDefaultSaveData()
  try {
    const raw = window.localStorage.getItem(SAVE_KEY)
    if (!raw) return fallback
    const stored = JSON.parse(raw)
    if (!stored || stored.version !== SAVE_VERSION) return fallback

    fallback.currencies.scrap = safeInteger(stored.currencies?.scrap)
    fallback.currencies.gpu = safeInteger(stored.currencies?.gpu)
    fallback.currencies.reactor = safeInteger(stored.currencies?.reactor)
    for (const upgrade of hangarUpgrades) {
      fallback.upgrades[upgrade.id] = safeInteger(
        stored.upgrades?.[upgrade.id],
        MAX_UPGRADE_RANK,
      )
    }
  } catch {
    return fallback
  }
  return fallback
}

function saveProgress() {
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(saveData))
    return true
  } catch {
    return false
  }
}

function getPermanentBonuses() {
  const ranks = saveData.upgrades
  return {
    maxHealth: 100 + ranks.hullPlating * 8,
    damage: 18 + ranks.arcCapacitor * 2,
    speed: 230 + ranks.thrusterTuning * 8,
    magnetMultiplier: 1 + ranks.salvageMagnet * 0.06,
    startingShield: ranks.batteryReserve * 5,
    surgeDuration: 10 + ranks.reactorHandling * 0.5,
  }
}

let saveData = loadSaveData()

const enemyTypes = {
  scavenger: {
    radius: 17,
    speed: 70,
    health: 32,
    damage: 9,
    color: '#ee6649',
    score: 1,
    drops: { gpu: 0.38, scrap: 0.24, battery: 0.035, reactor: 0.007 },
  },
  scout: {
    radius: 13,
    speed: 112,
    health: 20,
    damage: 7,
    color: '#f0a253',
    score: 1,
    drops: { gpu: 0.46, scrap: 0.16, battery: 0.03, reactor: 0.01 },
  },
  heavy: {
    radius: 25,
    speed: 46,
    health: 88,
    damage: 14,
    color: '#d84b48',
    score: 2,
    drops: { gpu: 0.2, scrap: 0.48, battery: 0.21, reactor: 0.025 },
  },
  reclaimer: {
    radius: 32,
    speed: 54,
    health: 230,
    damage: 18,
    color: '#d95778',
    score: 4,
    drops: { gpu: 0.3, scrap: 0.34, battery: 0.18, reactor: 0.15 },
  },
}

const resourceTypes = {
  gpu: { radius: 11, magnetRadius: 190, color: '#68f78e' },
  battery: { radius: 12, magnetRadius: 205, color: '#59cfff' },
  scrap: { radius: 10, magnetRadius: 165, color: '#e6a15b' },
  reactor: { radius: 14, magnetRadius: 205, color: '#ffb13b' },
}

function createInitialState() {
  const permanent = getPermanentBonuses()
  return {
    mode: 'running',
    elapsed: 0,
    spawnClock: 0.16,
    fireClock: 0,
    shake: 0,
    hudClock: 0,
    introClock: 8,
    targetId: null,
    levelUpChoices: [],
    scoutIntroduced: false,
    heavyIntroduced: false,
    reclaimerIntroduced: false,
    reclaimerDetected: false,
    level: 1,
    gpu: 0,
    gpuNeeded: 6,
    totalGpu: 0,
    scrap: 0,
    batteriesCollected: 0,
    reactorCoresCollected: 0,
    runFinalized: false,
    runSuccess: null,
    reactorSurge: 0,
    reactorSurgeDuration: permanent.surgeDuration,
    reactorEnemyCap: 0,
    warningFlash: 0,
    fps: 60,
    fpsFrames: 0,
    fpsTime: 0,
    frameMs: 16.7,
    diagnosticsClock: 0,
    spikeTimer: 0,
    spawnBacklog: 0,
    mission: {
      salvage: 0,
      required: MISSION_SALVAGE_REQUIRED,
      ready: false,
      extractionActive: false,
      extractionTime: EXTRACTION_DURATION,
      extractionDuration: EXTRACTION_DURATION,
    },
    kills: 0,
    nextEntityId: 1,
    player: {
      x: width / 2,
      y: height / 2,
      radius: 19,
      health: permanent.maxHealth,
      maxHealth: permanent.maxHealth,
      shield: permanent.startingShield,
      maxShield: 30,
      shieldDecayDelay: permanent.startingShield > 0 ? 18 : 0,
      speed: permanent.speed,
      damage: permanent.damage,
      magnetMultiplier: permanent.magnetMultiplier,
      fireInterval: 0.52,
      bulletSpeed: 700,
      hitCooldown: 0,
      angle: -Math.PI / 2,
      rotorPhase: 0,
      muzzleGlow: 0,
      moveX: 0,
      moveY: 0,
    },
    orbit: {
      unlocked: false,
      count: 0,
      damage: 14,
      radius: 54,
      droneRadius: 8,
      angle: 0,
      hitInterval: 0.38,
      positions: [],
    },
    emp: {
      unlocked: false,
      damage: 26,
      radius: 120,
      cooldown: 6,
      clock: 6,
    },
    enemies: [],
    bullets: [],
    pickups: [],
    particles: [],
    rings: [],
    floatingTexts: [],
  }
}

function hideFrontScreens() {
  ui.mainMenu.hidden = true
  ui.hangar.hidden = true
  ui.runSummary.hidden = true
}

function updateProfileWallets() {
  const currencies = saveData.currencies
  ui.menuScrap.textContent = currencies.scrap
  ui.menuGpu.textContent = currencies.gpu
  ui.menuReactor.textContent = currencies.reactor
  ui.hangarScrap.textContent = currencies.scrap
  ui.hangarGpu.textContent = currencies.gpu
  ui.hangarReactor.textContent = currencies.reactor
}

function clearResetConfirmation() {
  resetSaveArmed = false
  ui.resetSaveButton.textContent = 'Reset save'
  ui.resetSaveButton.classList.remove('is-armed')
  ui.resetSaveStatus.textContent = ''
}

function showMainMenu() {
  state = createInitialState()
  state.mode = 'menu'
  hideFrontScreens()
  ui.levelUp.hidden = true
  ui.mainMenu.hidden = false
  ui.onboardingHint.classList.add('is-hidden')
  pointer.active = false
  keys.clear()
  clearResetConfirmation()
  updateProfileWallets()
  updateHud()
  lastFrame = performance.now()
}

function showHangar() {
  state = createInitialState()
  state.mode = 'hangar'
  hideFrontScreens()
  ui.levelUp.hidden = true
  ui.hangar.hidden = false
  ui.onboardingHint.classList.add('is-hidden')
  pointer.active = false
  keys.clear()
  updateProfileWallets()
  renderHangar()
  updateHud()
  lastFrame = performance.now()
}

function resetGame() {
  state = createInitialState()
  hideFrontScreens()
  ui.levelUp.hidden = true
  ui.onboardingHint.classList.remove('is-hidden')
  ui.performanceValues.textContent =
    'FPS -- · EN 0 · BLT 0 · PCK 0 · PRT 0 · TXT 0 · FX 0 · FT --MS'
  ui.spikeIndicator.hidden = true
  ui.weaponConfirmation.textContent = ''
  ui.weaponConfirmation.classList.remove('is-visible')
  pointer.active = false
  keys.clear()
  reducedEffects = false
  updateHud()
  lastFrame = performance.now()
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect()
  const oldWidth = width
  const oldHeight = height

  width = Math.max(320, rect.width)
  height = Math.max(360, rect.height)
  const useMobileProfile =
    width < 760 || window.matchMedia('(pointer: coarse)').matches
  entityCaps = useMobileProfile ? MOBILE_CAPS : DESKTOP_CAPS
  dpr = Math.min(window.devicePixelRatio || 1, useMobileProfile ? 1.6 : 2)
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  if (state && oldWidth && oldHeight) {
    state.player.x *= width / oldWidth
    state.player.y *= height / oldHeight
  }

  createBackgroundMarks()
}

function createBackgroundMarks() {
  backgroundMarks = []
  ambientDust = []
  ambientGlows = []
  const count = Math.max(18, Math.round((width * height) / 28000))
  let seed = 7307
  const random = () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }

  for (let i = 0; i < count; i += 1) {
    const segments = 2 + Math.floor(random() * 4)
    const points = []
    let x = random() * width
    let y = random() * height
    points.push({ x, y })
    for (let j = 0; j < segments; j += 1) {
      x += (random() - 0.5) * 44
      y += (random() - 0.5) * 44
      points.push({ x, y })
    }
    backgroundMarks.push({
      points,
      opacity: 0.08 + random() * 0.12,
      debris: random() > 0.62,
      patchRadius: random() > 0.72 ? 18 + random() * 46 : 0,
    })
  }

  const dustCount = Math.min(42, Math.max(20, Math.round((width * height) / 22000)))
  for (let i = 0; i < dustCount; i += 1) {
    ambientDust.push({
      x: random() * width,
      y: random() * height,
      size: 0.5 + random() * 1.5,
      speed: 4 + random() * 9,
      drift: 4 + random() * 12,
      phase: random() * TAU,
      opacity: 0.05 + random() * 0.13,
    })
  }

  for (let i = 0; i < 3; i += 1) {
    ambientGlows.push({
      x: random() * width,
      y: random() * height,
      radius: 80 + random() * 150,
      phase: random() * TAU,
      opacity: 0.018 + random() * 0.025,
    })
  }

  rebuildBackgroundLayers()
}

function rebuildBackgroundLayers() {
  // Static scenery does not need the full gameplay DPR. This keeps the cached
  // layers sharp enough while avoiding a large mobile GPU-memory allocation.
  const layerDpr = Math.min(dpr, 1.25)
  backgroundLayer.width = Math.round(width * layerDpr)
  backgroundLayer.height = Math.round(height * layerDpr)
  vignetteLayer.width = backgroundLayer.width
  vignetteLayer.height = backgroundLayer.height

  const backgroundContext = backgroundLayer.getContext('2d')
  backgroundContext.setTransform(layerDpr, 0, 0, layerDpr, 0, 0)
  const gradient = backgroundContext.createRadialGradient(
    width * 0.5,
    height * 0.42,
    0,
    width * 0.5,
    height * 0.5,
    Math.max(width, height) * 0.78,
  )
  gradient.addColorStop(0, '#162124')
  gradient.addColorStop(0.52, '#101719')
  gradient.addColorStop(1, '#080d0f')
  backgroundContext.fillStyle = gradient
  backgroundContext.fillRect(0, 0, width, height)

  const gridSize = 56
  backgroundContext.lineWidth = 1
  for (let x = 0; x <= width; x += gridSize) {
    backgroundContext.strokeStyle =
      x % (gridSize * 4) === 0
        ? 'rgba(82, 130, 127, 0.13)'
        : 'rgba(73, 99, 98, 0.075)'
    backgroundContext.beginPath()
    backgroundContext.moveTo(x, 0)
    backgroundContext.lineTo(x, height)
    backgroundContext.stroke()
  }
  for (let y = 0; y <= height; y += gridSize) {
    backgroundContext.strokeStyle =
      y % (gridSize * 4) === 0
        ? 'rgba(82, 130, 127, 0.13)'
        : 'rgba(73, 99, 98, 0.075)'
    backgroundContext.beginPath()
    backgroundContext.moveTo(0, y)
    backgroundContext.lineTo(width, y)
    backgroundContext.stroke()
  }

  for (const mark of backgroundMarks) {
    if (mark.patchRadius) {
      const point = mark.points[0]
      backgroundContext.fillStyle = `rgba(3, 7, 8, ${mark.opacity * 0.32})`
      backgroundContext.beginPath()
      backgroundContext.ellipse(
        point.x,
        point.y,
        mark.patchRadius,
        mark.patchRadius * 0.48,
        mark.opacity * 8,
        0,
        TAU,
      )
      backgroundContext.fill()
    }
    backgroundContext.strokeStyle = `rgba(175, 154, 118, ${mark.opacity})`
    backgroundContext.lineWidth = 1
    backgroundContext.beginPath()
    for (let index = 0; index < mark.points.length; index += 1) {
      const point = mark.points[index]
      if (index === 0) backgroundContext.moveTo(point.x, point.y)
      else backgroundContext.lineTo(point.x, point.y)
    }
    backgroundContext.stroke()
    if (mark.debris) {
      const point = mark.points[0]
      backgroundContext.fillStyle =
        `rgba(124, 113, 90, ${mark.opacity + 0.05})`
      backgroundContext.fillRect(point.x - 2, point.y - 1, 5, 2)
    }
  }

  const vignetteContext = vignetteLayer.getContext('2d')
  vignetteContext.setTransform(layerDpr, 0, 0, layerDpr, 0, 0)
  const vignette = vignetteContext.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.25,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.72,
  )
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)')
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.44)')
  vignetteContext.fillStyle = vignette
  vignetteContext.fillRect(0, 0, width, height)

  for (const glow of ambientGlows) {
    const diameter = Math.ceil(glow.radius * 2)
    const sprite = document.createElement('canvas')
    sprite.width = Math.ceil(diameter * layerDpr)
    sprite.height = Math.ceil(diameter * layerDpr)
    const spriteContext = sprite.getContext('2d')
    spriteContext.setTransform(layerDpr, 0, 0, layerDpr, 0, 0)
    const glowGradient = spriteContext.createRadialGradient(
      diameter / 2,
      diameter / 2,
      0,
      diameter / 2,
      diameter / 2,
      diameter / 2,
    )
    glowGradient.addColorStop(
      0,
      `rgba(97, 176, 165, ${glow.opacity})`,
    )
    glowGradient.addColorStop(1, 'rgba(50, 100, 95, 0)')
    spriteContext.fillStyle = glowGradient
    spriteContext.fillRect(0, 0, diameter, diameter)
    glow.sprite = sprite
    glow.diameter = diameter
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainder = Math.floor(seconds % 60)
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
}

function isReactorSurging() {
  return state.reactorSurge > 0
}

function getCurrentDamage() {
  return state.player.damage * (isReactorSurging() ? 1.55 : 1)
}

function getCurrentFireInterval() {
  if (!isReactorSurging()) return state.player.fireInterval
  return Math.max(
    SURGE_MIN_FIRE_INTERVAL,
    state.player.fireInterval * SURGE_FIRE_INTERVAL_MULTIPLIER,
  )
}

function getEntityCap(type) {
  if (!isReactorSurging()) return entityCaps[type]
  if (type === 'enemies' && state.reactorEnemyCap > 0) {
    return Math.min(entityCaps.enemies, state.reactorEnemyCap)
  }
  return Math.min(entityCaps[type], entityCaps.surge[type])
}

function getVisualEffectCap(type) {
  const cap = getEntityCap(type)
  if (!reducedEffects) return cap
  return Math.floor(cap * (type === 'floatingTexts' ? 0.75 : 0.72))
}

function updateEffectBudget() {
  const performanceLoad =
    state.fps < 50 || state.frameMs > 22 || state.spikeTimer > 0
  const surgeLoad =
    isReactorSurging() &&
    (performanceLoad ||
      state.enemies.length >= getEntityCap('enemies') * 0.66 ||
      state.particles.length >= getEntityCap('particles') * 0.55 ||
      state.bullets.length >= getEntityCap('bullets') * 0.65)

  reducedEffects =
    performanceLoad ||
    surgeLoad ||
    state.enemies.length >= entityCaps.reducedEffectsEnemies ||
    state.particles.length >= entityCaps.particles * 0.72 ||
    state.bullets.length >= entityCaps.bullets * 0.75 ||
    state.pickups.length >= entityCaps.pickups * 0.65
}

function updatePerformanceReadout(rawDt) {
  const frameMs = rawDt * 1000
  if (
    frameMs >= SPIKE_THRESHOLD_MS &&
    document.visibilityState === 'visible'
  ) {
    state.spikeTimer = SPIKE_INDICATOR_DURATION
  } else {
    state.spikeTimer = Math.max(
      0,
      state.spikeTimer - Math.min(rawDt, 0.1),
    )
  }
  const hideSpikeIndicator = state.spikeTimer <= 0
  if (ui.spikeIndicator.hidden !== hideSpikeIndicator) {
    ui.spikeIndicator.hidden = hideSpikeIndicator
  }

  const boundedFrameMs = Math.min(frameMs, 250)
  const smoothing = boundedFrameMs > state.frameMs ? 0.18 : 0.06
  state.frameMs += (boundedFrameMs - state.frameMs) * smoothing
  state.fpsFrames += 1
  state.fpsTime += Math.min(rawDt, 0.25)
  state.diagnosticsClock += Math.min(rawDt, 0.25)

  if (state.fpsTime >= 0.4) {
    const measuredFps = state.fpsFrames / state.fpsTime
    state.fps += (measuredFps - state.fps) * 0.32
    state.fpsFrames = 0
    state.fpsTime = 0
  }

  if (state.diagnosticsClock >= 0.25) {
    state.diagnosticsClock = 0
    ui.performanceValues.textContent =
      `FPS ${Math.round(state.fps)} · EN ${state.enemies.length} · ` +
      `BLT ${state.bullets.length} · PCK ${state.pickups.length} · ` +
      `PRT ${state.particles.length} · TXT ${state.floatingTexts.length} · ` +
      `FX ${state.rings.length} · FT ${state.frameMs.toFixed(1)}MS`
  }
}

function updateHud() {
  const player = state.player
  const mission = state.mission
  const healthPercent = Math.max(0, (player.health / player.maxHealth) * 100)
  ui.healthText.textContent = `${Math.ceil(Math.max(0, player.health))} / ${player.maxHealth}`
  ui.healthBar.style.width = `${healthPercent}%`
  ui.healthBar.classList.toggle('critical', healthPercent <= 30)
  ui.shieldText.textContent = `SHD ${String(Math.ceil(player.shield)).padStart(2, '0')}`
  ui.shieldText.classList.toggle('is-active', player.shield > 0)
  ui.healthPanel.classList.toggle('has-shield', player.shield > 0)
  ui.timer.textContent = formatTime(state.elapsed)
  ui.level.textContent = String(state.level).padStart(2, '0')
  ui.gpu.textContent = `${state.gpu} / ${state.gpuNeeded}`
  ui.scrap.textContent = String(state.scrap).padStart(3, '0')
  ui.kills.textContent = String(state.kills).padStart(3, '0')
  ui.damage.textContent = Math.round(getCurrentDamage())
  ui.rate.textContent = (1 / getCurrentFireInterval()).toFixed(1)
  ui.speed.textContent = Math.round(player.speed)
  ui.orbitStatus.hidden = !state.orbit.unlocked
  ui.orbitCount.textContent = state.orbit.count
  ui.orbitDamage.textContent = Math.round(state.orbit.damage)
  ui.empStatus.hidden = !state.emp.unlocked
  ui.empCooldown.textContent = state.emp.cooldown.toFixed(1)
  ui.empRadius.textContent = Math.round(state.emp.radius)

  const missionProgress = Math.min(
    100,
    (mission.salvage / mission.required) * 100,
  )
  ui.missionProgress.style.width = `${missionProgress}%`
  ui.missionSalvage.textContent =
    `${Math.min(mission.salvage, mission.required)} / ${mission.required}`
  ui.missionPanel.classList.toggle(
    'is-ready',
    mission.ready && !mission.extractionActive && state.mode === 'running',
  )
  ui.missionPanel.classList.toggle(
    'is-inbound',
    mission.extractionActive && state.mode === 'running',
  )

  if (state.mode === 'summary') {
    ui.missionStatus.textContent = state.runSuccess
      ? 'Sector salvaged'
      : 'Drone lost'
    ui.missionCopy.textContent = 'Run complete'
  } else if (mission.extractionActive) {
    ui.missionStatus.textContent = 'Extraction inbound'
    ui.missionCopy.textContent = 'Survive until pickup'
  } else if (mission.ready) {
    ui.missionStatus.textContent = 'Extraction ready'
    ui.missionCopy.textContent = 'Call extraction when prepared'
  } else {
    ui.missionStatus.textContent = 'Collecting salvage'
    ui.missionCopy.textContent = 'Collect salvage to call extraction'
  }

  ui.extractionButton.hidden =
    !mission.ready || mission.extractionActive || state.mode !== 'running'
  ui.extractionCountdown.hidden =
    !mission.extractionActive || state.mode !== 'running'
  ui.extractionCountdown.textContent =
    `${Math.max(0, Math.ceil(mission.extractionTime))}s`

  const surging = isReactorSurging()
  ui.reactorStatus.hidden = !surging
  ui.weaponCard.classList.toggle('is-surging', surging)
  ui.reactorTime.textContent = `${Math.max(0, state.reactorSurge).toFixed(1)}s`
  ui.reactorMeter.style.width = `${Math.min(
    100,
    (state.reactorSurge / state.reactorSurgeDuration) * 100,
  )}%`
}

function canAfford(cost) {
  return (
    (cost.scrap || 0) <= saveData.currencies.scrap &&
    (cost.gpu || 0) <= saveData.currencies.gpu &&
    (cost.reactor || 0) <= saveData.currencies.reactor
  )
}

function formatUpgradeCost(cost) {
  const parts = []
  if (cost.scrap) parts.push(`<span>${cost.scrap} SCR</span>`)
  if (cost.gpu) parts.push(`<span>${cost.gpu} GPU</span>`)
  if (cost.reactor) parts.push(`<span>${cost.reactor} RCT</span>`)
  return parts.join('')
}

function renderHangar() {
  updateProfileWallets()
  ui.hangarUpgrades.innerHTML = hangarUpgrades
    .map((upgrade) => {
      const rank = saveData.upgrades[upgrade.id]
      const maxed = rank >= MAX_UPGRADE_RANK
      const cost = maxed ? {} : upgrade.cost(rank)
      const affordable = !maxed && canAfford(cost)
      return `
        <article class="hangar-card${maxed ? ' is-maxed' : ''}">
          <div class="hangar-card-heading">
            <span class="hangar-icon">${upgrade.icon}</span>
            <div>
              <strong>${upgrade.title}</strong>
              <span>Rank ${rank} / ${MAX_UPGRADE_RANK}</span>
            </div>
          </div>
          <p>${upgrade.description}</p>
          <div class="upgrade-effect">
            <span>Current</span>
            <b>${upgrade.effect(rank)}</b>
            <span>${maxed ? 'Maximum rank installed' : `Next: ${upgrade.effect(rank + 1)}`}</span>
          </div>
          <button
            class="hangar-buy-button"
            type="button"
            data-hangar-upgrade="${upgrade.id}"
            ${affordable ? '' : 'disabled'}
          >
            <span>${maxed ? 'Max rank' : 'Install upgrade'}</span>
            <small>${maxed ? 'Fully calibrated' : formatUpgradeCost(cost)}</small>
          </button>
        </article>
      `
    })
    .join('')
}

function purchaseHangarUpgrade(id) {
  if (state.mode !== 'hangar') return
  const upgrade = hangarUpgrades.find((item) => item.id === id)
  if (!upgrade) return

  const rank = saveData.upgrades[id]
  if (rank >= MAX_UPGRADE_RANK) return
  const cost = upgrade.cost(rank)
  if (!canAfford(cost)) return

  saveData.currencies.scrap -= cost.scrap || 0
  saveData.currencies.gpu -= cost.gpu || 0
  saveData.currencies.reactor -= cost.reactor || 0
  saveData.upgrades[id] = rank + 1
  saveProgress()
  renderHangar()
}

function handleResetSave() {
  if (!resetSaveArmed) {
    resetSaveArmed = true
    ui.resetSaveButton.textContent = 'Confirm reset'
    ui.resetSaveButton.classList.add('is-armed')
    ui.resetSaveStatus.textContent =
      'Press again to erase all currencies and upgrade ranks.'
    return
  }

  saveData = createDefaultSaveData()
  const saved = saveProgress()
  resetSaveArmed = false
  ui.resetSaveButton.textContent = 'Reset save'
  ui.resetSaveButton.classList.remove('is-armed')
  ui.resetSaveStatus.textContent = saved
    ? 'Save data reset.'
    : 'Storage unavailable; progress reset for this session.'
  updateProfileWallets()
}

function calculateRunRewards(success) {
  const recoveryRate = success ? 1 : 0.55
  return {
    scrap:
      Math.floor(state.scrap * recoveryRate) + (success ? 24 : 0),
    gpu:
      Math.floor(state.totalGpu * recoveryRate) + (success ? 6 : 0),
    reactor:
      Math.floor(state.reactorCoresCollected * recoveryRate) +
      (success ? 1 : 0),
  }
}

function finishRun(success) {
  if (state.mode !== 'running' || state.runFinalized) return
  state.runFinalized = true
  state.runSuccess = success
  state.mode = 'summary'
  state.mission.extractionActive = false
  if (!success) state.player.health = 0
  pointer.active = false
  keys.clear()

  const rewards = calculateRunRewards(success)
  saveData.currencies.scrap += rewards.scrap
  saveData.currencies.gpu += rewards.gpu
  saveData.currencies.reactor += rewards.reactor
  saveProgress()

  ui.summaryKicker.textContent = success
    ? 'Extraction complete'
    : 'Signal lost'
  ui.summaryKicker.classList.toggle('danger', !success)
  ui.summaryKicker.classList.toggle('success', success)
  ui.summaryTitle.textContent = success ? 'Sector salvaged' : 'Drone lost'
  ui.summaryCopy.textContent = success
    ? 'Recovered hardware transferred to the hangar.'
    : 'Emergency telemetry recovered part of the collected salvage.'
  ui.summaryTime.textContent = formatTime(state.elapsed)
  ui.summaryKills.textContent = state.kills
  ui.summaryLevel.textContent = state.level
  ui.summaryScrap.textContent = state.scrap
  ui.summaryGpus.textContent = state.totalGpu
  ui.summaryReactors.textContent = state.reactorCoresCollected
  ui.rewardScrap.textContent = rewards.scrap
  ui.rewardGpu.textContent = rewards.gpu
  ui.rewardReactor.textContent = rewards.reactor

  hideFrontScreens()
  ui.levelUp.hidden = true
  ui.runSummary.hidden = false
  updateProfileWallets()
  updateHud()
  lastFrame = performance.now()
}

function addMissionSalvage(type, amount = 1) {
  const value = SALVAGE_VALUES[type] || 0
  if (value <= 0) return

  const mission = state.mission
  mission.salvage += value * amount
  if (mission.ready || mission.salvage < mission.required) return

  mission.ready = true
  state.introClock = 0
  ui.onboardingHint.classList.add('is-hidden')
  createFloatingText(
    'EXTRACTION READY',
    state.player.x,
    state.player.y - 50,
    '#8dffd0',
    1.6,
    15,
    true,
  )
  addRing({
    x: state.player.x,
    y: state.player.y,
    radius: state.player.radius + 5,
    maxRadius: 105,
    life: 0.75,
    maxLife: 0.75,
    color: '#73efc1',
  }, true)
}

function callExtraction() {
  const mission = state.mission
  if (
    state.mode !== 'running' ||
    !mission.ready ||
    mission.extractionActive
  ) {
    return
  }

  mission.extractionActive = true
  mission.extractionTime = mission.extractionDuration
  state.spawnClock = Math.min(state.spawnClock, 0.18)
  state.introClock = 0
  ui.onboardingHint.classList.add('is-hidden')
  createFloatingText(
    'EXTRACTION CALLED',
    state.player.x,
    state.player.y - 50,
    '#9cffe1',
    1.6,
    15,
    true,
  )
  addRing({
    kind: 'extraction',
    x: state.player.x,
    y: state.player.y,
    radius: state.player.radius + 8,
    maxRadius: 135,
    life: 0.9,
    maxLife: 0.9,
    color: '#78f3ca',
  }, true)
  updateHud()
}

function winGame() {
  if (state.mode !== 'running') return
  state.mission.extractionTime = 0
  createFloatingText(
    'SECTOR SALVAGED',
    state.player.x,
    state.player.y - 54,
    '#b4ffe3',
    2,
    16,
    true,
  )
  finishRun(true)
}

function updateMission(wallDt) {
  if (!state.mission.extractionActive) return
  state.mission.extractionTime = Math.max(
    0,
    state.mission.extractionTime - wallDt,
  )
  if (state.mission.extractionTime <= 0) winGame()
}

function getMovementVector() {
  let x = 0
  let y = 0

  if (keys.has('KeyA') || keys.has('ArrowLeft')) x -= 1
  if (keys.has('KeyD') || keys.has('ArrowRight')) x += 1
  if (keys.has('KeyW') || keys.has('ArrowUp')) y -= 1
  if (keys.has('KeyS') || keys.has('ArrowDown')) y += 1

  if (pointer.active) {
    const dragX = pointer.x - pointer.originX
    const dragY = pointer.y - pointer.originY
    const distance = Math.hypot(dragX, dragY)
    if (distance > 5) {
      const strength = Math.min(distance / 46, 1)
      x += (dragX / distance) * strength
      y += (dragY / distance) * strength
    }
  }

  const magnitude = Math.hypot(x, y)
  if (magnitude > 1) {
    x /= magnitude
    y /= magnitude
  }

  movementVector.x = x
  movementVector.y = y
  return movementVector
}

function randomEnemyType() {
  const difficulty = Math.min(state.elapsed / 120, 1)
  const eliteWindow =
    state.elapsed >= 120 || state.mission.extractionActive
  if (eliteWindow) {
    const eliteChance = state.mission.extractionActive ? 0.055 : 0.016
    if (Math.random() < eliteChance) return 'reclaimer'
  }
  const roll = Math.random()
  if (state.elapsed > 18 && roll < 0.07 + difficulty * 0.1) return 'heavy'
  if (state.elapsed > 3.5 && roll < 0.3 + difficulty * 0.1) return 'scout'
  return 'scavenger'
}

function spawnEnemy(forcedType = null) {
  if (state.enemies.length >= getEntityCap('enemies')) return false

  const margin = 34
  let x = 0
  let y = 0

  // Retry a few edge positions to avoid stacked spawns feeding an expensive
  // separation blob on the following frames.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const side = Math.floor(Math.random() * 4)
    if (side === 0) {
      x = Math.random() * width
      y = -margin
    } else if (side === 1) {
      x = width + margin
      y = Math.random() * height
    } else if (side === 2) {
      x = Math.random() * width
      y = height + margin
    } else {
      x = -margin
      y = Math.random() * height
    }

    let blocked = false
    for (const enemy of state.enemies) {
      if (enemy.dead) continue
      const dx = enemy.x - x
      const dy = enemy.y - y
      if (dx * dx + dy * dy < 58 * 58) {
        blocked = true
        break
      }
    }
    if (!blocked) break
  }

  let typeName = forcedType || randomEnemyType()
  if (typeName === 'reclaimer') {
    let reclaimerCount = 0
    for (const enemy of state.enemies) {
      if (!enemy.dead && enemy.type === 'reclaimer') reclaimerCount += 1
    }
    if (reclaimerCount >= getEntityCap('reclaimers')) typeName = 'heavy'
  }
  if (typeName === 'heavy') {
    let heavyCount = 0
    for (const enemy of state.enemies) {
      if (!enemy.dead && enemy.type === 'heavy') heavyCount += 1
    }
    const heavyCap = isReactorSurging()
      ? entityCaps.surge.heavyEnemies
      : entityCaps.heavyEnemies
    if (heavyCount >= heavyCap) typeName = 'scavenger'
  }
  const type = enemyTypes[typeName]
  const healthMilestones = Math.floor(state.elapsed / 45)
  const healthScale = 1 + Math.min(healthMilestones * 0.08, 0.4)
  const speedScale = 1 + Math.min(state.elapsed * 0.0014, 0.24)

  state.enemies.push({
    id: state.nextEntityId++,
    type: typeName,
    x,
    y,
    radius: type.radius,
    speed: type.speed * speedScale * (0.95 + Math.random() * 0.1),
    health: type.health * healthScale,
    maxHealth: type.health * healthScale,
    damage: type.damage,
    color: type.color,
    score: type.score,
    angle: 0,
    vx: 0,
    vy: 0,
    phase: Math.random() * TAU,
    flash: 0,
    orbitCooldown: 0,
    dead: false,
  })

  if (typeName === 'reclaimer' && !state.reclaimerDetected) {
    state.reclaimerDetected = true
    state.warningFlash = Math.max(state.warningFlash, 0.5)
    createFloatingText(
      'RECLAIMER DETECTED',
      state.player.x,
      state.player.y - 58,
      '#ff8fa8',
      1.7,
      15,
      true,
    )
  }
  return true
}

function findNearestEnemy() {
  let bestEnemy = null
  let bestScore = Infinity
  const player = state.player

  for (const enemy of state.enemies) {
    if (enemy.dead) continue
    const dx = enemy.x - player.x
    const dy = enemy.y - player.y
    const distance = Math.hypot(dx, dy)
    const onScreen =
      enemy.x > -enemy.radius &&
      enemy.x < width + enemy.radius &&
      enemy.y > -enemy.radius &&
      enemy.y < height + enemy.radius
    let score = distance / enemy.speed + (onScreen ? 0 : 1.15)
    if (distance < 170) score *= 0.72
    if (enemy.id === state.targetId) score *= 0.9

    if (score < bestScore) {
      bestScore = score
      bestEnemy = enemy
    }
  }

  state.targetId = bestEnemy?.id ?? null
  return bestEnemy
}

function fireAtNearestEnemy(target = findNearestEnemy()) {
  if (!target) return false
  if (state.bullets.length >= getEntityCap('bullets')) return true

  const player = state.player
  const targetDistance = Math.hypot(target.x - player.x, target.y - player.y)
  const leadTime = Math.min(targetDistance / player.bulletSpeed, 0.42)
  const aimX = target.x + target.vx * leadTime
  const aimY = target.y + target.vy * leadTime
  const dx = aimX - player.x
  const dy = aimY - player.y
  const distance = Math.hypot(dx, dy) || 1
  const directionX = dx / distance
  const directionY = dy / distance
  const surged = isReactorSurging()
  player.angle = Math.atan2(directionY, directionX)

  const bulletX = player.x + directionX * 24
  const bulletY = player.y + directionY * 24
  state.bullets.push({
    x: bulletX,
    y: bulletY,
    previousX: bulletX,
    previousY: bulletY,
    vx: directionX * player.bulletSpeed,
    vy: directionY * player.bulletSpeed,
    radius: width < 700 ? 5.2 : 4.6,
    damage: getCurrentDamage(),
    surged,
    life: Math.max(1.25, distance / player.bulletSpeed + 0.4),
  })
  player.muzzleGlow = 0.11

  createMuzzleEffect(
    player.x + directionX * 25,
    player.y + directionY * 25,
    directionX,
    directionY,
    surged,
  )
  return true
}

function addRing(ring, important = false) {
  const ringCap = getVisualEffectCap('rings')
  if (
    !important &&
    reducedEffects &&
    state.rings.length >= ringCap * 0.7
  ) {
    return
  }
  if (state.rings.length >= ringCap) state.rings.shift()
  state.rings.push(ring)
}

function createMuzzleEffect(x, y, dx, dy, surged = false) {
  // Surged shots already have a bright projectile trail and muzzle flash. Avoid
  // allocating a ring and several particles for every high-rate shot.
  if (surged) return

  const color = '#65f6ff'
  addRing({ x, y, radius: 2, maxRadius: 13, life: 0.14, maxLife: 0.14, color })
  const particleCount = reducedEffects ? 1 : 3
  const availableParticles =
    getVisualEffectCap('particles') - state.particles.length
  for (let i = 0; i < Math.min(particleCount, availableParticles); i += 1) {
    const spread = (Math.random() - 0.5) * 1.2
    state.particles.push({
      x,
      y,
      vx: dx * (80 + Math.random() * 90) + spread * 50,
      vy: dy * (80 + Math.random() * 90) + spread * 50,
      size: 1.5 + Math.random() * 2,
      life: 0.12 + Math.random() * 0.1,
      maxLife: 0.22,
      color: '#adfbff',
    })
  }
}

function createHitEffect(x, y, color = '#ffb064', count = 5) {
  const surgeScale = isReactorSurging() ? 0.48 : 1
  const budgetScale = reducedEffects ? 0.42 : 1
  const effectCount = Math.ceil(count * surgeScale * budgetScale)
  const availableParticles =
    getVisualEffectCap('particles') - state.particles.length
  for (let i = 0; i < Math.min(effectCount, availableParticles); i += 1) {
    const angle = Math.random() * TAU
    const speed = 35 + Math.random() * 135
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 1.5 + Math.random() * 3,
      life: 0.14 + Math.random() * 0.22,
      maxLife: 0.36,
      color,
    })
  }
}

function createFloatingText(
  text,
  x,
  y,
  color = '#e8ffff',
  life = 0.75,
  size = 11,
  important = false,
) {
  if ((reducedEffects || isReactorSurging()) && !important) return
  const floatingTextCap = getVisualEffectCap('floatingTexts')
  if (state.floatingTexts.length >= floatingTextCap) {
    if (!important) return
    state.floatingTexts.shift()
  }
  state.floatingTexts.push({
    text,
    x,
    y,
    vy: -26,
    life,
    maxLife: life,
    color,
    size,
  })
}

function destroyEnemy(enemy, suppressEffects = false) {
  if (enemy.dead) return
  enemy.dead = true
  state.kills += enemy.score
  if (!suppressEffects) {
    createHitEffect(
      enemy.x,
      enemy.y,
      enemy.color,
      enemy.type === 'reclaimer' ? 24 : enemy.type === 'heavy' ? 20 : 12,
    )
    addRing({
      x: enemy.x,
      y: enemy.y,
      radius: enemy.radius * 0.5,
      maxRadius: enemy.radius * 2.2,
      life: 0.28,
      maxLife: 0.28,
      color: enemy.color,
    })
  }

  const resourceType = rollResourceDrop(enemy.type)
  if (resourceType) spawnResourcePickup(resourceType, enemy)
  if (enemy.type === 'reclaimer') {
    const bonusRoll = Math.random()
    const bonusType =
      bonusRoll < 0.18 ? 'reactor' : bonusRoll < 0.62 ? 'gpu' : 'scrap'
    spawnResourcePickup(bonusType, enemy)
  }
}

function rollResourceDrop(enemyType) {
  const dropWeights = enemyTypes[enemyType].drops
  const roll = Math.random()
  let cumulativeChance = 0

  for (const [resourceType, chance] of Object.entries(dropWeights)) {
    cumulativeChance += chance
    if (roll < cumulativeChance) return resourceType
  }

  return null
}

function spawnResourcePickup(type, enemy) {
  const pickupCap = getEntityCap('pickups')
  const atPickupCap = state.pickups.length >= pickupCap
  const isEssential = type === 'battery' || type === 'reactor'
  if (atPickupCap) {
    if (!isEssential) return
    const replaceableIndex = state.pickups.findIndex(
      (pickup) => pickup.type === 'scrap' || pickup.type === 'gpu',
    )
    if (replaceableIndex === -1) return
    state.pickups.splice(replaceableIndex, 1)
  } else if (
    !isEssential &&
    state.pickups.length >= pickupCap * 0.65 &&
    Math.random() < (isReactorSurging() ? 0.72 : 0.55)
  ) {
    return
  }

  const resource = resourceTypes[type]
  const pickupMargin = resource.radius + 10
  const isValuableScrap =
    type === 'scrap' &&
    (enemy.type === 'heavy' || enemy.type === 'reclaimer')
  const doubleScrapChance = enemy.type === 'reclaimer' ? 0.8 : 0.55

  state.pickups.push({
    type,
    value: isValuableScrap && Math.random() < doubleScrapChance ? 2 : 1,
    x: Math.max(pickupMargin, Math.min(width - pickupMargin, enemy.x)),
    y: Math.max(pickupMargin, Math.min(height - pickupMargin, enemy.y)),
    vx: (Math.random() - 0.5) * 34,
    vy: (Math.random() - 0.5) * 34,
    radius: resource.radius,
    phase: Math.random() * TAU,
    age: 0,
  })
}

function collectGpu(pickup) {
  state.gpu += 1
  state.totalGpu += 1
  addMissionSalvage('gpu')
  createHitEffect(pickup.x, pickup.y, '#7dff9b', 16)
  createFloatingText('+GPU', pickup.x, pickup.y - 12, '#92ffad', 0.9, 12, true)
  addRing({
    x: pickup.x,
    y: pickup.y,
    radius: 6,
    maxRadius: 55,
    life: 0.44,
    maxLife: 0.44,
    color: '#67f58d',
  }, true)

  if (state.gpu >= state.gpuNeeded) {
    state.gpu -= state.gpuNeeded
    state.level += 1
    state.gpuNeeded = Math.round(state.gpuNeeded * 1.35 + 1)
    openLevelUp()
  }
}

function collectBattery(pickup) {
  const player = state.player
  const charge = 18
  const missingHealth = Math.max(0, player.maxHealth - player.health)
  const repairedHealth = Math.min(charge, missingHealth)
  const shieldGain = charge - repairedHealth

  player.health += repairedHealth
  player.shield = Math.min(player.maxShield, player.shield + shieldGain)
  player.shieldDecayDelay = 12
  state.batteriesCollected += 1
  addMissionSalvage('battery')

  createHitEffect(pickup.x, pickup.y, '#62ceff', 18)
  createFloatingText('+BATTERY', pickup.x, pickup.y - 14, '#83dcff', 1, 12, true)
  addRing({
    x: player.x,
    y: player.y,
    radius: player.radius,
    maxRadius: 68,
    life: 0.55,
    maxLife: 0.55,
    color: '#5bcaff',
  }, true)
}

function collectScrap(pickup) {
  state.scrap += pickup.value
  addMissionSalvage('scrap', pickup.value)
  createHitEffect(pickup.x, pickup.y, '#d9e1df', 5)
  createHitEffect(pickup.x, pickup.y, '#f0a056', 6)
  createFloatingText(
    pickup.value > 1 ? `+${pickup.value} SCRAP` : '+SCRAP',
    pickup.x,
    pickup.y - 10,
    '#ffc27d',
    0.78,
    11,
    true,
  )
  addRing({
    x: pickup.x,
    y: pickup.y,
    radius: 5,
    maxRadius: 31,
    life: 0.28,
    maxLife: 0.28,
    color: '#e6a15b',
  }, true)
}

function collectReactor(pickup) {
  state.reactorCoresCollected += 1
  addMissionSalvage('reactor')
  state.reactorSurge = state.reactorSurgeDuration
  // Never grow a pre-existing crowd when surge starts. Typical mobile runs use
  // the lower surge ceiling; a busier scene is frozen at its current count
  // instead of visibly deleting live enemies.
  state.reactorEnemyCap = Math.min(
    entityCaps.enemies,
    Math.max(state.enemies.length, entityCaps.surge.enemies),
  )
  state.warningFlash = 0.85
  state.shake = Math.min(12, state.shake + 5)
  state.introClock = 0
  ui.onboardingHint.classList.add('is-hidden')

  createHitEffect(pickup.x, pickup.y, '#ffc342', 24)
  createHitEffect(pickup.x, pickup.y, '#ff5a36', 14)
  createFloatingText(
    'REACTOR SURGE',
    pickup.x,
    pickup.y - 18,
    '#ffe36b',
    1.4,
    14,
    true,
  )
  addRing({
    x: state.player.x,
    y: state.player.y,
    radius: state.player.radius,
    maxRadius: 92,
    life: 0.7,
    maxLife: 0.7,
    color: '#ffb13b',
  }, true)
}

function collectPickup(pickup) {
  pickup.collected = true

  if (pickup.type === 'gpu') collectGpu(pickup)
  else if (pickup.type === 'battery') collectBattery(pickup)
  else if (pickup.type === 'scrap') collectScrap(pickup)
  else if (pickup.type === 'reactor') collectReactor(pickup)

  updateHud()
}

const upgrades = [
  {
    id: 'fireRate',
    icon: 'FR',
    title: 'Arc Pulse Fire Rate Up',
    description: 'Arc Pulse fires faster.',
    current: () => `${(1 / state.player.fireInterval).toFixed(1)} shots/s`,
    next: () =>
      `${(1 / Math.max(MIN_FIRE_INTERVAL, state.player.fireInterval * 0.76)).toFixed(1)} shots/s`,
    available: () => state.player.fireInterval > MIN_FIRE_INTERVAL + 0.001,
    confirmation: 'ARC RATE UP',
    apply: () => {
      state.player.fireInterval = Math.max(
        MIN_FIRE_INTERVAL,
        state.player.fireInterval * 0.76,
      )
    },
  },
  {
    id: 'damage',
    icon: 'DM',
    title: 'Arc Pulse Damage Up',
    description: 'Arc Pulse hits harder.',
    current: () => `${Math.round(state.player.damage)} damage`,
    next: () => `${Math.round(state.player.damage + 7)} damage`,
    confirmation: 'ARC DAMAGE UP',
    apply: () => {
      state.player.damage += 7
    },
  },
  {
    id: 'speed',
    icon: 'MV',
    title: 'Thrusters Up',
    description: 'Drone moves faster.',
    current: () => `${Math.round(state.player.speed)} speed`,
    next: () => `${Math.round(state.player.speed + 28)} speed`,
    confirmation: 'THRUSTERS UP',
    apply: () => {
      state.player.speed += 28
    },
  },
  {
    id: 'unlockOrbit',
    icon: 'OD',
    title: 'Unlock Orbit Drone',
    description: 'Deploy a cyan micro-drone that damages enemies on contact.',
    current: () => 'Offline',
    next: () => '1 drone',
    isUnlock: true,
    available: () => !state.orbit.unlocked,
    confirmation: 'ORBIT DRONE ONLINE',
    apply: () => {
      state.orbit.unlocked = true
      state.orbit.count = 1
      syncOrbitPositions()
      addRing({
        x: state.player.x,
        y: state.player.y,
        radius: state.player.radius + 4,
        maxRadius: state.orbit.radius + 14,
        life: 0.5,
        maxLife: 0.5,
        color: '#69f5ff',
      }, true)
    },
  },
  {
    id: 'addOrbit',
    icon: '+D',
    title: 'Add Orbit Drone',
    description: 'Add another micro-drone to the defensive orbit.',
    current: () =>
      `${state.orbit.count} ${state.orbit.count === 1 ? 'drone' : 'drones'}`,
    next: () => `${state.orbit.count + 1} drones`,
    available: () =>
      state.orbit.unlocked && state.orbit.count < MAX_ORBIT_DRONES,
    confirmation: 'ORBIT DRONE ADDED',
    apply: () => {
      state.orbit.count = Math.min(MAX_ORBIT_DRONES, state.orbit.count + 1)
      syncOrbitPositions()
    },
  },
  {
    id: 'orbitDamage',
    icon: 'OD',
    title: 'Orbit Drone Damage Up',
    description: 'Micro-drone contact hits harder.',
    current: () => `${Math.round(state.orbit.damage)} damage`,
    next: () => `${Math.round(state.orbit.damage + 6)} damage`,
    available: () => state.orbit.unlocked,
    confirmation: 'ORBIT DAMAGE UP',
    apply: () => {
      state.orbit.damage += 6
    },
  },
  {
    id: 'unlockEmp',
    icon: 'EM',
    title: 'Unlock EMP Burst',
    description: 'Emit an automatic radial shockwave every few seconds.',
    current: () => 'Offline',
    next: () => `${state.emp.cooldown.toFixed(1)}s pulse`,
    isUnlock: true,
    available: () => !state.emp.unlocked,
    confirmation: 'EMP BURST ONLINE',
    apply: () => {
      state.emp.unlocked = true
      state.emp.clock = 0
    },
  },
  {
    id: 'empCooldown',
    icon: 'CD',
    title: 'EMP Cooldown Down',
    description: 'EMP Burst recharges faster.',
    current: () => `${state.emp.cooldown.toFixed(1)}s cooldown`,
    next: () =>
      `${Math.max(MIN_EMP_COOLDOWN, state.emp.cooldown * 0.82).toFixed(1)}s cooldown`,
    available: () =>
      state.emp.unlocked && state.emp.cooldown > MIN_EMP_COOLDOWN + 0.01,
    confirmation: 'EMP COOLDOWN DOWN',
    apply: () => {
      state.emp.cooldown = Math.max(
        MIN_EMP_COOLDOWN,
        state.emp.cooldown * 0.82,
      )
      state.emp.clock = Math.min(state.emp.clock, state.emp.cooldown)
    },
  },
  {
    id: 'empRadius',
    icon: 'ER',
    title: 'EMP Radius Up',
    description: 'Expand the EMP shockwave coverage.',
    current: () => `${Math.round(state.emp.radius)} radius`,
    next: () => `${Math.min(MAX_EMP_RADIUS, state.emp.radius + 24)} radius`,
    available: () =>
      state.emp.unlocked && state.emp.radius < MAX_EMP_RADIUS,
    confirmation: 'EMP RADIUS UP',
    apply: () => {
      state.emp.radius = Math.min(MAX_EMP_RADIUS, state.emp.radius + 24)
    },
  },
  {
    id: 'empDamage',
    icon: 'ED',
    title: 'EMP Damage Up',
    description: 'Increase EMP Burst shock damage.',
    current: () => `${Math.round(state.emp.damage)} damage`,
    next: () => `${Math.round(state.emp.damage + 10)} damage`,
    available: () => state.emp.unlocked,
    confirmation: 'EMP DAMAGE UP',
    apply: () => {
      state.emp.damage += 10
    },
  },
]

function shuffle(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const current = items[index]
    items[index] = items[swapIndex]
    items[swapIndex] = current
  }
  return items
}

function getLevelUpChoices() {
  const available = upgrades.filter(
    (upgrade) => !upgrade.available || upgrade.available(),
  )
  const unlocks = available.filter((upgrade) => upgrade.isUnlock)
  const choices = []

  // Keep weapon expansion discoverable without allowing both unlocks to crowd
  // out the general-purpose Arc Pulse and movement upgrades.
  if (unlocks.length > 0) {
    choices.push(unlocks[Math.floor(Math.random() * unlocks.length)])
  }

  const remaining = shuffle(
    available.filter(
      (upgrade) => !choices.includes(upgrade) && !upgrade.isUnlock,
    ),
  )
  choices.push(...remaining.slice(0, 3 - choices.length))
  return choices
}

function openLevelUp() {
  state.mode = 'levelup'
  state.levelUpChoices = getLevelUpChoices()
  ui.upgradeOptions.innerHTML = state.levelUpChoices
    .map(
      (upgrade, index) => `
        <button class="upgrade-card" type="button" data-upgrade="${upgrade.id}">
          <span class="upgrade-index">0${index + 1}</span>
          <span class="upgrade-icon">${upgrade.icon}</span>
          <strong>${upgrade.title}</strong>
          <span class="upgrade-description">${upgrade.description}</span>
          <span class="upgrade-change">
            ${upgrade.current()} <i>→</i> <b>${upgrade.next()}</b>
          </span>
        </button>
      `,
    )
    .join('')
  ui.levelUp.hidden = false
  updateHud()
}

function chooseUpgrade(id) {
  if (state.mode !== 'levelup') return
  const upgrade = state.levelUpChoices.find((item) => item.id === id)
  if (!upgrade) return
  upgrade.apply()
  createFloatingText(
    upgrade.confirmation,
    state.player.x,
    state.player.y - 34,
    '#89f6fb',
    1.35,
    14,
    true,
  )
  state.fireClock = Math.min(state.fireClock, getCurrentFireInterval())
  state.mode = 'running'
  ui.levelUp.hidden = true
  updateHud()
  ui.weaponCard.classList.remove('upgrade-flash')
  void ui.weaponCard.offsetWidth
  ui.weaponCard.classList.add('upgrade-flash')
  ui.weaponConfirmation.textContent = upgrade.confirmation
  ui.weaponConfirmation.classList.remove('is-visible')
  void ui.weaponConfirmation.offsetWidth
  ui.weaponConfirmation.classList.add('is-visible')
  lastFrame = performance.now()
}

function endGame() {
  finishRun(false)
}

function applyPlayerDamage(amount) {
  const player = state.player
  const shieldDamage = Math.min(player.shield, amount)
  player.shield -= shieldDamage
  const hullDamage = amount - shieldDamage
  player.health -= hullDamage
  return { shieldDamage, hullDamage }
}

function updatePlayer(dt) {
  const player = state.player
  const movement = getMovementVector()
  player.moveX = movement.x
  player.moveY = movement.y
  player.x += movement.x * player.speed * dt
  player.y += movement.y * player.speed * dt
  player.x = Math.max(player.radius + 8, Math.min(width - player.radius - 8, player.x))
  player.y = Math.max(player.radius + 8, Math.min(height - player.radius - 8, player.y))
  player.hitCooldown = Math.max(0, player.hitCooldown - dt)
  player.muzzleGlow = Math.max(0, player.muzzleGlow - dt)
  player.rotorPhase += dt * 8
  if (player.shieldDecayDelay > 0) {
    player.shieldDecayDelay -= dt
  } else {
    player.shield = Math.max(0, player.shield - dt * 2.5)
  }

  if (movement.x || movement.y) {
    player.angle = Math.atan2(movement.y, movement.x)
  }
}

function updateSpawning(dt) {
  state.spawnClock -= dt
  if (state.spawnClock > 0) return

  const queuedSpawn = state.spawnBacklog > 0
  if (queuedSpawn) state.spawnBacklog -= 1
  const surging = isReactorSurging()
  const extracting = state.mission.extractionActive
  const surgePressure = surging ? SURGE_SPAWN_INTERVAL_MULTIPLIER : 1
  const extractionPressure = extracting ? 0.82 : 1
  const baseSpawnInterval = Math.max(
    0.31,
    0.86 - Math.min(state.elapsed, 180) * 0.00305,
  )
  const spawnInterval =
    baseSpawnInterval * surgePressure * extractionPressure
  const baseWaveChance = Math.max(
    0,
    Math.min(0.12, (state.elapsed - 55) * 0.00085),
  )
  let waveChance = surging ? Math.min(0.06, baseWaveChance) : baseWaveChance
  if (extracting) waveChance = Math.min(0.15, waveChance + 0.04)
  if (!queuedSpawn && Math.random() < waveChance) {
    state.spawnBacklog = 1
  }
  const maxEnemies = Math.min(
    getEntityCap('enemies'),
    26 + Math.floor(state.elapsed * 0.28) + (extracting ? 8 : 0),
  )
  let forcedType = null
  let introduction = null

  if (
    (extracting || state.elapsed >= 120) &&
    !state.reclaimerIntroduced
  ) {
    forcedType = 'reclaimer'
    introduction = 'reclaimer'
  } else if (state.elapsed >= 4 && !state.scoutIntroduced) {
    forcedType = 'scout'
    introduction = 'scout'
  } else if (state.elapsed >= 14 && !state.heavyIntroduced) {
    forcedType = 'heavy'
    introduction = 'heavy'
  }

  const spawned =
    state.enemies.length < maxEnemies && spawnEnemy(forcedType)
  if (spawned && introduction === 'scout') {
    state.scoutIntroduced = true
  } else if (spawned && introduction === 'heavy') {
    state.heavyIntroduced = true
  } else if (spawned && introduction === 'reclaimer') {
    state.reclaimerIntroduced = true
  } else if (!spawned) {
    state.spawnBacklog = 0
  }

  // A two-enemy wave is intentionally split across frames.
  state.spawnClock =
    state.spawnBacklog > 0
      ? Math.min(0.14, spawnInterval * 0.45)
      : spawnInterval * (0.86 + Math.random() * 0.28)
}

function updateShooting(dt) {
  state.fireClock -= dt
  const target = findNearestEnemy()
  if (target) {
    state.player.angle = Math.atan2(
      target.y - state.player.y,
      target.x - state.player.x,
    )
  }
  if (state.fireClock > 0) return
  if (fireAtNearestEnemy(target)) {
    state.fireClock = getCurrentFireInterval()
  } else {
    state.fireClock = 0
  }
}

function syncOrbitPositions() {
  const orbit = state.orbit
  if (!orbit.unlocked) {
    orbit.positions.length = 0
    return
  }

  while (orbit.positions.length < orbit.count) {
    orbit.positions.push({ x: state.player.x, y: state.player.y, angle: 0 })
  }
  orbit.positions.length = orbit.count

  for (let index = 0; index < orbit.count; index += 1) {
    const angle = orbit.angle + (index / orbit.count) * TAU
    const position = orbit.positions[index]
    position.x = state.player.x + Math.cos(angle) * orbit.radius
    position.y = state.player.y + Math.sin(angle) * orbit.radius
    position.angle = angle + Math.PI / 2
  }
}

function updateOrbitDrones(dt) {
  const orbit = state.orbit
  if (!orbit.unlocked) return

  orbit.angle = (orbit.angle + dt * 2.15) % TAU
  syncOrbitPositions()
  const impactEffectBudget = reducedEffects ? 2 : 5
  let impactEffects = 0

  // At the entity caps this is at most four drones against 96 enemies. A
  // player-centered annulus rejects most enemies before any drone checks.
  for (const enemy of state.enemies) {
    if (enemy.dead) continue
    enemy.orbitCooldown = Math.max(0, enemy.orbitCooldown - dt)
    if (enemy.orbitCooldown > 0) continue

    const playerDx = enemy.x - state.player.x
    const playerDy = enemy.y - state.player.y
    const outerDistance = orbit.radius + orbit.droneRadius + enemy.radius
    const innerDistance = Math.max(
      0,
      orbit.radius - orbit.droneRadius - enemy.radius,
    )
    const playerDistanceSquared =
      playerDx * playerDx + playerDy * playerDy
    if (
      playerDistanceSquared > outerDistance * outerDistance ||
      playerDistanceSquared < innerDistance * innerDistance
    ) {
      continue
    }

    for (const drone of orbit.positions) {
      const dx = drone.x - enemy.x
      const dy = drone.y - enemy.y
      const collisionDistance = orbit.droneRadius + enemy.radius
      if (dx * dx + dy * dy > collisionDistance * collisionDistance) continue

      enemy.health -= orbit.damage
      enemy.flash = 0.12
      enemy.orbitCooldown = orbit.hitInterval
      if (impactEffects < impactEffectBudget) {
        createHitEffect(drone.x, drone.y, '#79f7ff', 3)
        impactEffects += 1
      }
      // Contact already has a small impact effect; avoid a second particle
      // burst when an orbit drone lands the killing hit.
      if (enemy.health <= 0) destroyEnemy(enemy, true)
      break
    }
  }
}

function triggerEmpBurst() {
  const emp = state.emp
  const player = state.player
  emp.clock = emp.cooldown

  addRing({
    kind: 'emp',
    x: player.x,
    y: player.y,
    radius: player.radius + 9,
    maxRadius: emp.radius,
    life: 0.62,
    maxLife: 0.62,
    color: '#71f3ff',
    bright: isReactorSurging(),
  }, true)

  const radiusSquared = emp.radius * emp.radius
  for (const enemy of state.enemies) {
    if (enemy.dead) continue
    const dx = enemy.x - player.x
    const dy = enemy.y - player.y
    const distanceSquared = dx * dx + dy * dy
    if (distanceSquared > radiusSquared) continue

    const distance = Math.sqrt(distanceSquared) || 1
    const force = 10 + (1 - Math.min(1, distance / emp.radius)) * 18
    enemy.x += (dx / distance) * force
    enemy.y += (dy / distance) * force
    enemy.health -= emp.damage
    enemy.flash = 0.18
    // The EMP ring is the entire effect. Large multi-kills must not allocate a
    // particle-and-ring burst for every enemy inside the pulse.
    if (enemy.health <= 0) destroyEnemy(enemy, true)
  }
  state.shake = Math.min(13, state.shake + 1.5)
}

function updateEmp(dt) {
  if (!state.emp.unlocked) return
  state.emp.clock -= dt
  if (state.emp.clock <= 0) triggerEmpBurst()
}

function updateEnemies(dt) {
  const player = state.player

  for (const enemy of state.enemies) {
    if (enemy.dead) continue

    const dx = player.x - enemy.x
    const dy = player.y - enemy.y
    const distance = Math.hypot(dx, dy) || 1
    const directionX = dx / distance
    const directionY = dy / distance
    enemy.angle = Math.atan2(directionY, directionX)
    enemy.phase += dt * (enemy.type === 'scout' ? 9 : 5)
    enemy.flash = Math.max(0, enemy.flash - dt)

    const sway = enemy.type === 'scout' ? Math.sin(enemy.phase) * 24 : 0
    const approachScale =
      distance < 90 ? 0.7 + (distance / 90) * 0.3 : 1
    enemy.vx = directionX * enemy.speed * approachScale + -directionY * sway
    enemy.vy = directionY * enemy.speed * approachScale + directionX * sway
    enemy.x += enemy.vx * dt
    enemy.y += enemy.vy * dt

    const collisionDistance = player.radius + enemy.radius
    if (distance < collisionDistance) {
      const overlap = collisionDistance - distance
      enemy.x -= directionX * overlap * 0.78
      enemy.y -= directionY * overlap * 0.78

      if (player.hitCooldown <= 0) {
        const damage = applyPlayerDamage(enemy.damage)
        const blockedByShield = damage.shieldDamage > 0 && damage.hullDamage === 0
        player.hitCooldown = 0.86
        state.shake = Math.min(13, state.shake + 7)
        createHitEffect(player.x, player.y, blockedByShield ? '#5acbff' : '#ff5e54', 12)
        addRing({
          x: player.x,
          y: player.y,
          radius: player.radius,
          maxRadius: player.radius * 2.4,
          life: 0.3,
          maxLife: 0.3,
          color: blockedByShield ? '#5acbff' : '#ff554d',
        }, true)
        updateHud()
        if (player.health <= 0) {
          endGame()
          return
        }
      }
    }
  }

  // Entity caps keep this bounded; squared-distance checks avoid square roots for
  // the overwhelming majority of pairs. Resolution work is also capped so a
  // dense blob is relaxed over several frames instead of monopolizing one.
  const maxSeparations = reducedEffects
    ? Math.ceil(state.enemies.length * 1.25)
    : state.enemies.length * 2
  let separations = 0
  separationLoop: for (let i = 0; i < state.enemies.length; i += 1) {
    const enemy = state.enemies[i]
    if (enemy.dead) continue
    for (let j = i + 1; j < state.enemies.length; j += 1) {
      const other = state.enemies[j]
      if (other.dead) continue
      const dx = other.x - enemy.x
      const dy = other.y - enemy.y
      const targetDistance = (enemy.radius + other.radius) * 0.82
      const distanceSquared = dx * dx + dy * dy
      if (distanceSquared < targetDistance * targetDistance) {
        const distance = Math.sqrt(distanceSquared) || 1
        const push = Math.min(2.4, (targetDistance - distance) * 0.12)
        enemy.x -= (dx / distance) * push
        enemy.y -= (dy / distance) * push
        other.x += (dx / distance) * push
        other.y += (dy / distance) * push
        separations += 1
        if (separations >= maxSeparations) break separationLoop
      }
    }
  }
}

function trimOldestInPlace(items, cap) {
  if (items.length <= cap) return
  const excess = items.length - cap
  for (let index = excess; index < items.length; index += 1) {
    items[index - excess] = items[index]
  }
  items.length = cap
}

function compactEnemies() {
  const enemies = state.enemies
  let writeIndex = 0
  for (let index = 0; index < enemies.length; index += 1) {
    const enemy = enemies[index]
    if (
      enemy.dead ||
      enemy.x <= -140 ||
      enemy.x >= width + 140 ||
      enemy.y <= -140 ||
      enemy.y >= height + 140
    ) {
      continue
    }
    enemies[writeIndex] = enemy
    writeIndex += 1
  }
  enemies.length = writeIndex
  trimOldestInPlace(enemies, getEntityCap('enemies'))
}

function updateBullets(dt) {
  const bullets = state.bullets
  const enemies = state.enemies
  let writeIndex = 0

  for (let bulletIndex = 0; bulletIndex < bullets.length; bulletIndex += 1) {
    const bullet = bullets[bulletIndex]
    bullet.previousX = bullet.x
    bullet.previousY = bullet.y
    bullet.x += bullet.vx * dt
    bullet.y += bullet.vy * dt
    bullet.life -= dt

    if (
      bullet.life <= 0 ||
      bullet.x <= -48 ||
      bullet.x >= width + 48 ||
      bullet.y <= -48 ||
      bullet.y >= height + 48
    ) {
      continue
    }

    for (let enemyIndex = 0; enemyIndex < enemies.length; enemyIndex += 1) {
      const enemy = enemies[enemyIndex]
      if (enemy.dead) continue
      const dx = bullet.x - enemy.x
      const dy = bullet.y - enemy.y
      const collisionDistance = bullet.radius + enemy.radius
      if (
        Math.abs(dx) > collisionDistance ||
        Math.abs(dy) > collisionDistance ||
        dx * dx + dy * dy > collisionDistance * collisionDistance
      ) {
        continue
      }

      enemy.health -= bullet.damage
      enemy.flash = 0.14
      bullet.life = 0
      createHitEffect(bullet.x, bullet.y, '#ffd077', bullet.surged ? 2 : 6)
      createFloatingText(
        Math.round(bullet.damage),
        enemy.x + (Math.random() - 0.5) * 8,
        enemy.y - enemy.radius,
        '#ffe1a1',
        0.58,
        10,
      )
      if (enemy.health <= 0) destroyEnemy(enemy)
      break
    }

    if (bullet.life > 0) {
      bullets[writeIndex] = bullet
      writeIndex += 1
    }
  }
  bullets.length = writeIndex
  trimOldestInPlace(bullets, getEntityCap('bullets'))

  // Dead targets are removed in the same frame they are killed, before render.
  compactEnemies()
}

function updatePickups(dt) {
  const player = state.player

  for (const pickup of state.pickups) {
    if (pickup.collected) continue
    const resource = resourceTypes[pickup.type]
    pickup.age += dt
    pickup.phase += dt * (pickup.type === 'reactor' ? 5 : 3.5)
    pickup.vx *= Math.pow(0.08, dt)
    pickup.vy *= Math.pow(0.08, dt)
    pickup.x += pickup.vx * dt
    pickup.y += pickup.vy * dt

    const dx = player.x - pickup.x
    const dy = player.y - pickup.y
    const distanceSquared = dx * dx + dy * dy
    const batteryUrgency =
      pickup.type === 'battery' && player.health < player.maxHealth * 0.55 ? 1.18 : 1
    const magnetRadius =
      resource.magnetRadius * player.magnetMultiplier * batteryUrgency
    if (distanceSquared < magnetRadius * magnetRadius) {
      const distance = Math.sqrt(distanceSquared) || 1
      const pull = (1 - distance / magnetRadius) * 1380 + 110
      pickup.x += (dx / distance) * pull * dt
      pickup.y += (dy / distance) * pull * dt
    }
    pickup.x = Math.max(14, Math.min(width - 14, pickup.x))
    pickup.y = Math.max(14, Math.min(height - 14, pickup.y))

    const collisionDistance = player.radius + pickup.radius + 5
    if (distanceSquared < collisionDistance * collisionDistance) {
      collectPickup(pickup)
      if (state.mode !== 'running') break
    }
  }

  const pickups = state.pickups
  let writeIndex = 0
  for (let index = 0; index < pickups.length; index += 1) {
    const pickup = pickups[index]
    const isEssential =
      pickup.type === 'battery' || pickup.type === 'reactor'
    const lifetime =
      reducedEffects && !isEssential ? 14 : PICKUP_LIFETIME
    if (!pickup.collected && pickup.age < lifetime) {
      pickups[writeIndex] = pickup
      writeIndex += 1
    }
  }
  pickups.length = writeIndex
  trimOldestInPlace(pickups, getEntityCap('pickups'))
}

function updateEffects(dt) {
  const particleDamping = Math.pow(0.07, dt)
  const particleDecay = dt * (reducedEffects ? 1.5 : 1)
  const particles = state.particles
  let particleWriteIndex = 0
  for (let index = 0; index < particles.length; index += 1) {
    const particle = particles[index]
    particle.x += particle.vx * dt
    particle.y += particle.vy * dt
    particle.vx *= particleDamping
    particle.vy *= particleDamping
    particle.life -= particleDecay
    if (particle.life > 0) {
      particles[particleWriteIndex] = particle
      particleWriteIndex += 1
    }
  }
  particles.length = particleWriteIndex
  const particleCap = getVisualEffectCap('particles')
  trimOldestInPlace(particles, particleCap)

  const rings = state.rings
  let ringWriteIndex = 0
  for (let index = 0; index < rings.length; index += 1) {
    const ring = rings[index]
    const decay = ring.kind === 'emp' ? dt : dt * (reducedEffects ? 1.35 : 1)
    ring.life -= decay
    const progress = Math.min(1, 1 - ring.life / ring.maxLife)
    ring.currentRadius = ring.radius + (ring.maxRadius - ring.radius) * progress
    if (ring.life > 0) {
      rings[ringWriteIndex] = ring
      ringWriteIndex += 1
    }
  }
  rings.length = ringWriteIndex
  const ringCap = getVisualEffectCap('rings')
  trimOldestInPlace(rings, ringCap)

  const textDamping = Math.pow(0.35, dt)
  const textDecay = dt * (reducedEffects ? 1.25 : 1)
  const floatingTexts = state.floatingTexts
  let textWriteIndex = 0
  for (let index = 0; index < floatingTexts.length; index += 1) {
    const text = floatingTexts[index]
    text.y += text.vy * dt
    text.vy *= textDamping
    text.life -= textDecay
    if (text.life > 0) {
      floatingTexts[textWriteIndex] = text
      textWriteIndex += 1
    }
  }
  floatingTexts.length = textWriteIndex
  const floatingTextCap = getVisualEffectCap('floatingTexts')
  trimOldestInPlace(floatingTexts, floatingTextCap)
  state.warningFlash = Math.max(0, state.warningFlash - dt * 1.8)
  state.shake = Math.max(0, state.shake - dt * 24)
}

function update(dt, wallDt = dt) {
  if (state.mode !== 'running') {
    updateEffects(wallDt)
    return
  }

  state.elapsed += dt
  updateMission(wallDt)
  if (state.mode !== 'running') return
  state.reactorSurge = Math.max(0, state.reactorSurge - wallDt)
  state.introClock -= dt
  if (state.introClock <= 0) ui.onboardingHint.classList.add('is-hidden')
  state.hudClock -= wallDt
  updatePlayer(dt)
  updateSpawning(dt)
  updateShooting(dt)
  updateEnemies(dt)
  if (state.mode !== 'running') return
  updateOrbitDrones(dt)
  updateEmp(dt)
  updateBullets(dt)
  updatePickups(dt)
  updateEffects(wallDt)

  if (state.hudClock <= 0) {
    updateHud()
    state.hudClock = 0.1
  }
}

function drawBackground() {
  ctx.drawImage(backgroundLayer, 0, 0, width, height)

  if (!reducedEffects) {
    for (const glow of ambientGlows) {
      const flicker = 0.55 + Math.sin(state.elapsed * 0.75 + glow.phase) * 0.3
      ctx.globalAlpha = flicker
      ctx.drawImage(
        glow.sprite,
        glow.x - glow.diameter / 2,
        glow.y - glow.diameter / 2,
        glow.diameter,
        glow.diameter,
      )
    }
  }
  ctx.globalAlpha = 1

  const dustStep = reducedEffects ? 2 : 1
  for (let i = 0; i < ambientDust.length; i += dustStep) {
    const dust = ambientDust[i]
    const dustX =
      (dust.x + state.elapsed * dust.speed + Math.sin(state.elapsed + dust.phase) * dust.drift) %
      width
    const dustY =
      (dust.y + state.elapsed * dust.speed * 0.34 + Math.cos(state.elapsed * 0.7 + dust.phase) * 5) %
      height
    ctx.globalAlpha = dust.opacity * (0.7 + Math.sin(state.elapsed * 1.2 + dust.phase) * 0.3)
    ctx.fillStyle = '#c9b98f'
    ctx.fillRect(dustX, dustY, dust.size * 2.2, dust.size)
  }
  ctx.globalAlpha = 1
  ctx.drawImage(vignetteLayer, 0, 0, width, height)
}

function drawPickup(pickup) {
  if (pickup.age > PICKUP_LIFETIME - 2 && Math.floor(pickup.age * 8) % 2 === 0) {
    return
  }
  const bob = Math.sin(pickup.phase) * 3
  if (reducedEffects) {
    drawSimplifiedPickup(pickup, bob)
    return
  }
  const pulseAmount = pickup.type === 'reactor' ? 0.16 : 0.1
  const pulse = 1 + Math.sin(pickup.phase * 1.6) * pulseAmount

  ctx.save()
  ctx.translate(pickup.x, pickup.y + bob)
  ctx.scale(pulse, pulse)

  if (pickup.type === 'gpu') drawGpuPickup(pickup)
  else if (pickup.type === 'battery') drawBatteryPickup(pickup)
  else if (pickup.type === 'scrap') drawScrapPickup(pickup)
  else if (pickup.type === 'reactor') drawReactorPickup(pickup)

  ctx.restore()
}

function drawSimplifiedPickup(pickup, bob) {
  ctx.save()
  ctx.translate(pickup.x, pickup.y + bob)
  ctx.fillStyle = resourceTypes[pickup.type].color
  ctx.strokeStyle =
    pickup.type === 'scrap' ? '#dce5e4' : 'rgba(220, 255, 255, 0.8)'
  ctx.lineWidth = 1

  if (pickup.type === 'reactor') {
    ctx.beginPath()
    ctx.arc(0, 0, 11, 0, TAU)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#ff5a36'
    ctx.beginPath()
    ctx.arc(0, 0, 4, 0, TAU)
    ctx.fill()
  } else {
    if (pickup.type === 'scrap') ctx.rotate(pickup.phase * 0.18)
    const halfWidth = pickup.type === 'battery' ? 7 : 8
    const halfHeight = pickup.type === 'battery' ? 10 : 7
    ctx.fillRect(-halfWidth, -halfHeight, halfWidth * 2, halfHeight * 2)
    ctx.strokeRect(-halfWidth, -halfHeight, halfWidth * 2, halfHeight * 2)
  }
  ctx.restore()
}

function drawPickupAura(color, radius, phase, beacon = true) {
  ctx.shadowColor = color
  ctx.shadowBlur = reducedEffects ? 0 : radius
  ctx.fillStyle = color
  ctx.globalAlpha = 0.16
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, TAU)
  ctx.fill()
  ctx.globalAlpha = 0.5
  ctx.strokeStyle = color
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(0, 0, radius * 0.72 + Math.sin(phase * 1.8) * 2, 0, TAU)
  ctx.stroke()

  if (beacon) {
    ctx.globalAlpha = 0.3
    ctx.fillRect(-1, -radius - 12, 2, 14)
  }
  ctx.globalAlpha = 1
}

function drawGpuPickup(pickup) {
  drawPickupAura('#63ff91', 23, pickup.phase)
  ctx.shadowColor = '#63ff91'
  ctx.shadowBlur = reducedEffects ? 0 : 10
  ctx.fillStyle = '#68f78e'
  ctx.fillRect(-8, -7, 16, 14)
  ctx.shadowBlur = 0
  ctx.fillStyle = '#133c29'
  ctx.fillRect(-4, -3, 8, 6)
  ctx.strokeStyle = '#b9ffc9'
  ctx.lineWidth = 1
  ctx.strokeRect(-8, -7, 16, 14)

  for (let i = -6; i <= 6; i += 4) {
    ctx.fillStyle = '#9dffb5'
    ctx.fillRect(i, -10, 2, 3)
    ctx.fillRect(i, 7, 2, 3)
  }
}

function drawBatteryPickup(pickup) {
  drawPickupAura('#58cfff', 24, pickup.phase)
  ctx.shadowColor = '#6ad7ff'
  ctx.shadowBlur = reducedEffects ? 0 : 13
  ctx.fillStyle = '#4ebdeb'
  ctx.fillRect(-8, -11, 16, 23)
  ctx.fillStyle = '#a8ebff'
  ctx.fillRect(-4, -14, 8, 3)
  ctx.shadowBlur = 0
  ctx.fillStyle = '#0a2f43'
  ctx.fillRect(-5, -8, 10, 17)
  ctx.fillStyle = '#7ddfff'
  ctx.fillRect(-3, 1, 6, 6)
  ctx.fillStyle = '#d8f7ff'
  ctx.fillRect(-1, -6, 2, 5)
  ctx.fillRect(-3, -4, 6, 2)
  ctx.strokeStyle = '#c6f3ff'
  ctx.lineWidth = 1
  ctx.strokeRect(-8, -11, 16, 23)
}

function drawScrapPickup(pickup) {
  ctx.save()
  ctx.rotate(pickup.phase * 0.18)
  ctx.shadowColor = '#f0a056'
  ctx.shadowBlur = reducedEffects ? 0 : 11
  ctx.fillStyle = 'rgba(226, 151, 73, 0.15)'
  ctx.beginPath()
  ctx.arc(0, 0, 17, 0, TAU)
  ctx.fill()
  ctx.fillStyle = '#8c9797'
  ctx.strokeStyle = '#f0a056'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(-11, -4)
  ctx.lineTo(-2, -11)
  ctx.lineTo(10, -7)
  ctx.lineTo(6, 1)
  ctx.lineTo(11, 8)
  ctx.lineTo(-4, 10)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.shadowBlur = 0
  ctx.strokeStyle = '#d5dddd'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(-5, -5)
  ctx.lineTo(4, 5)
  ctx.lineTo(8, 3)
  ctx.stroke()
  ctx.restore()
}

function drawReactorPickup(pickup) {
  drawPickupAura('#ff9e32', 30, pickup.phase)
  ctx.save()
  ctx.rotate(pickup.phase * 0.35)
  ctx.shadowColor = '#ff5a32'
  ctx.shadowBlur = reducedEffects ? 0 : 18
  ctx.fillStyle = '#671d17'
  ctx.strokeStyle = '#ffb13b'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(0, 0, 13, 0, TAU)
  ctx.fill()
  ctx.stroke()

  for (let i = 0; i < 3; i += 1) {
    ctx.rotate(TAU / 3)
    ctx.fillStyle = '#ff7435'
    ctx.beginPath()
    ctx.moveTo(3, -3)
    ctx.lineTo(11, -7)
    ctx.lineTo(10, 1)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()

  ctx.shadowColor = '#ffe16a'
  ctx.shadowBlur = reducedEffects ? 6 : 18
  ctx.fillStyle = '#ffe36b'
  ctx.beginPath()
  ctx.arc(0, 0, 5.5, 0, TAU)
  ctx.fill()
  ctx.shadowBlur = 0
  ctx.fillStyle = '#762018'
  ctx.beginPath()
  ctx.arc(0, 0, 2, 0, TAU)
  ctx.fill()
}

function drawEnemyHealthBar(enemy, healthRatio) {
  if (healthRatio >= 0.98 || healthRatio <= 0) return
  const barWidth = enemy.radius * 1.7
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)'
  ctx.fillRect(
    enemy.x - barWidth / 2,
    enemy.y - enemy.radius - 10,
    barWidth,
    3,
  )
  ctx.fillStyle = enemy.color
  ctx.fillRect(
    enemy.x - barWidth / 2,
    enemy.y - enemy.radius - 10,
    barWidth * healthRatio,
    3,
  )
}

function drawEnemy(enemy) {
  const healthRatio = Math.max(0, enemy.health / enemy.maxHealth)
  if (reducedEffects) {
    ctx.save()
    ctx.translate(enemy.x, enemy.y)
    ctx.rotate(enemy.angle)
    ctx.fillStyle = enemy.flash > 0 ? '#fff1d1' : '#251d1c'
    ctx.strokeStyle = enemy.flash > 0 ? '#fff3dc' : enemy.color
    ctx.lineWidth = 2
    if (enemy.type === 'reclaimer') {
      const radius = enemy.radius
      ctx.beginPath()
      ctx.moveTo(radius * 0.9, 0)
      ctx.lineTo(radius * 0.35, radius * 0.72)
      ctx.lineTo(-radius * 0.8, radius * 0.58)
      ctx.lineTo(-radius, 0)
      ctx.lineTo(-radius * 0.8, -radius * 0.58)
      ctx.lineTo(radius * 0.35, -radius * 0.72)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    } else if (enemy.type === 'scout') {
      ctx.beginPath()
      ctx.moveTo(13, 0)
      ctx.lineTo(-11, 9)
      ctx.lineTo(-11, -9)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    } else {
      const radius = enemy.radius
      ctx.fillRect(-radius * 0.7, -radius * 0.58, radius * 1.35, radius * 1.16)
      ctx.strokeRect(-radius * 0.7, -radius * 0.58, radius * 1.35, radius * 1.16)
    }
    ctx.fillStyle = '#ffcf70'
    ctx.fillRect(enemy.radius * 0.18, -2, enemy.radius * 0.5, 4)
    ctx.restore()
    drawEnemyHealthBar(enemy, healthRatio)
    return
  }

  ctx.save()
  ctx.translate(enemy.x, enemy.y)
  ctx.rotate(enemy.angle)

  ctx.shadowColor = enemy.color
  ctx.shadowBlur = enemy.flash > 0 ? (reducedEffects ? 8 : 22) : (reducedEffects ? 0 : 7)
  ctx.strokeStyle = enemy.flash > 0 ? '#fff3dc' : enemy.color
  ctx.fillStyle = enemy.flash > 0 ? '#fff1d1' : '#251d1c'
  ctx.lineWidth = 2

  if (enemy.type === 'reclaimer') {
    const radius = enemy.radius
    for (const side of [-1, 1]) {
      ctx.beginPath()
      ctx.moveTo(-radius * 0.35, side * radius * 0.48)
      ctx.lineTo(-radius * 0.72, side * radius * 0.9)
      ctx.lineTo(-radius * 0.98, side * radius * 0.72)
      ctx.stroke()
    }
    ctx.beginPath()
    ctx.moveTo(radius * 0.92, 0)
    ctx.lineTo(radius * 0.42, radius * 0.7)
    ctx.lineTo(-radius * 0.72, radius * 0.6)
    ctx.lineTo(-radius, radius * 0.2)
    ctx.lineTo(-radius, -radius * 0.2)
    ctx.lineTo(-radius * 0.72, -radius * 0.6)
    ctx.lineTo(radius * 0.42, -radius * 0.7)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#15191c'
    ctx.fillRect(-radius * 0.62, -radius * 0.38, radius * 0.5, radius * 0.76)
    ctx.strokeStyle = '#8c304c'
    ctx.strokeRect(-radius * 0.06, -radius * 0.56, radius * 0.42, radius * 1.12)
  } else if (enemy.type === 'scout') {
    for (const side of [-1, 1]) {
      ctx.beginPath()
      ctx.moveTo(-8, side * 7)
      ctx.lineTo(-17, side * (12 + Math.sin(enemy.phase) * 3))
      ctx.lineTo(-12, side * 17)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(5, side * 8)
      ctx.lineTo(14, side * (13 - Math.sin(enemy.phase) * 3))
      ctx.lineTo(11, side * 18)
      ctx.stroke()
    }
    ctx.beginPath()
    ctx.moveTo(13, 0)
    ctx.lineTo(5, 10)
    ctx.lineTo(-10, 8)
    ctx.lineTo(-13, 0)
    ctx.lineTo(-10, -8)
    ctx.lineTo(5, -10)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  } else {
    const radius = enemy.radius
    ctx.fillRect(-radius * 0.72, -radius * 0.62, radius * 1.4, radius * 1.24)
    ctx.strokeRect(-radius * 0.72, -radius * 0.62, radius * 1.4, radius * 1.24)
    ctx.fillStyle = '#121516'
    ctx.fillRect(-radius * 0.88, -radius * 0.86, radius * 0.42, radius * 0.42)
    ctx.fillRect(-radius * 0.88, radius * 0.44, radius * 0.42, radius * 0.42)
    ctx.fillRect(radius * 0.45, -radius * 0.86, radius * 0.42, radius * 0.42)
    ctx.fillRect(radius * 0.45, radius * 0.44, radius * 0.42, radius * 0.42)
    if (enemy.type === 'heavy') {
      ctx.strokeStyle = '#7e3931'
      ctx.strokeRect(-radius * 0.42, -radius * 0.88, radius * 0.82, radius * 1.76)
    }
  }

  ctx.fillStyle = '#ffcf70'
  ctx.shadowColor = '#ff8c43'
  ctx.shadowBlur = reducedEffects ? 0 : 12
  ctx.fillRect(enemy.radius * 0.18, -3, enemy.radius * 0.58, 6)
  ctx.shadowBlur = 0
  ctx.restore()

  drawEnemyHealthBar(enemy, healthRatio)
}

function drawBullets() {
  ctx.lineCap = 'round'
  ctx.lineWidth = width < 700 ? 4.5 : 3.6
  ctx.shadowBlur = 0
  for (const bullet of state.bullets) {
    const trailColor = bullet.surged ? '255, 205, 76' : '150, 250, 255'
    ctx.strokeStyle = `rgba(${trailColor}, 0.72)`
    ctx.beginPath()
    ctx.moveTo(bullet.previousX, bullet.previousY)
    ctx.lineTo(bullet.x, bullet.y)
    ctx.stroke()
  }

  ctx.shadowBlur = reducedEffects ? 0 : 14
  for (const bullet of state.bullets) {
    ctx.shadowColor = bullet.surged ? '#ffbd3d' : '#75f5ff'
    ctx.fillStyle = bullet.surged ? '#fff0a1' : '#d6fdff'
    ctx.beginPath()
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, TAU)
    ctx.fill()
  }
  ctx.shadowBlur = 0
}

function drawOrbitDrones() {
  const orbit = state.orbit
  if (!orbit.unlocked) return

  const surged = isReactorSurging()
  ctx.save()
  if (!reducedEffects) {
    ctx.globalAlpha = surged ? 0.24 : 0.14
    ctx.strokeStyle = surged ? '#b5fbff' : '#61dfe8'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(state.player.x, state.player.y, orbit.radius, 0, TAU)
    ctx.stroke()
  }

  ctx.globalAlpha = 1
  for (const drone of orbit.positions) {
    ctx.save()
    ctx.translate(drone.x, drone.y)
    ctx.rotate(drone.angle)
    ctx.shadowColor = '#6af2ff'
    ctx.shadowBlur = reducedEffects ? 0 : surged ? 15 : 9
    ctx.fillStyle = surged ? '#d9ffff' : '#8af8ff'
    ctx.fillRect(-6, -4, 12, 8)
    ctx.shadowBlur = 0
    ctx.fillStyle = '#173b45'
    ctx.fillRect(-3, -2, 6, 4)
    ctx.strokeStyle = surged ? '#d7ffff' : '#63dce8'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(-6, 0)
    ctx.lineTo(-11, 0)
    ctx.moveTo(6, 0)
    ctx.lineTo(11, 0)
    ctx.stroke()
    ctx.fillStyle = '#44bfd2'
    ctx.fillRect(-12, -3, 4, 6)
    ctx.fillRect(8, -3, 4, 6)
    ctx.restore()
  }
  ctx.restore()
}

function drawPlayer() {
  const player = state.player
  const surged = isReactorSurging()
  const tilt = player.moveX * 0.07
  const hitVisible = player.hitCooldown <= 0 || Math.floor(player.hitCooldown * 18) % 2 === 0
  if (!hitVisible) return

  ctx.save()
  ctx.translate(player.x, player.y)
  ctx.rotate(player.angle + tilt)

  if (player.shield > 0) {
    const shieldRatio = player.shield / player.maxShield
    ctx.globalAlpha = 0.22 + shieldRatio * 0.22
    ctx.strokeStyle = '#65d9ff'
    ctx.shadowColor = '#5acbff'
    ctx.shadowBlur = reducedEffects ? 0 : 14
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(0, 0, player.radius + 11 + Math.sin(state.elapsed * 4) * 1.5, 0, TAU)
    ctx.stroke()
  }

  if (surged) {
    ctx.globalAlpha = 0.4 + Math.sin(state.elapsed * 8) * 0.1
    ctx.strokeStyle = '#ffbf3e'
    ctx.shadowColor = '#ff8a34'
    ctx.shadowBlur = reducedEffects ? 8 : 24
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(0, 0, player.radius + 17, -0.6, 1.25)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(0, 0, player.radius + 17, 2.5, 4.35)
    ctx.stroke()
  }

  ctx.globalAlpha = surged ? 0.58 : 0.35
  ctx.fillStyle = surged ? '#ffe169' : '#65f5ff'
  ctx.shadowColor = surged ? '#ffad36' : '#5befff'
  ctx.shadowBlur = reducedEffects ? (surged ? 10 : 0) : surged ? 30 : 18
  ctx.beginPath()
  ctx.ellipse(-15, 0, 25, 10, 0, 0, TAU)
  ctx.fill()
  ctx.globalAlpha = 1
  ctx.shadowBlur = 0

  // Rotor arms and animated rotor discs.
  ctx.strokeStyle = '#709296'
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.moveTo(-10, -8)
  ctx.lineTo(-24, -17)
  ctx.moveTo(-10, 8)
  ctx.lineTo(-24, 17)
  ctx.stroke()

  for (const rotorY of [-18, 18]) {
    ctx.save()
    ctx.translate(-25, rotorY)
    ctx.rotate(player.rotorPhase * (rotorY > 0 ? 1 : -1))
    ctx.strokeStyle = 'rgba(118, 239, 246, 0.78)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(-13, 0)
    ctx.lineTo(13, 0)
    ctx.stroke()
    ctx.fillStyle = '#8df8ff'
    ctx.beginPath()
    ctx.arc(0, 0, 3, 0, TAU)
    ctx.fill()
    ctx.restore()
  }

  ctx.fillStyle = '#13282d'
  ctx.strokeStyle = '#6bcbd1'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(22, 0)
  ctx.lineTo(7, 14)
  ctx.lineTo(-14, 11)
  ctx.lineTo(-19, 0)
  ctx.lineTo(-14, -11)
  ctx.lineTo(7, -14)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  if (!reducedEffects) {
    ctx.globalAlpha = 0.24
    ctx.fillStyle = '#4c777c'
    ctx.beginPath()
    ctx.moveTo(18, -1)
    ctx.lineTo(5, -10)
    ctx.lineTo(-13, -8)
    ctx.lineTo(-17, -1)
    ctx.closePath()
    ctx.fill()
    ctx.globalAlpha = 1
  }

  ctx.shadowColor = '#69f5ff'
  ctx.shadowBlur = reducedEffects ? 0 : 15
  ctx.fillStyle = '#9dfaff'
  ctx.fillRect(1, -3, 17, 6)
  ctx.fillStyle = '#67e8f1'
  ctx.fillRect(-9, -7, 3, 14)
  ctx.shadowBlur = 0

  // Forward weapon barrel.
  ctx.fillStyle = '#8cb5b8'
  ctx.fillRect(14, -2, 15, 4)
  ctx.fillStyle = '#d0fdff'
  ctx.fillRect(26, -1, 5, 2)
  if (player.muzzleGlow > 0) {
    const glowStrength = player.muzzleGlow / 0.11
    ctx.globalAlpha = glowStrength
    ctx.shadowColor = surged ? '#ffca4f' : '#9bfbff'
    ctx.shadowBlur = reducedEffects ? 8 : 24
    ctx.fillStyle = surged ? '#fff1a3' : '#eaffff'
    ctx.beginPath()
    ctx.moveTo(30, 0)
    ctx.lineTo(43 + glowStrength * 7, -6)
    ctx.lineTo(43 + glowStrength * 7, 6)
    ctx.closePath()
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.shadowBlur = 0
  }
  ctx.restore()
}

function drawEffects() {
  for (const ring of state.rings) {
    ctx.globalAlpha = Math.max(0, ring.life / ring.maxLife)
    ctx.strokeStyle = ring.color
    ctx.lineWidth = ring.kind === 'emp' ? 3 : 2
    if (ring.kind === 'emp') {
      ctx.shadowColor = ring.color
      ctx.shadowBlur = reducedEffects ? 0 : ring.bright ? 16 : 9
    }
    ctx.beginPath()
    ctx.arc(ring.x, ring.y, ring.currentRadius || ring.radius, 0, TAU)
    ctx.stroke()
    ctx.shadowBlur = 0
  }
  ctx.globalAlpha = 1

  ctx.shadowBlur = reducedEffects ? 0 : 6
  for (const particle of state.particles) {
    const alpha = Math.max(0, particle.life / particle.maxLife)
    ctx.globalAlpha = alpha
    ctx.fillStyle = particle.color
    ctx.shadowColor = particle.color
    ctx.fillRect(
      particle.x - particle.size / 2,
      particle.y - particle.size / 2,
      particle.size,
      particle.size,
    )
  }
  ctx.globalAlpha = 1
  ctx.shadowBlur = 0

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (const text of state.floatingTexts) {
    const alpha = Math.min(1, text.life / Math.min(0.25, text.maxLife))
    ctx.globalAlpha = alpha
    ctx.fillStyle = text.color
    ctx.shadowColor = text.color
    ctx.shadowBlur = reducedEffects ? 0 : text.size > 11 ? 8 : 4
    ctx.font = `600 ${text.size}px ui-monospace, monospace`
    ctx.fillText(text.text, text.x, text.y)
  }
  ctx.globalAlpha = 1
  ctx.shadowBlur = 0
}

function drawSurgePulse() {
  if (!isReactorSurging()) return

  const pulse = (Math.sin(state.elapsed * 7.5) + 1) * 0.5
  ctx.save()
  ctx.globalAlpha = 0.025 + pulse * 0.018
  ctx.fillStyle = '#ff9e32'
  ctx.fillRect(0, 0, width, height)
  ctx.globalAlpha = 0.22 + pulse * 0.18
  ctx.strokeStyle = '#ffc34c'
  ctx.lineWidth = reducedEffects ? 1.5 : 2
  ctx.beginPath()
  ctx.arc(
    state.player.x,
    state.player.y,
    state.player.radius + 27 + pulse * 8,
    0,
    TAU,
  )
  ctx.stroke()
  ctx.restore()
}

function drawExtractionBeacon() {
  if (!state.mission.extractionActive) return
  const pulse = (Math.sin(state.elapsed * 4.5) + 1) * 0.5
  const radius = 72 + pulse * 10

  ctx.save()
  ctx.translate(state.player.x, state.player.y)
  ctx.globalAlpha = 0.24 + pulse * 0.2
  ctx.strokeStyle = '#78f3ca'
  ctx.shadowColor = '#59dbb5'
  ctx.shadowBlur = reducedEffects ? 0 : 10
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, TAU)
  ctx.stroke()
  ctx.shadowBlur = 0

  ctx.globalAlpha = 0.5 + pulse * 0.25
  for (let index = 0; index < 4; index += 1) {
    const angle = index * (TAU / 4)
    const inner = radius - 7
    const outer = radius + 7
    ctx.beginPath()
    ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner)
    ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer)
    ctx.stroke()
  }
  ctx.restore()
}

function drawExtractionBorder() {
  if (!state.mission.extractionActive) return
  const pulse = (Math.sin(state.elapsed * 3.5) + 1) * 0.5
  ctx.strokeStyle = `rgba(111, 244, 201, ${0.14 + pulse * 0.16})`
  ctx.lineWidth = 2
  ctx.strokeRect(5, 5, width - 10, height - 10)
}

function drawTouchControl() {
  if (!pointer.active) return
  const dx = pointer.x - pointer.originX
  const dy = pointer.y - pointer.originY
  const distance = Math.hypot(dx, dy)
  const maxDistance = 52
  const scale = distance > maxDistance ? maxDistance / distance : 1
  const knobX = pointer.originX + dx * scale
  const knobY = pointer.originY + dy * scale

  ctx.fillStyle = 'rgba(10, 22, 25, 0.45)'
  ctx.strokeStyle = 'rgba(105, 235, 242, 0.45)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(pointer.originX, pointer.originY, 48, 0, TAU)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = 'rgba(110, 243, 249, 0.28)'
  ctx.beginPath()
  ctx.arc(knobX, knobY, 19, 0, TAU)
  ctx.fill()
}

function render() {
  drawBackground()
  ctx.save()
  const shakeX = state.shake ? (Math.random() - 0.5) * state.shake : 0
  const shakeY = state.shake ? (Math.random() - 0.5) * state.shake : 0
  ctx.translate(shakeX, shakeY)
  state.pickups.forEach(drawPickup)
  state.enemies.forEach(drawEnemy)
  drawBullets()
  drawOrbitDrones()
  drawExtractionBeacon()
  drawPlayer()
  drawSurgePulse()
  drawEffects()
  drawTouchControl()
  ctx.restore()
  drawExtractionBorder()

  if (state.warningFlash > 0) {
    const alpha = state.warningFlash * 0.13
    ctx.fillStyle = `rgba(255, 139, 42, ${alpha})`
    ctx.fillRect(0, 0, width, height)
    ctx.strokeStyle = `rgba(255, 194, 67, ${state.warningFlash * 0.55})`
    ctx.lineWidth = 5
    ctx.strokeRect(3, 3, width - 6, height - 6)
  }
}

function gameLoop(now) {
  const rawDt = Math.max(0, (now - lastFrame) / 1000)
  lastFrame = now
  updatePerformanceReadout(rawDt)
  updateEffectBudget()
  // Simulation work is bounded after a slow frame. Spawners and EMP only get
  // one update, so a stall cannot release a catch-up burst.
  const dt = Math.min(rawDt, MAX_SIMULATION_DT)
  // Keep the ten-second surge honest even when a slow frame is clamped for
  // simulation stability. The upper bound avoids expiring it after tab switches.
  const wallDt = Math.min(rawDt, 0.2)
  update(dt, wallDt)
  render()
  requestAnimationFrame(gameLoop)
}

function pointerPosition(event) {
  const rect = canvas.getBoundingClientRect()
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}

window.addEventListener('keydown', (event) => {
  const movementKeys = [
    'KeyW',
    'KeyA',
    'KeyS',
    'KeyD',
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
  ]
  if (movementKeys.includes(event.code)) {
    event.preventDefault()
    keys.add(event.code)
  }
  if (
    event.code === 'Enter' &&
    (state.mode === 'summary' || state.mode === 'menu') &&
    !event.target.closest?.('button')
  ) {
    resetGame()
  }
  if (event.code === 'Escape' && state.mode === 'hangar') {
    showMainMenu()
  }
  if (event.code === 'KeyE') {
    event.preventDefault()
    callExtraction()
  }
  if (state.mode === 'levelup' && ['Digit1', 'Digit2', 'Digit3'].includes(event.code)) {
    const choice = state.levelUpChoices[Number(event.code.at(-1)) - 1]
    if (choice) chooseUpgrade(choice.id)
  }
})

window.addEventListener('keyup', (event) => {
  keys.delete(event.code)
})

window.addEventListener('blur', () => {
  keys.clear()
  pointer.active = false
})

document.addEventListener('visibilitychange', () => {
  // A background tab is not an in-game spike and should not poison the
  // smoothed diagnostics when animation resumes.
  lastFrame = performance.now()
  if (state) {
    state.fpsFrames = 0
    state.fpsTime = 0
  }
})

canvas.addEventListener('pointerdown', (event) => {
  if (state.mode !== 'running') return
  event.preventDefault()
  const position = pointerPosition(event)
  pointer.active = true
  pointer.id = event.pointerId
  pointer.originX = position.x
  pointer.originY = position.y
  pointer.x = position.x
  pointer.y = position.y
  canvas.setPointerCapture(event.pointerId)
})

canvas.addEventListener('pointermove', (event) => {
  if (!pointer.active || event.pointerId !== pointer.id) return
  event.preventDefault()
  const position = pointerPosition(event)
  pointer.x = position.x
  pointer.y = position.y
})

function releasePointer(event) {
  if (event.pointerId === pointer.id) {
    pointer.active = false
    pointer.id = null
  }
}

canvas.addEventListener('pointerup', releasePointer)
canvas.addEventListener('pointercancel', releasePointer)

ui.upgradeOptions.addEventListener('click', (event) => {
  const button = event.target.closest('[data-upgrade]')
  if (button) chooseUpgrade(button.dataset.upgrade)
})
ui.hangarUpgrades.addEventListener('click', (event) => {
  const button = event.target.closest('[data-hangar-upgrade]')
  if (button) purchaseHangarUpgrade(button.dataset.hangarUpgrade)
})
ui.menuStartButton.addEventListener('click', resetGame)
ui.menuHangarButton.addEventListener('click', showHangar)
ui.resetSaveButton.addEventListener('click', handleResetSave)
ui.hangarBackButton.addEventListener('click', showMainMenu)
ui.hangarStartButton.addEventListener('click', resetGame)
ui.summaryHangarButton.addEventListener('click', showHangar)
ui.summaryRestartButton.addEventListener('click', resetGame)
ui.extractionButton.addEventListener('click', callExtraction)

const resizeObserver = new ResizeObserver(resizeCanvas)
resizeObserver.observe(canvas)
resizeCanvas()
showMainMenu()
requestAnimationFrame(gameLoop)
