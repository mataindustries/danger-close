import './style.css'

const app = document.querySelector('#app')

app.innerHTML = `
  <section class="game-shell" aria-label="Danger Close game">
    <header class="topbar">
      <div class="brand">
        <span class="brand-mark" aria-hidden="true"></span>
        <div>
          <h1>Danger Close</h1>
          <p id="brand-sector">Dead Zone // Rust Basin</p>
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

      <div id="boss-health" class="boss-health" hidden aria-live="polite">
        <div>
          <span>Priority threat</span>
          <strong>Harvester Titan</strong>
          <b id="boss-health-text">1450 / 1450</b>
        </div>
        <div class="boss-health-track"><i id="boss-health-bar"></i></div>
      </div>

      <div id="boss-warning" class="boss-warning" hidden role="status">
        Harvester Titan detected
      </div>

      <div id="mission-panel" class="mission-panel" aria-live="polite">
        <div class="mission-heading">
          <span>Mission // <b id="hud-sector-name">Rust Basin</b></span>
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
        <span id="performance-values">FPS -- · EN 0 · OBS 0 · BLT 0 · BP 0 · MN 0 · BX 0 · PCK 0 · PRT 0 · TXT 0 · FX 0 · VIS 0/0 · Q FULL · FT --MS</span>
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
          <span class="modal-kicker">Salvage command // Dead zone network</span>
          <h2 id="menu-title">Danger Close</h2>
          <p>Deploy. Recover dead-zone hardware. Extract before the swarm closes in.</p>
          <div class="profile-wallet" aria-label="Saved resources">
            <div><span>Saved scrap</span><strong id="menu-scrap">0</strong></div>
            <div><span>GPU fragments</span><strong id="menu-gpu">0</strong></div>
            <div><span>Reactor fragments</span><strong id="menu-reactor">0</strong></div>
          </div>
          <div class="screen-actions">
            <button id="menu-start-button" class="primary-action" type="button">Select Sector / Start Mission</button>
            <button id="menu-hangar-button" class="secondary-action" type="button">Hangar upgrades</button>
            <button id="reset-save-button" class="danger-action" type="button">Reset save</button>
          </div>
          <p id="reset-save-status" class="screen-status" aria-live="polite"></p>
        </div>
      </div>

      <div id="sector-select" class="modal-overlay front-screen" hidden>
        <div class="modal-panel sector-panel" role="dialog" aria-modal="true" aria-labelledby="sector-title">
          <div class="sector-heading">
            <div>
              <span class="modal-kicker">Mission routing // Dead zones</span>
              <h2 id="sector-title">Select sector</h2>
              <p>Choose the salvage conditions for this deployment.</p>
            </div>
            <button id="sector-back-button" class="secondary-action" type="button">Back</button>
          </div>
          <div id="sector-options" class="sector-grid" role="list"></div>
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
            <button id="hangar-start-button" class="primary-action" type="button">Select sector</button>
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
          <div class="mission-outcome-summary">
            <div>
              <span>Sector</span>
              <strong id="summary-sector">Rust Basin</strong>
            </div>
            <div>
              <span>Result</span>
              <strong id="summary-result">Extracted</strong>
            </div>
            <div>
              <span>Harvester Titan</span>
              <strong id="summary-titan">Avoided</strong>
              <small id="summary-titan-bonus" hidden>Titan destroyed bonus</small>
            </div>
          </div>
          <p id="summary-sector-bonus" class="sector-summary-bonus" hidden></p>
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
              Select next sector
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
  brandSector: document.querySelector('#brand-sector'),
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
  hudSectorName: document.querySelector('#hud-sector-name'),
  missionCopy: document.querySelector('#mission-copy'),
  missionProgress: document.querySelector('#mission-progress-bar'),
  missionSalvage: document.querySelector('#mission-salvage'),
  extractionButton: document.querySelector('#extraction-button'),
  extractionCountdown: document.querySelector('#extraction-countdown'),
  bossHealth: document.querySelector('#boss-health'),
  bossHealthText: document.querySelector('#boss-health-text'),
  bossHealthBar: document.querySelector('#boss-health-bar'),
  bossWarning: document.querySelector('#boss-warning'),
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
  sectorSelect: document.querySelector('#sector-select'),
  sectorOptions: document.querySelector('#sector-options'),
  sectorBackButton: document.querySelector('#sector-back-button'),
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
  summarySector: document.querySelector('#summary-sector'),
  summaryResult: document.querySelector('#summary-result'),
  summarySectorBonus: document.querySelector('#summary-sector-bonus'),
  summaryTitan: document.querySelector('#summary-titan'),
  summaryTitanBonus: document.querySelector('#summary-titan-bonus'),
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
let sectorArcs = []
const backgroundLayer = document.createElement('canvas')
const vignetteLayer = document.createElement('canvas')
let reducedEffects = false
let resetSaveArmed = false

const MOBILE_CAPS = {
  enemies: 64,
  heavyEnemies: 7,
  reclaimers: 1,
  bullets: 90,
  bossProjectiles: 24,
  bossMines: 8,
  bossEffects: 18,
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
    bossProjectiles: 18,
    bossMines: 6,
    bossEffects: 12,
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
  bossProjectiles: 36,
  bossMines: 12,
  bossEffects: 28,
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
    bossProjectiles: 26,
    bossMines: 8,
    bossEffects: 18,
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
const REDUCED_EFFECTS_RECOVERY_SECONDS = 2.8
const SAVE_KEY = 'danger-close-save-v1'
const SAVE_VERSION = 1
const MAX_UPGRADE_RANK = 5
const MISSION_SALVAGE_REQUIRED = 220
const EXTRACTION_DURATION = 60
const TITAN_SPAWN_DELAY = 2.25
const TITAN_MAX_HEALTH = 1450
const TITAN_REWARD = {
  scrap: 30,
  gpu: 6,
  reactor: 1,
}
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
const MAX_OBSTACLES = 12
let entityCaps = DESKTOP_CAPS

const sectors = [
  {
    id: 'rust-basin',
    code: 'RB-01',
    name: 'Rust Basin',
    difficulty: 'Balanced',
    description:
      'A cracked industrial salvage field with predictable swarm pressure.',
    modifiers: [
      'Destructible scrap barricades',
      'Standard enemy pressure',
      'Balanced salvage drops',
      '220 salvage extraction target',
      'Standard recovery rewards',
    ],
    gameplay: {
      missionRequirementMultiplier: 1,
      spawnIntervalMultiplier: 1,
      enemyCapBonus: 0,
      scoutChanceMultiplier: 1,
      heavyChanceMultiplier: 1,
      startingShieldBonus: 0,
      surgeDurationBonus: 0,
      dropMultipliers: {},
      rewardBonus: { scrap: 0, gpu: 0, reactor: 0 },
    },
    obstacles: {
      type: 'scrap-barricade',
      minCount: 6,
      maxCount: 9,
    },
    visual: {
      seed: 7307,
      center: '#1c211e',
      middle: '#121817',
      edge: '#090c0c',
      gridRgb: '113, 112, 89',
      markRgb: '178, 132, 83',
      debrisRgb: '130, 104, 75',
      dustColor: '#c7a675',
      glowRgb: '177, 105, 57',
      effect: 'rust',
      accent: '#d88a4b',
    },
  },
  {
    id: 'battery-graveyard',
    code: 'BG-04',
    name: 'Battery Graveyard',
    difficulty: 'Charged',
    description:
      'An abandoned EV storage field lit by unstable cells and blue discharge.',
    modifiers: [
      'Unstable battery pylons',
      'EV battery drops increased',
      '+5 starting shield',
      'Scout bots appear more often',
      '238 salvage extraction target',
      '+12 SCR on successful extraction',
    ],
    gameplay: {
      missionRequirementMultiplier: 1.08,
      spawnIntervalMultiplier: 1,
      enemyCapBonus: 0,
      scoutChanceMultiplier: 1.28,
      heavyChanceMultiplier: 1,
      startingShieldBonus: 5,
      surgeDurationBonus: 0,
      dropMultipliers: { battery: 2.2 },
      rewardBonus: { scrap: 12, gpu: 0, reactor: 0 },
    },
    obstacles: {
      type: 'battery-pylon',
      minCount: 7,
      maxCount: 10,
    },
    visual: {
      seed: 12457,
      center: '#132a33',
      middle: '#0d1b22',
      edge: '#070d11',
      gridRgb: '74, 139, 166',
      markRgb: '95, 142, 158',
      debrisRgb: '73, 111, 126',
      dustColor: '#8ab9c8',
      glowRgb: '53, 167, 218',
      effect: 'electric',
      accent: '#55c8ff',
    },
  },
  {
    id: 'reactor-dead-zone',
    code: 'RD-09',
    name: 'Reactor Dead Zone',
    difficulty: 'Hazardous',
    description:
      'A poisoned power sector where unstable cores feed an aggressive swarm.',
    modifiers: [
      'Volatile reactor vents',
      'Reactor core drops increased',
      'Reactor Surge lasts +2 seconds',
      'Enemy pressure increased',
      '211 salvage extraction target',
      '+1 RCT on successful extraction',
    ],
    gameplay: {
      missionRequirementMultiplier: 0.96,
      spawnIntervalMultiplier: 0.91,
      enemyCapBonus: 3,
      scoutChanceMultiplier: 1,
      heavyChanceMultiplier: 1.08,
      startingShieldBonus: 0,
      surgeDurationBonus: 2,
      dropMultipliers: { reactor: 2.1 },
      rewardBonus: { scrap: 0, gpu: 0, reactor: 1 },
    },
    obstacles: {
      type: 'reactor-vent',
      minCount: 8,
      maxCount: 11,
    },
    visual: {
      seed: 20873,
      center: '#292716',
      middle: '#19170f',
      edge: '#0e0b09',
      gridRgb: '151, 129, 62',
      markRgb: '170, 105, 57',
      debrisRgb: '126, 83, 47',
      dustColor: '#c8b55d',
      glowRgb: '197, 117, 38',
      effect: 'radiation',
      accent: '#d7c64e',
    },
  },
  {
    id: 'dead-datacenter',
    code: 'DC-13',
    name: 'Dead Datacenter',
    difficulty: 'Medium / High',
    description:
      'An abandoned compute vault packed with dead server racks, fried GPUs, and rogue security bots.',
    modifiers: [
      'More GPUs',
      'More scouts',
      'GPU reward bonus',
      'Server rack obstacles',
    ],
    gameplay: {
      missionRequirementMultiplier: 1.12,
      spawnIntervalMultiplier: 1,
      enemyCapBonus: 0,
      scoutChanceMultiplier: 1.32,
      heavyChanceMultiplier: 0.86,
      startingShieldBonus: 0,
      surgeDurationBonus: 0,
      dropMultipliers: {
        gpu: 1.75,
        scrap: 0.84,
        battery: 0.86,
        reactor: 0.92,
      },
      rewardBonus: { scrap: 0, gpu: 3, reactor: 0 },
    },
    obstacles: {
      type: 'server-rack',
      minCount: 6,
      maxCount: 9,
      layout: 'rows',
      startClearance: 82,
    },
    visual: {
      seed: 31991,
      center: '#101c22',
      middle: '#091116',
      edge: '#04080b',
      gridRgb: '43, 103, 123',
      markRgb: '47, 91, 108',
      debrisRgb: '53, 86, 98',
      dustColor: '#7898a1',
      glowRgb: '28, 125, 156',
      effect: 'datacenter',
      accent: '#52c9e8',
      gridSize: 42,
    },
  },
]

const sectorsById = Object.fromEntries(
  sectors.map((sector) => [sector.id, sector]),
)
let selectedSectorId = sectors[0].id

function getSector(sectorId = state?.sectorId || selectedSectorId) {
  return sectorsById[sectorId] || sectors[0]
}

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

const obstacleTypes = {
  'scrap-barricade': {
    health: 105,
    minRadius: 25,
    maxRadius: 31,
    label: 'SCRAP BREACH',
    effectColor: '#e48a43',
  },
  'battery-pylon': {
    health: 82,
    minRadius: 22,
    maxRadius: 27,
    label: 'BATTERY DISCHARGE',
    effectColor: '#55cfff',
    burstRadius: 108,
    burstDamage: 46,
  },
  'reactor-vent': {
    health: 138,
    minRadius: 25,
    maxRadius: 30,
    label: 'REACTOR VENT',
    effectColor: '#f2be3f',
    burstRadius: 126,
    burstDamage: 62,
  },
  'server-rack': {
    health: 112,
    minRadius: 24,
    maxRadius: 29,
    label: 'CACHE BREACHED',
    effectColor: '#54cbe8',
    burstRadius: 102,
    burstDamage: 34,
    salvageDropChance: 0.72,
    gpuDropChance: 0.69,
    gpuCacheChance: 0.1,
    bossProjectileDamage: 24,
  },
}

function createInitialState() {
  const permanent = getPermanentBonuses()
  const sector = getSector(selectedSectorId)
  const startingShield = Math.min(
    30,
    permanent.startingShield + sector.gameplay.startingShieldBonus,
  )
  return {
    mode: 'running',
    sectorId: sector.id,
    elapsed: 0,
    obstacleSeed:
      (sector.visual.seed ^
        (Date.now() & 0x7fffffff) ^
        Math.floor(Math.random() * 0x7fffffff)) >>> 0,
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
    reactorSurgeDuration:
      permanent.surgeDuration + sector.gameplay.surgeDurationBonus,
    reactorEnemyCap: 0,
    warningFlash: 0,
    fps: 60,
    fpsFrames: 0,
    fpsTime: 0,
    frameMs: 16.7,
    diagnosticsClock: 0,
    spikeTimer: 0,
    effectsRecoveryClock: 0,
    effectsModeTransitions: 0,
    spawnBacklog: 0,
    mission: {
      salvage: 0,
      required: Math.round(
        MISSION_SALVAGE_REQUIRED *
          sector.gameplay.missionRequirementMultiplier,
      ),
      ready: false,
      extractionActive: false,
      extractionTime: EXTRACTION_DURATION,
      extractionDuration: EXTRACTION_DURATION,
    },
    titan: {
      status: 'idle',
      spawnTimer: TITAN_SPAWN_DELAY,
      warningTime: 0,
      boss: null,
    },
    kills: 0,
    nextEntityId: 1,
    player: {
      x: width / 2,
      y: height / 2,
      radius: 19,
      health: permanent.maxHealth,
      maxHealth: permanent.maxHealth,
      shield: startingShield,
      maxShield: 30,
      shieldDecayDelay: startingShield > 0 ? 18 : 0,
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
    obstacles: [],
    enemies: [],
    bullets: [],
    bossProjectiles: [],
    bossMines: [],
    bossEffects: [],
    pickups: [],
    particles: [],
    rings: [],
    floatingTexts: [],
  }
}

function nextObstacleRandom() {
  state.obstacleSeed =
    (Math.imul(state.obstacleSeed || 1, 1664525) + 1013904223) >>> 0
  return state.obstacleSeed / 4294967296
}

function isCircleBlockedByObstacle(x, y, radius, padding = 0) {
  for (const obstacle of state.obstacles) {
    if (obstacle.dead) continue
    const dx = x - obstacle.x
    const dy = y - obstacle.y
    const collisionDistance = radius + obstacle.radius + padding
    if (dx * dx + dy * dy < collisionDistance * collisionDistance) {
      return true
    }
  }
  return false
}

function generateSectorObstacles() {
  state.obstacles.length = 0
  const sectorConfig = getSector().obstacles
  const typeConfig = obstacleTypes[sectorConfig.type]
  const rowLayout = sectorConfig.layout === 'rows'
  const areaFactor = Math.max(
    0,
    Math.min(1, (width * height - 115200) / 500000),
  )
  const arenaObstacleLimit =
    width <= 340 && height <= 420 ? 6 : MAX_OBSTACLES
  const desiredCount = Math.min(
    arenaObstacleLimit,
    Math.round(
      sectorConfig.minCount +
        (sectorConfig.maxCount - sectorConfig.minCount) * areaFactor,
    ),
  )
  const centerX = width * 0.5
  const centerY = height * 0.5
  const compactArena = Math.min(width, height) < 520
  const centerClearance = Math.max(
    compactArena ? 55 : 108,
    sectorConfig.startClearance || 0,
  )
  const corridorHalfWidth = compactArena ? 32 : 42
  const verticalCorridor = nextObstacleRandom() < 0.5
  const maxAttempts = desiredCount * 80

  for (
    let attempt = 0;
    attempt < maxAttempts && state.obstacles.length < desiredCount;
    attempt += 1
  ) {
    const radius =
      typeConfig.minRadius +
      nextObstacleRandom() * (typeConfig.maxRadius - typeConfig.minRadius)
    const margin = radius + state.player.radius * 2 + 10
    let x = margin + nextObstacleRandom() * Math.max(1, width - margin * 2)
    let y = margin + nextObstacleRandom() * Math.max(1, height - margin * 2)
    if (rowLayout) {
      const rowCount = compactArena ? 2 : 4
      const row = Math.floor(nextObstacleRandom() * rowCount)
      const rowFraction =
        rowCount === 2 ? (row === 0 ? 0.08 : 0.92) : 0.1 + (row / 3) * 0.8
      if (verticalCorridor) {
        x =
          margin +
          rowFraction * Math.max(1, width - margin * 2) +
          (nextObstacleRandom() - 0.5) * 8
      } else {
        y =
          margin +
          rowFraction * Math.max(1, height - margin * 2) +
          (nextObstacleRandom() - 0.5) * 8
      }
    }
    const centerDx = x - centerX
    const centerDy = y - centerY
    const centerDistance = centerClearance + radius

    if (
      centerDx * centerDx + centerDy * centerDy <
      centerDistance * centerDistance
    ) {
      continue
    }
    if (
      verticalCorridor
        ? Math.abs(centerDx) < corridorHalfWidth + radius
        : Math.abs(centerDy) < corridorHalfWidth + radius
    ) {
      continue
    }

    const spacing =
      attempt < maxAttempts * 0.7
        ? compactArena
          ? 14
          : 20
        : 8
    if (isCircleBlockedByObstacle(x, y, radius, spacing)) continue

    state.obstacles.push({
      id: state.nextEntityId++,
      type: sectorConfig.type,
      x,
      y,
      vx: 0,
      vy: 0,
      radius,
      health: typeConfig.health,
      maxHealth: typeConfig.health,
      rotation: rowLayout
        ? (verticalCorridor ? 0 : Math.PI / 2) +
          (nextObstacleRandom() - 0.5) * 0.08
        : nextObstacleRandom() * TAU,
      phase: nextObstacleRandom() * TAU,
      detail: nextObstacleRandom(),
      flash: 0,
      orbitCooldown: 0,
      dead: false,
    })
  }

  if (state.obstacles.length < 6) {
    state.obstacles.length = 0
    const radius = typeConfig.minRadius
    const margin = radius + state.player.radius * 2 + 10
    const crossPositions = verticalCorridor
      ? [
          [margin, margin],
          [margin, centerY],
          [margin, height - margin],
          [width - margin, margin],
          [width - margin, centerY],
          [width - margin, height - margin],
        ]
      : [
          [margin, margin],
          [centerX, margin],
          [width - margin, margin],
          [margin, height - margin],
          [centerX, height - margin],
          [width - margin, height - margin],
        ]

    for (const [x, y] of crossPositions) {
      if (rowLayout) {
        const dx = x - centerX
        const dy = y - centerY
        const startClearDistance = centerClearance + radius
        if (dx * dx + dy * dy < startClearDistance * startClearDistance) {
          continue
        }
      }
      state.obstacles.push({
        id: state.nextEntityId++,
        type: sectorConfig.type,
        x,
        y,
        vx: 0,
        vy: 0,
        radius,
        health: typeConfig.health,
        maxHealth: typeConfig.health,
        rotation: rowLayout
          ? verticalCorridor
            ? 0
            : Math.PI / 2
          : nextObstacleRandom() * TAU,
        phase: nextObstacleRandom() * TAU,
        detail: nextObstacleRandom(),
        flash: 0,
        orbitCooldown: 0,
        dead: false,
      })
    }
  }
}

function resolveCircleAgainstObstacles(
  entity,
  radius,
  slideDistance = 0,
  slideDirection = 1,
) {
  let collided = false
  let appliedSlide = false

  for (let pass = 0; pass < 2; pass += 1) {
    let resolvedThisPass = false
    for (const obstacle of state.obstacles) {
      if (obstacle.dead) continue
      let dx = entity.x - obstacle.x
      let dy = entity.y - obstacle.y
      const collisionDistance = radius + obstacle.radius
      const distanceSquared = dx * dx + dy * dy
      if (distanceSquared >= collisionDistance * collisionDistance) continue

      let distance = Math.sqrt(distanceSquared)
      if (distance < 0.001) {
        const fallbackAngle = obstacle.rotation + Math.PI
        dx = Math.cos(fallbackAngle)
        dy = Math.sin(fallbackAngle)
        distance = 1
      }
      const normalX = dx / distance
      const normalY = dy / distance
      entity.x = obstacle.x + normalX * (collisionDistance + 0.2)
      entity.y = obstacle.y + normalY * (collisionDistance + 0.2)

      if (slideDistance > 0 && !appliedSlide) {
        entity.x += -normalY * slideDistance * slideDirection
        entity.y += normalX * slideDistance * slideDirection
        appliedSlide = true
      }
      collided = true
      resolvedThisPass = true
    }
    if (!resolvedThisPass) break
  }
  return collided
}

function segmentCircleHitTime(
  startX,
  startY,
  endX,
  endY,
  centerX,
  centerY,
  radius,
) {
  if (
    centerX + radius < Math.min(startX, endX) ||
    centerX - radius > Math.max(startX, endX) ||
    centerY + radius < Math.min(startY, endY) ||
    centerY - radius > Math.max(startY, endY)
  ) {
    return Infinity
  }

  const segmentX = endX - startX
  const segmentY = endY - startY
  const offsetX = startX - centerX
  const offsetY = startY - centerY
  const startDistanceSquared = offsetX * offsetX + offsetY * offsetY
  if (startDistanceSquared <= radius * radius) return 0

  const a = segmentX * segmentX + segmentY * segmentY
  if (a <= 0.000001) return Infinity
  const b = 2 * (offsetX * segmentX + offsetY * segmentY)
  const c = startDistanceSquared - radius * radius
  const discriminant = b * b - 4 * a * c
  if (discriminant < 0) return Infinity
  const hitTime = (-b - Math.sqrt(discriminant)) / (2 * a)
  return hitTime >= 0 && hitTime <= 1 ? hitTime : Infinity
}

function damageEnemiesInObstacleBurst(obstacle, radius, damage) {
  const radiusSquared = radius * radius
  for (const enemy of state.enemies) {
    if (enemy.dead) continue
    const dx = enemy.x - obstacle.x
    const dy = enemy.y - obstacle.y
    if (dx * dx + dy * dy > radiusSquared) continue
    enemy.health -= damage
    enemy.flash = 0.2
    if (enemy.health <= 0) destroyEnemy(enemy, true)
  }

  const boss =
    state.titan.status === 'active' ? state.titan.boss : null
  if (boss && !boss.dead) {
    const dx = boss.x - obstacle.x
    const dy = boss.y - obstacle.y
    const hitDistance = radius + boss.radius * 0.45
    if (dx * dx + dy * dy <= hitDistance * hitDistance) {
      applyTitanDamage(damage * 0.55)
    }
  }
}

function destroyObstacle(obstacle) {
  if (obstacle.dead) return
  obstacle.dead = true
  obstacle.health = 0
  if (state.targetId === obstacle.id) state.targetId = null

  const config = obstacleTypes[obstacle.type]
  const particleCount = reducedEffects ? 5 : 10
  createHitEffect(
    obstacle.x,
    obstacle.y,
    config.effectColor,
    particleCount,
  )
  addRing({
    kind: 'obstacle-burst',
    x: obstacle.x,
    y: obstacle.y,
    radius: obstacle.radius * 0.55,
    maxRadius:
      obstacle.type === 'scrap-barricade'
        ? obstacle.radius * 2.2
        : config.burstRadius,
    life: obstacle.type === 'scrap-barricade' ? 0.36 : 0.5,
    maxLife: obstacle.type === 'scrap-barricade' ? 0.36 : 0.5,
    color: config.effectColor,
  }, true)
  createFloatingText(
    config.label,
    obstacle.x,
    obstacle.y - obstacle.radius - 8,
    config.effectColor,
    1.1,
    width < 520 ? 11 : 13,
    true,
  )

  if (obstacle.type === 'scrap-barricade') {
    createHitEffect(obstacle.x, obstacle.y, '#bac3c1', reducedEffects ? 3 : 7)
    spawnResourcePickup('scrap', obstacle)
  } else if (obstacle.type === 'battery-pylon') {
    damageEnemiesInObstacleBurst(
      obstacle,
      config.burstRadius,
      config.burstDamage,
    )
    if (Math.random() < 0.24) spawnResourcePickup('battery', obstacle)
  } else if (obstacle.type === 'reactor-vent') {
    damageEnemiesInObstacleBurst(
      obstacle,
      config.burstRadius,
      config.burstDamage,
    )
    const playerDx = state.player.x - obstacle.x
    const playerDy = state.player.y - obstacle.y
    if (playerDx * playerDx + playerDy * playerDy <= 72 * 72) {
      applyPlayerDamage(4)
      state.player.health = Math.max(1, state.player.health)
      state.player.hitCooldown = Math.max(state.player.hitCooldown, 0.24)
      state.warningFlash = Math.max(state.warningFlash, 0.38)
      updateHud()
    }
    if (Math.random() < 0.2) spawnResourcePickup('reactor', obstacle)
  } else if (obstacle.type === 'server-rack') {
    damageEnemiesInObstacleBurst(
      obstacle,
      config.burstRadius,
      config.burstDamage,
    )
    if (Math.random() < config.salvageDropChance) {
      const salvageType =
        Math.random() < config.gpuDropChance ? 'gpu' : 'scrap'
      spawnResourcePickup(salvageType, obstacle)
    }
    if (Math.random() < config.gpuCacheChance) {
      spawnResourcePickup('gpu', obstacle)
    }
  }
  state.shake = Math.min(13, state.shake + 2.5)
}

function applyObstacleDamage(obstacle, damage) {
  if (!obstacle || obstacle.dead || damage <= 0) return false
  obstacle.health -= damage
  obstacle.flash = 0.14
  if (obstacle.health <= 0) destroyObstacle(obstacle)
  return true
}

function compactObstacles() {
  const obstacles = state.obstacles
  let writeIndex = 0
  for (let index = 0; index < obstacles.length; index += 1) {
    const obstacle = obstacles[index]
    if (obstacle.dead) continue
    obstacles[writeIndex] = obstacle
    writeIndex += 1
  }
  obstacles.length = writeIndex
}

function hideFrontScreens() {
  ui.mainMenu.hidden = true
  ui.sectorSelect.hidden = true
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
  reducedEffects = false
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

function renderSectorSelect() {
  ui.sectorOptions.innerHTML = sectors
    .map((sector) => {
      const selected = sector.id === selectedSectorId
      return `
        <article
          class="sector-card${selected ? ' is-selected' : ''}"
          data-sector="${sector.id}"
          role="listitem"
          aria-label="${sector.name}, ${sector.difficulty}"
        >
          <div class="sector-card-visual" aria-hidden="true">
            <span>${sector.code}</span>
            <i></i>
          </div>
          <div class="sector-card-heading">
            <div>
              <span>${selected ? 'Selected route' : 'Available route'}</span>
              <h3>${sector.name}</h3>
            </div>
            <b>${sector.difficulty}</b>
          </div>
          <p>${sector.description}</p>
          <ul>
            ${sector.modifiers.map((modifier) => `<li>${modifier}</li>`).join('')}
          </ul>
          <button
            class="primary-action sector-start-button"
            type="button"
            data-start-sector="${sector.id}"
          >
            Start mission
          </button>
        </article>
      `
    })
    .join('')
}

function showSectorSelect() {
  state = createInitialState()
  state.mode = 'sector'
  reducedEffects = false
  hideFrontScreens()
  ui.levelUp.hidden = true
  ui.sectorSelect.hidden = false
  ui.onboardingHint.classList.add('is-hidden')
  pointer.active = false
  keys.clear()
  renderSectorSelect()
  createBackgroundMarks()
  updateHud()
  lastFrame = performance.now()
}

function startMission(sectorId) {
  if (!sectorsById[sectorId]) return
  selectedSectorId = sectorId
  resetGame()
}

function previewSector(sectorId) {
  if (!sectorsById[sectorId] || state.mode !== 'sector') return
  selectedSectorId = sectorId
  state.sectorId = sectorId
  renderSectorSelect()
  createBackgroundMarks()
  updateHud()
}

function showHangar() {
  state = createInitialState()
  state.mode = 'hangar'
  reducedEffects = false
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
    'FPS -- · EN 0 · OBS 0 · BLT 0 · BP 0 · MN 0 · BX 0 · PCK 0 · PRT 0 · TXT 0 · FX 0 · VIS 0/0 · Q FULL · FT --MS'
  ui.spikeIndicator.hidden = true
  ui.weaponConfirmation.textContent = ''
  ui.weaponConfirmation.classList.remove('is-visible')
  pointer.active = false
  keys.clear()
  reducedEffects = false
  createBackgroundMarks()
  generateSectorObstacles()
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
    for (const obstacle of state.obstacles) {
      obstacle.x = Math.max(
        obstacle.radius + state.player.radius * 2 + 10,
        Math.min(
          width - obstacle.radius - state.player.radius * 2 - 10,
          obstacle.x * (width / oldWidth),
        ),
      )
      obstacle.y = Math.max(
        obstacle.radius + state.player.radius * 2 + 10,
        Math.min(
          height - obstacle.radius - state.player.radius * 2 - 10,
          obstacle.y * (height / oldHeight),
        ),
      )
    }
    if (state.mode === 'running') {
      resolveCircleAgainstObstacles(state.player, state.player.radius)
    }
  }

  createBackgroundMarks()
}

function createBackgroundMarks() {
  backgroundMarks = []
  ambientDust = []
  ambientGlows = []
  sectorArcs = []
  const sector = getSector()
  const visual = sector.visual
  const count = Math.max(18, Math.round((width * height) / 28000))
  let seed = visual.seed
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

  if (visual.effect === 'electric') {
    const arcCount = width < 760 ? 3 : 4
    for (let index = 0; index < arcCount; index += 1) {
      const points = []
      let x = random() * width
      let y = random() * height
      points.push({ x, y })
      for (let segment = 0; segment < 5; segment += 1) {
        x += 12 + random() * 20
        y += (random() - 0.5) * 22
        points.push({ x, y })
      }
      sectorArcs.push({
        points,
        phase: random() * TAU,
        speed: 0.7 + random() * 0.55,
      })
    }
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
  const visual = getSector().visual

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
  gradient.addColorStop(0, visual.center)
  gradient.addColorStop(0.52, visual.middle)
  gradient.addColorStop(1, visual.edge)
  backgroundContext.fillStyle = gradient
  backgroundContext.fillRect(0, 0, width, height)

  const gridSize = visual.gridSize || 56
  backgroundContext.lineWidth = 1
  for (let x = 0; x <= width; x += gridSize) {
    backgroundContext.strokeStyle =
      x % (gridSize * 4) === 0
        ? `rgba(${visual.gridRgb}, 0.13)`
        : `rgba(${visual.gridRgb}, 0.07)`
    backgroundContext.beginPath()
    backgroundContext.moveTo(x, 0)
    backgroundContext.lineTo(x, height)
    backgroundContext.stroke()
  }
  for (let y = 0; y <= height; y += gridSize) {
    backgroundContext.strokeStyle =
      y % (gridSize * 4) === 0
        ? `rgba(${visual.gridRgb}, 0.13)`
        : `rgba(${visual.gridRgb}, 0.07)`
    backgroundContext.beginPath()
    backgroundContext.moveTo(0, y)
    backgroundContext.lineTo(width, y)
    backgroundContext.stroke()
  }

  if (visual.effect === 'datacenter') {
    const rowSpacing = gridSize * 2.5
    for (let x = gridSize * 0.7, row = 0; x < width; x += rowSpacing, row += 1) {
      backgroundContext.fillStyle = 'rgba(1, 5, 8, 0.34)'
      backgroundContext.fillRect(x, 0, 22, height)
      backgroundContext.strokeStyle = 'rgba(61, 151, 176, 0.1)'
      backgroundContext.beginPath()
      backgroundContext.moveTo(x, 0)
      backgroundContext.lineTo(x, height)
      backgroundContext.moveTo(x + 22, 0)
      backgroundContext.lineTo(x + 22, height)
      backgroundContext.stroke()

      for (let y = 24; y < height; y += 72) {
        backgroundContext.fillStyle =
          row % 3 === 2 && Math.floor(y / 72) % 4 === 1
            ? 'rgba(155, 48, 48, 0.16)'
            : 'rgba(65, 174, 202, 0.1)'
        backgroundContext.fillRect(x + 6, y, 10, 2)
      }
    }
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
    backgroundContext.strokeStyle =
      `rgba(${visual.markRgb}, ${mark.opacity})`
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
        `rgba(${visual.debrisRgb}, ${mark.opacity + 0.05})`
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
      `rgba(${visual.glowRgb}, ${glow.opacity})`,
    )
    glowGradient.addColorStop(1, `rgba(${visual.glowRgb}, 0)`)
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

function updateEffectBudget(rawDt) {
  const performanceLoad =
    state.fps < 48 || state.frameMs > 24 || state.spikeTimer > 0
  const surgeLoad =
    isReactorSurging() &&
    (performanceLoad ||
      state.enemies.length >= getEntityCap('enemies') * 0.66 ||
      state.particles.length >= getEntityCap('particles') * 0.55 ||
      state.bullets.length >= getEntityCap('bullets') * 0.65)

  const pressure =
    performanceLoad ||
    surgeLoad ||
    state.enemies.length >= entityCaps.reducedEffectsEnemies ||
    state.particles.length >= entityCaps.particles * 0.72 ||
    state.bullets.length >= entityCaps.bullets * 0.75 ||
    state.bossProjectiles.length >= entityCaps.bossProjectiles * 0.8 ||
    state.bossEffects.length >= entityCaps.bossEffects * 0.8 ||
    state.pickups.length >= entityCaps.pickups * 0.65

  if (pressure) {
    if (!reducedEffects) state.effectsModeTransitions += 1
    reducedEffects = true
    state.effectsRecoveryClock = REDUCED_EFFECTS_RECOVERY_SECONDS
    return
  }

  if (!reducedEffects) return
  const safelyBelowBudget =
    state.fps >= 55 &&
    state.frameMs <= 19 &&
    state.spikeTimer <= 0 &&
    state.enemies.length < entityCaps.reducedEffectsEnemies * 0.78 &&
    state.particles.length < entityCaps.particles * 0.55 &&
    state.bullets.length < entityCaps.bullets * 0.6 &&
    state.bossProjectiles.length < entityCaps.bossProjectiles * 0.6 &&
    state.bossEffects.length < entityCaps.bossEffects * 0.6 &&
    state.pickups.length < entityCaps.pickups * 0.5

  if (!safelyBelowBudget) {
    state.effectsRecoveryClock = REDUCED_EFFECTS_RECOVERY_SECONDS
    return
  }

  state.effectsRecoveryClock -= Math.min(rawDt, 0.1)
  if (state.effectsRecoveryClock <= 0) {
    reducedEffects = false
    state.effectsModeTransitions += 1
  }
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
    let visibleEnemies = 0
    for (const enemy of state.enemies) {
      if (
        !enemy.dead &&
        enemy.x + enemy.radius >= 0 &&
        enemy.x - enemy.radius <= width &&
        enemy.y + enemy.radius >= 0 &&
        enemy.y - enemy.radius <= height
      ) {
        visibleEnemies += 1
      }
    }
    const titan = state.titan.status === 'active' ? state.titan.boss : null
    if (
      titan &&
      titan.x + titan.radius >= 0 &&
      titan.x - titan.radius <= width &&
      titan.y + titan.radius >= 0 &&
      titan.y - titan.radius <= height
    ) {
      visibleEnemies += 1
    }
    let visiblePickups = 0
    for (const pickup of state.pickups) {
      if (
        !pickup.collected &&
        pickup.x + pickup.radius >= 0 &&
        pickup.x - pickup.radius <= width &&
        pickup.y + pickup.radius >= 0 &&
        pickup.y - pickup.radius <= height
      ) {
        visiblePickups += 1
      }
    }
    ui.performanceValues.textContent =
      `FPS ${Math.round(state.fps)} · EN ${state.enemies.length} · ` +
      `OBS ${state.obstacles.length} · ` +
      `BLT ${state.bullets.length} · BP ${state.bossProjectiles.length} · ` +
      `MN ${state.bossMines.length} · BX ${state.bossEffects.length} · ` +
      `PCK ${state.pickups.length} · ` +
      `PRT ${state.particles.length} · TXT ${state.floatingTexts.length} · ` +
      `FX ${state.rings.length} · VIS ${visibleEnemies}/${visiblePickups} · ` +
      `Q ${reducedEffects ? 'LOW' : 'FULL'} · FT ${state.frameMs.toFixed(1)}MS`
  }
}

function updateHud() {
  const player = state.player
  const mission = state.mission
  const sector = getSector()
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
  ui.hudSectorName.textContent = sector.name
  ui.brandSector.textContent = `Dead Zone // ${sector.name}`

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

  const titanActive =
    state.mode === 'running' &&
    state.titan.status === 'active' &&
    state.titan.boss
  ui.bossHealth.hidden = !titanActive
  ui.bossWarning.hidden =
    state.mode !== 'running' || state.titan.warningTime <= 0
  if (titanActive) {
    const titan = state.titan.boss
    const health = Math.max(0, titan.health)
    ui.bossHealthText.textContent =
      `${Math.ceil(health)} / ${titan.maxHealth}`
    ui.bossHealthBar.style.width =
      `${Math.max(0, Math.min(100, (health / titan.maxHealth) * 100))}%`
  }

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
  const sectorReward = success
    ? getSector().gameplay.rewardBonus
    : { scrap: 0, gpu: 0, reactor: 0 }
  const titanReward =
    state.titan.status === 'destroyed'
      ? TITAN_REWARD
      : { scrap: 0, gpu: 0, reactor: 0 }
  return {
    scrap:
      Math.floor(state.scrap * recoveryRate) +
      (success ? 24 : 0) +
      titanReward.scrap +
      sectorReward.scrap,
    gpu:
      Math.floor(state.totalGpu * recoveryRate) +
      (success ? 6 : 0) +
      titanReward.gpu +
      sectorReward.gpu,
    reactor:
      Math.floor(state.reactorCoresCollected * recoveryRate) +
      (success ? 1 : 0) +
      titanReward.reactor +
      sectorReward.reactor,
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
  const sector = getSector()
  const availableSectorBonus = sector.gameplay.rewardBonus
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
    ? `${sector.name} hardware transferred to the hangar.`
    : `Emergency telemetry recovered part of the ${sector.name} salvage.`
  ui.summaryTime.textContent = formatTime(state.elapsed)
  ui.summaryKills.textContent = state.kills
  ui.summaryLevel.textContent = state.level
  ui.summaryScrap.textContent = state.scrap
  ui.summaryGpus.textContent = state.totalGpu
  ui.summaryReactors.textContent = state.reactorCoresCollected
  ui.summarySector.textContent = sector.name
  ui.summaryResult.textContent = success ? 'Extracted' : 'Drone Lost'
  if (state.titan.status === 'destroyed') {
    ui.summaryTitan.textContent = 'Destroyed'
    ui.summaryTitanBonus.textContent =
      `Titan destroyed bonus · +${TITAN_REWARD.scrap} SCR · ` +
      `+${TITAN_REWARD.gpu} GPU · +${TITAN_REWARD.reactor} RCT`
    ui.summaryTitanBonus.hidden = false
  } else if (state.titan.status === 'active') {
    ui.summaryTitan.textContent = success
      ? 'Survived · active at extraction'
      : 'Active at signal loss'
    ui.summaryTitanBonus.hidden = true
  } else {
    ui.summaryTitan.textContent = 'Avoided'
    ui.summaryTitanBonus.hidden = true
  }
  const sectorBonusParts = []
  if (availableSectorBonus.scrap) {
    sectorBonusParts.push(`+${availableSectorBonus.scrap} SCR`)
  }
  if (availableSectorBonus.gpu) {
    sectorBonusParts.push(`+${availableSectorBonus.gpu} GPU`)
  }
  if (availableSectorBonus.reactor) {
    sectorBonusParts.push(`+${availableSectorBonus.reactor} RCT`)
  }
  ui.summarySectorBonus.hidden = sectorBonusParts.length === 0
  if (sectorBonusParts.length > 0) {
    ui.summarySectorBonus.textContent = success
      ? `${sector.name} extraction bonus · ${sectorBonusParts.join(' · ')}`
      : `${sector.name} extraction bonus lost with the drone`
  }
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
  state.titan.status = 'pending'
  state.titan.spawnTimer = TITAN_SPAWN_DELAY
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

function spawnHarvesterTitan() {
  if (state.titan.status !== 'pending' || state.mode !== 'running') return

  const radius = width < 520 ? 52 : 60
  const margin = radius * 0.48
  const player = state.player
  const candidates = [
    {
      x: -margin,
      y: Math.max(radius, Math.min(height - radius, player.y)),
    },
    {
      x: width + margin,
      y: Math.max(radius, Math.min(height - radius, player.y)),
    },
    {
      x: Math.max(radius, Math.min(width - radius, player.x)),
      y: -margin,
    },
    {
      x: Math.max(radius, Math.min(width - radius, player.x)),
      y: height + margin,
    },
  ]
  let spawn = candidates[0]
  let greatestDistance = -1
  for (const candidate of candidates) {
    const dx = candidate.x - player.x
    const dy = candidate.y - player.y
    const distanceSquared = dx * dx + dy * dy
    if (distanceSquared > greatestDistance) {
      greatestDistance = distanceSquared
      spawn = candidate
    }
  }

  state.titan.boss = {
    id: state.nextEntityId++,
    type: 'titan',
    x: spawn.x,
    y: spawn.y,
    radius,
    speed: 30,
    health: TITAN_MAX_HEALTH,
    maxHealth: TITAN_MAX_HEALTH,
    damage: 22,
    color: '#ff743d',
    angle: 0,
    vx: 0,
    vy: 0,
    phase: 0,
    flash: 0,
    orbitCooldown: 0,
    mineClock: 2.2,
    burstClock: 3.4,
    pullClock: 5.8,
    pullWarning: 0,
    pullActive: 0,
    dead: false,
  }
  state.titan.status = 'active'
  state.titan.warningTime = 2.6
  state.warningFlash = Math.max(state.warningFlash, 1.25)
  state.shake = Math.min(13, state.shake + 5)
  createFloatingText(
    'HARVESTER TITAN DETECTED',
    player.x,
    player.y - 66,
    '#ffb052',
    2.2,
    width < 520 ? 13 : 16,
    true,
  )
  addRing({
    x: spawn.x,
    y: spawn.y,
    radius: radius * 0.65,
    maxRadius: radius * 2.4,
    life: 0.9,
    maxLife: 0.9,
    color: '#ff753f',
  }, true)
  updateHud()
}

function applyTitanDamage(amount) {
  if (state.titan.status !== 'active' || !state.titan.boss) return false
  const boss = state.titan.boss
  boss.health -= amount
  boss.flash = 0.14
  if (boss.health <= 0) destroyHarvesterTitan()
  return true
}

function destroyHarvesterTitan() {
  if (state.titan.status !== 'active' || !state.titan.boss) return
  const boss = state.titan.boss
  boss.dead = true
  boss.health = 0
  state.titan.status = 'destroyed'
  state.titan.warningTime = 0
  state.bossProjectiles.length = 0
  state.bossMines.length = 0
  state.kills += 12
  state.shake = Math.min(15, state.shake + 11)
  state.warningFlash = Math.max(state.warningFlash, 0.9)

  // Scrapping the Titan immediately provides a short pressure-release surge.
  // The fixed permanent reward is added once when the run is finalized.
  state.reactorSurge = Math.max(
    state.reactorSurge,
    Math.min(6, state.reactorSurgeDuration),
  )
  state.reactorEnemyCap = Math.min(
    entityCaps.enemies,
    Math.max(state.enemies.length, entityCaps.surge.enemies),
  )

  const effectCap = getEntityCap('bossEffects')
  const effectCount = Math.min(reducedEffects ? 12 : 22, effectCap)
  for (let index = 0; index < effectCount; index += 1) {
    const angle = (index / effectCount) * TAU + Math.random() * 0.22
    const speed = 45 + Math.random() * 145
    const life = 0.55 + Math.random() * 0.65
    state.bossEffects.push({
      x: boss.x,
      y: boss.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 3 + Math.random() * 7,
      rotation: angle,
      spin: (Math.random() - 0.5) * 8,
      life,
      maxLife: life,
      color: index % 3 === 0 ? '#ffcf65' : index % 2 ? '#ff6439' : '#7b8583',
    })
  }
  createHitEffect(boss.x, boss.y, '#ffb044', 28)
  addRing({
    x: boss.x,
    y: boss.y,
    radius: boss.radius * 0.5,
    maxRadius: boss.radius * 3.1,
    life: 0.8,
    maxLife: 0.8,
    color: '#ff9e45',
  }, true)
  createFloatingText(
    'TITAN SCRAPPED',
    boss.x,
    boss.y - boss.radius,
    '#ffe083',
    2,
    width < 520 ? 14 : 17,
    true,
  )

  // A small physical salvage burst supplements the guaranteed summary reward.
  spawnResourcePickup('battery', boss)
  spawnResourcePickup('gpu', boss)
  spawnResourcePickup('scrap', boss)
  updateHud()
}

function damagePlayerFromTitan(amount, cooldown = 0.72) {
  const player = state.player
  if (player.hitCooldown > 0 || state.mode !== 'running') return false

  const damage = applyPlayerDamage(amount)
  const blockedByShield =
    damage.shieldDamage > 0 && damage.hullDamage === 0
  player.hitCooldown = cooldown
  state.shake = Math.min(13, state.shake + 6)
  createHitEffect(
    player.x,
    player.y,
    blockedByShield ? '#5acbff' : '#ff7446',
    10,
  )
  addRing({
    x: player.x,
    y: player.y,
    radius: player.radius,
    maxRadius: player.radius * 2.25,
    life: 0.28,
    maxLife: 0.28,
    color: blockedByShield ? '#5acbff' : '#ff643d',
  }, true)
  updateHud()
  if (player.health <= 0) endGame()
  return true
}

function isTitanMinePositionSafe(x, y, radius) {
  if (isCircleBlockedByObstacle(x, y, radius, 15)) return false

  const playerDx = x - state.player.x
  const playerDy = y - state.player.y
  const playerClearance = radius + state.player.radius + 34
  if (
    playerDx * playerDx + playerDy * playerDy <
    playerClearance * playerClearance
  ) {
    return false
  }

  for (const mine of state.bossMines) {
    const dx = x - mine.x
    const dy = y - mine.y
    const mineClearance = radius + mine.radius + 12
    if (dx * dx + dy * dy < mineClearance * mineClearance) return false
  }
  return true
}

function dropTitanMine(boss) {
  if (state.bossMines.length >= getEntityCap('bossMines')) return
  const behindX = -Math.cos(boss.angle)
  const behindY = -Math.sin(boss.angle)
  const sideX = -behindY
  const sideY = behindX
  const offset = (Math.random() - 0.5) * boss.radius
  const baseX = boss.x + behindX * boss.radius * 0.7 + sideX * offset
  const baseY = boss.y + behindY * boss.radius * 0.7 + sideY * offset
  const radius = 17
  let spawnX = 0
  let spawnY = 0
  let foundPosition = false

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const searchDistance = attempt === 0 ? 0 : 24 + Math.floor(attempt / 2) * 12
    const searchAngle = boss.angle + attempt * 2.4
    const candidateX = Math.max(
      radius + 1,
      Math.min(width - radius - 1, baseX + Math.cos(searchAngle) * searchDistance),
    )
    const candidateY = Math.max(
      radius + 1,
      Math.min(height - radius - 1, baseY + Math.sin(searchAngle) * searchDistance),
    )
    if (!isTitanMinePositionSafe(candidateX, candidateY, radius)) continue
    spawnX = candidateX
    spawnY = candidateY
    foundPosition = true
    break
  }
  if (!foundPosition) return

  state.bossMines.push({
    x: spawnX,
    y: spawnY,
    radius,
    phase: Math.random() * TAU,
    life: 7.5,
    maxLife: 7.5,
  })
}

function fireTitanScrapBurst(boss) {
  const available =
    getEntityCap('bossProjectiles') - state.bossProjectiles.length
  const desiredCount = entityCaps.bossProjectiles <= 24 ? 7 : 9
  const projectileCount = Math.min(desiredCount, available)
  if (projectileCount <= 0) return

  const offset = boss.phase * 0.23
  for (let index = 0; index < projectileCount; index += 1) {
    const angle = offset + (index / projectileCount) * TAU
    const speed = 105 + (index % 2) * 12
    state.bossProjectiles.push({
      x: boss.x + Math.cos(angle) * boss.radius * 0.72,
      y: boss.y + Math.sin(angle) * boss.radius * 0.72,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 6,
      phase: angle,
      life: 5.8,
    })
  }
}

function updateTitanHazards(dt) {
  const player = state.player
  const mines = state.bossMines
  let mineWriteIndex = 0
  for (let index = 0; index < mines.length; index += 1) {
    const mine = mines[index]
    mine.life -= dt
    mine.phase += dt * 4.2
    if (mine.life <= 0) continue

    const dx = player.x - mine.x
    const dy = player.y - mine.y
    const collisionDistance = player.radius + mine.radius
    if (dx * dx + dy * dy <= collisionDistance * collisionDistance) {
      damagePlayerFromTitan(14, 0.78)
      createHitEffect(mine.x, mine.y, '#ff743d', 8)
      addRing({
        x: mine.x,
        y: mine.y,
        radius: mine.radius,
        maxRadius: mine.radius * 2.5,
        life: 0.3,
        maxLife: 0.3,
        color: '#ff8b43',
      })
      continue
    }
    mines[mineWriteIndex] = mine
    mineWriteIndex += 1
  }
  mines.length = mineWriteIndex
  trimOldestInPlace(mines, getEntityCap('bossMines'))

  const projectiles = state.bossProjectiles
  let projectileWriteIndex = 0
  for (let index = 0; index < projectiles.length; index += 1) {
    const projectile = projectiles[index]
    const previousX = projectile.x
    const previousY = projectile.y
    projectile.x += projectile.vx * dt
    projectile.y += projectile.vy * dt
    projectile.phase += dt * 4.5
    projectile.life -= dt
    if (
      projectile.life <= 0 ||
      projectile.x < -32 ||
      projectile.x > width + 32 ||
      projectile.y < -32 ||
      projectile.y > height + 32
    ) {
      continue
    }

    let hitObstacle = null
    let obstacleHitTime = Infinity
    for (const obstacle of state.obstacles) {
      if (obstacle.dead) continue
      const hitTime = segmentCircleHitTime(
        previousX,
        previousY,
        projectile.x,
        projectile.y,
        obstacle.x,
        obstacle.y,
        projectile.radius + obstacle.radius,
      )
      if (hitTime < obstacleHitTime) {
        obstacleHitTime = hitTime
        hitObstacle = obstacle
      }
    }
    if (hitObstacle) {
      projectile.x =
        previousX + (projectile.x - previousX) * obstacleHitTime
      projectile.y =
        previousY + (projectile.y - previousY) * obstacleHitTime
      const bossProjectileDamage =
        obstacleTypes[hitObstacle.type].bossProjectileDamage || 0
      if (bossProjectileDamage > 0) {
        applyObstacleDamage(hitObstacle, bossProjectileDamage)
      }
      continue
    }

    const dx = player.x - projectile.x
    const dy = player.y - projectile.y
    const collisionDistance = player.radius + projectile.radius
    if (dx * dx + dy * dy <= collisionDistance * collisionDistance) {
      damagePlayerFromTitan(9, 0.6)
      continue
    }
    projectiles[projectileWriteIndex] = projectile
    projectileWriteIndex += 1
  }
  projectiles.length = projectileWriteIndex
  trimOldestInPlace(projectiles, getEntityCap('bossProjectiles'))
}

function crushObstaclesWithTitan(boss, dt) {
  for (const obstacle of state.obstacles) {
    if (obstacle.dead) continue
    const dx = boss.x - obstacle.x
    const dy = boss.y - obstacle.y
    const crushDistance = boss.radius * 0.72 + obstacle.radius
    if (dx * dx + dy * dy <= crushDistance * crushDistance) {
      applyObstacleDamage(obstacle, 48 * dt)
    }
  }
}

function updateTitanEncounter(dt) {
  state.titan.warningTime = Math.max(0, state.titan.warningTime - dt)
  if (state.titan.status === 'pending') {
    state.titan.spawnTimer -= dt
    if (state.titan.spawnTimer <= 0) spawnHarvesterTitan()
  }
  if (state.titan.status !== 'active' || !state.titan.boss) return

  const boss = state.titan.boss
  const player = state.player
  boss.phase += dt * 2.2
  boss.flash = Math.max(0, boss.flash - dt)

  let dx = player.x - boss.x
  let dy = player.y - boss.y
  let distance = Math.hypot(dx, dy) || 1
  const directionX = dx / distance
  const directionY = dy / distance
  boss.angle = Math.atan2(directionY, directionX)
  const approachScale =
    distance > 125 ? 1 : Math.max(0, (distance - 88) / 37)
  boss.vx = directionX * boss.speed * approachScale
  boss.vy = directionY * boss.speed * approachScale
  boss.x += boss.vx * dt
  boss.y += boss.vy * dt
  boss.x = Math.max(-boss.radius * 0.5, Math.min(width + boss.radius * 0.5, boss.x))
  boss.y = Math.max(-boss.radius * 0.5, Math.min(height + boss.radius * 0.5, boss.y))
  crushObstaclesWithTitan(boss, dt)
  if (boss.dead || state.titan.status !== 'active') return

  dx = player.x - boss.x
  dy = player.y - boss.y
  const distanceSquared = dx * dx + dy * dy
  const collisionDistance = player.radius + boss.radius * 0.78
  if (distanceSquared < collisionDistance * collisionDistance) {
    distance = Math.sqrt(distanceSquared) || 1
    const overlap = collisionDistance - distance
    boss.x -= (dx / distance) * overlap * 0.62
    boss.y -= (dy / distance) * overlap * 0.62
    damagePlayerFromTitan(boss.damage, 0.92)
  }

  boss.mineClock -= dt
  if (boss.mineClock <= 0) {
    dropTitanMine(boss)
    boss.mineClock = 4.35 + Math.random() * 0.8
  }

  boss.burstClock -= dt
  if (boss.burstClock <= 0) {
    fireTitanScrapBurst(boss)
    boss.burstClock = 6.2 + Math.random() * 1.1
  }

  boss.pullClock -= dt
  if (boss.pullWarning > 0) {
    boss.pullWarning -= dt
    if (boss.pullWarning <= 0) boss.pullActive = 1.55
  } else if (boss.pullActive > 0) {
    boss.pullActive -= dt
    const pullRadius = 215
    const pullDx = boss.x - player.x
    const pullDy = boss.y - player.y
    const pullDistanceSquared = pullDx * pullDx + pullDy * pullDy
    if (
      pullDistanceSquared < pullRadius * pullRadius &&
      pullDistanceSquared > 72 * 72
    ) {
      const pullDistance = Math.sqrt(pullDistanceSquared) || 1
      const pullStrength =
        18 + (1 - Math.min(1, pullDistance / pullRadius)) * 18
      player.x += (pullDx / pullDistance) * pullStrength * dt
      player.y += (pullDy / pullDistance) * pullStrength * dt
      player.x = Math.max(
        player.radius + 8,
        Math.min(width - player.radius - 8, player.x),
      )
      player.y = Math.max(
        player.radius + 8,
        Math.min(height - player.radius - 8, player.y),
      )
      resolveCircleAgainstObstacles(player, player.radius)
    }
  } else if (boss.pullClock <= 0) {
    boss.pullWarning = 0.9
    boss.pullClock = 10.2
  }

  updateTitanHazards(dt)
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
  const gameplay = getSector().gameplay
  const eliteWindow =
    state.elapsed >= 120 || state.mission.extractionActive
  if (eliteWindow) {
    const eliteChance = state.mission.extractionActive ? 0.055 : 0.016
    if (Math.random() < eliteChance) return 'reclaimer'
  }
  const roll = Math.random()
  const heavyThreshold = Math.min(
    0.24,
    (0.07 + difficulty * 0.1) * gameplay.heavyChanceMultiplier,
  )
  const scoutThreshold = Math.min(
    0.58,
    (0.3 + difficulty * 0.1) * gameplay.scoutChanceMultiplier,
  )
  if (state.elapsed > 18 && roll < heavyThreshold) return 'heavy'
  if (state.elapsed > 3.5 && roll < scoutThreshold) return 'scout'
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
    avoidDirection: Math.random() < 0.5 ? -1 : 1,
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

  const boss =
    state.titan.status === 'active' ? state.titan.boss : null
  if (boss && !boss.dead) {
    const dx = boss.x - player.x
    const dy = boss.y - player.y
    const distance = Math.hypot(dx, dy)
    const onScreen =
      boss.x > -boss.radius &&
      boss.x < width + boss.radius &&
      boss.y > -boss.radius &&
      boss.y < height + boss.radius
    let score = distance / 120 + (onScreen ? 0 : 0.8)
    if (distance < 300) score *= 0.58
    if (boss.id === state.targetId) score *= 0.9
    if (score < bestScore) {
      bestEnemy = boss
    }
  }

  // Obstacles are fallback targets during a lull. Active hostiles always take
  // priority, while barricades in an existing shot line are hit naturally.
  if (!bestEnemy) {
    for (const obstacle of state.obstacles) {
      if (obstacle.dead) continue
      const dx = obstacle.x - player.x
      const dy = obstacle.y - player.y
      const distanceSquared = dx * dx + dy * dy
      if (distanceSquared > 310 * 310 || distanceSquared >= bestScore) continue
      bestScore = distanceSquared
      bestEnemy = obstacle
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
  const aimX = target.x + (target.vx || 0) * leadTime
  const aimY = target.y + (target.vy || 0) * leadTime
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
  const multipliers = getSector().gameplay.dropMultipliers
  const adjustedWeights = []
  let totalChance = 0
  for (const [resourceType, chance] of Object.entries(dropWeights)) {
    const adjustedChance = chance * (multipliers[resourceType] || 1)
    adjustedWeights.push([resourceType, adjustedChance])
    totalChance += adjustedChance
  }
  // Preserve a small no-drop window when a sector boosts a resource on enemies
  // whose baseline drop table is already close to one.
  const scale = totalChance > 0.985 ? 0.985 / totalChance : 1
  const roll = Math.random()
  let cumulativeChance = 0

  for (const [resourceType, chance] of adjustedWeights) {
    cumulativeChance += chance * scale
    if (roll < cumulativeChance) return resourceType
  }

  return null
}

function findClearPickupPosition(x, y, radius) {
  const margin = radius + 10
  const clampedX = Math.max(margin, Math.min(width - margin, x))
  const clampedY = Math.max(margin, Math.min(height - margin, y))
  if (!isCircleBlockedByObstacle(clampedX, clampedY, radius, 3)) {
    return { x: clampedX, y: clampedY }
  }

  const startAngle = (state.nextEntityId * 2.399963) % TAU
  for (let ring = 1; ring <= 4; ring += 1) {
    const searchRadius = 24 + ring * 20
    for (let index = 0; index < 8; index += 1) {
      const angle = startAngle + index * (TAU / 8)
      const candidateX = Math.max(
        margin,
        Math.min(width - margin, clampedX + Math.cos(angle) * searchRadius),
      )
      const candidateY = Math.max(
        margin,
        Math.min(height - margin, clampedY + Math.sin(angle) * searchRadius),
      )
      if (!isCircleBlockedByObstacle(candidateX, candidateY, radius, 3)) {
        return { x: candidateX, y: candidateY }
      }
    }
  }

  // The generated center corridor is always obstacle-free, so this fallback
  // remains collectable even in an unusually dense edge cluster.
  return { x: state.player.x, y: state.player.y }
}

function spawnResourcePickup(type, source) {
  const pickupCap = getEntityCap('pickups')
  const atPickupCap = state.pickups.length >= pickupCap
  const fromObstacle = Boolean(obstacleTypes[source.type])
  const isEssential =
    type === 'battery' || type === 'reactor' || fromObstacle
  if (atPickupCap) {
    if (!isEssential) return
    let replaceableIndex = state.pickups.findIndex(
      (pickup) => pickup.type === 'scrap' || pickup.type === 'gpu',
    )
    if (replaceableIndex === -1 && fromObstacle) replaceableIndex = 0
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
  const position = findClearPickupPosition(source.x, source.y, resource.radius)
  const isValuableScrap =
    type === 'scrap' &&
    (source.type === 'heavy' || source.type === 'reclaimer')
  const doubleScrapChance = source.type === 'reclaimer' ? 0.8 : 0.55

  state.pickups.push({
    type,
    value: isValuableScrap && Math.random() < doubleScrapChance ? 2 : 1,
    x: Math.max(pickupMargin, Math.min(width - pickupMargin, position.x)),
    y: Math.max(pickupMargin, Math.min(height - pickupMargin, position.y)),
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
  resolveCircleAgainstObstacles(player, player.radius)
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
  const sectorGameplay = getSector().gameplay
  const surgePressure = surging ? SURGE_SPAWN_INTERVAL_MULTIPLIER : 1
  const extractionPressure = extracting ? 0.82 : 1
  const baseSpawnInterval = Math.max(
    0.31,
    0.86 - Math.min(state.elapsed, 180) * 0.00305,
  )
  const spawnInterval =
    baseSpawnInterval *
    surgePressure *
    extractionPressure *
    sectorGameplay.spawnIntervalMultiplier
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
    26 +
      Math.floor(state.elapsed * 0.28) +
      (extracting ? 8 : 0) +
      sectorGameplay.enemyCapBonus,
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

  for (const obstacle of state.obstacles) {
    if (obstacle.dead) continue
    obstacle.orbitCooldown = Math.max(0, obstacle.orbitCooldown - dt)
    if (obstacle.orbitCooldown > 0) continue

    const playerDx = obstacle.x - state.player.x
    const playerDy = obstacle.y - state.player.y
    const outerDistance = orbit.radius + orbit.droneRadius + obstacle.radius
    const innerDistance = Math.max(
      0,
      orbit.radius - orbit.droneRadius - obstacle.radius,
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
      const dx = drone.x - obstacle.x
      const dy = drone.y - obstacle.y
      const collisionDistance = orbit.droneRadius + obstacle.radius
      if (dx * dx + dy * dy > collisionDistance * collisionDistance) continue
      applyObstacleDamage(obstacle, orbit.damage)
      obstacle.orbitCooldown = orbit.hitInterval
      if (impactEffects < impactEffectBudget) {
        createHitEffect(drone.x, drone.y, '#79f7ff', 3)
        impactEffects += 1
      }
      break
    }
  }

  const boss =
    state.titan.status === 'active' ? state.titan.boss : null
  if (!boss || boss.dead) return
  boss.orbitCooldown = Math.max(0, boss.orbitCooldown - dt)
  if (boss.orbitCooldown > 0) return

  for (const drone of orbit.positions) {
    const dx = drone.x - boss.x
    const dy = drone.y - boss.y
    const collisionDistance = orbit.droneRadius + boss.radius * 0.82
    if (dx * dx + dy * dy > collisionDistance * collisionDistance) continue
    const surgeMultiplier = isReactorSurging() ? 1.35 : 1
    applyTitanDamage(orbit.damage * surgeMultiplier)
    boss.orbitCooldown = orbit.hitInterval
    createHitEffect(drone.x, drone.y, '#79f7ff', 3)
    break
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

  for (const obstacle of state.obstacles) {
    if (obstacle.dead) continue
    const dx = obstacle.x - player.x
    const dy = obstacle.y - player.y
    const hitRadius = emp.radius + obstacle.radius
    if (dx * dx + dy * dy <= hitRadius * hitRadius) {
      applyObstacleDamage(obstacle, emp.damage)
    }
  }

  const boss =
    state.titan.status === 'active' ? state.titan.boss : null
  if (boss && !boss.dead) {
    const dx = boss.x - player.x
    const dy = boss.y - player.y
    const hitRadius = emp.radius + boss.radius * 0.6
    if (dx * dx + dy * dy <= hitRadius * hitRadius) {
      const surgeMultiplier = isReactorSurging() ? 1.35 : 1
      applyTitanDamage(emp.damage * surgeMultiplier)
      createHitEffect(boss.x, boss.y, '#77f5ff', 5)
    }
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
    resolveCircleAgainstObstacles(
      enemy,
      enemy.radius,
      enemy.speed * dt * 0.55,
      enemy.avoidDirection,
    )

    const playerDx = player.x - enemy.x
    const playerDy = player.y - enemy.y
    const collisionDistance = player.radius + enemy.radius
    const playerDistanceSquared =
      playerDx * playerDx + playerDy * playerDy
    if (playerDistanceSquared < collisionDistance * collisionDistance) {
      const playerDistance = Math.sqrt(playerDistanceSquared) || 1
      const overlap = collisionDistance - playerDistance
      enemy.x -= (playerDx / playerDistance) * overlap * 0.78
      enemy.y -= (playerDy / playerDistance) * overlap * 0.78

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

  for (const enemy of state.enemies) {
    if (!enemy.dead) resolveCircleAgainstObstacles(enemy, enemy.radius)
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

    let hitTarget = null
    let hitKind = ''
    let earliestHitTime = Infinity

    for (const obstacle of state.obstacles) {
      if (obstacle.dead) continue
      const hitTime = segmentCircleHitTime(
        bullet.previousX,
        bullet.previousY,
        bullet.x,
        bullet.y,
        obstacle.x,
        obstacle.y,
        bullet.radius + obstacle.radius,
      )
      if (hitTime < earliestHitTime) {
        earliestHitTime = hitTime
        hitTarget = obstacle
        hitKind = 'obstacle'
      }
    }

    const boss =
      state.titan.status === 'active' ? state.titan.boss : null
    if (boss && !boss.dead) {
      const hitTime = segmentCircleHitTime(
        bullet.previousX,
        bullet.previousY,
        bullet.x,
        bullet.y,
        boss.x,
        boss.y,
        bullet.radius + boss.radius * 0.84,
      )
      if (hitTime < earliestHitTime) {
        earliestHitTime = hitTime
        hitTarget = boss
        hitKind = 'boss'
      }
    }

    for (let enemyIndex = 0; enemyIndex < enemies.length; enemyIndex += 1) {
      const enemy = enemies[enemyIndex]
      if (enemy.dead) continue
      const hitTime = segmentCircleHitTime(
        bullet.previousX,
        bullet.previousY,
        bullet.x,
        bullet.y,
        enemy.x,
        enemy.y,
        bullet.radius + enemy.radius,
      )
      if (hitTime < earliestHitTime) {
        earliestHitTime = hitTime
        hitTarget = enemy
        hitKind = 'enemy'
      }
    }

    if (hitTarget) {
      bullet.x =
        bullet.previousX + (bullet.x - bullet.previousX) * earliestHitTime
      bullet.y =
        bullet.previousY + (bullet.y - bullet.previousY) * earliestHitTime
      bullet.life = 0
      createHitEffect(
        bullet.x,
        bullet.y,
        '#ffd077',
        bullet.surged ? 2 : hitKind === 'obstacle' ? 4 : 6,
      )

      if (hitKind === 'obstacle') {
        applyObstacleDamage(hitTarget, bullet.damage)
      } else if (hitKind === 'boss') {
        applyTitanDamage(bullet.damage)
        createFloatingText(
          Math.round(bullet.damage),
          hitTarget.x + (Math.random() - 0.5) * 18,
          hitTarget.y - hitTarget.radius * 0.72,
          '#ffe1a1',
          0.58,
          10,
        )
      } else {
        hitTarget.health -= bullet.damage
        hitTarget.flash = 0.14
        if (hitTarget.health <= 0) destroyEnemy(hitTarget)
      }

      if (hitKind === 'enemy') {
        createFloatingText(
          Math.round(bullet.damage),
          hitTarget.x + (Math.random() - 0.5) * 8,
          hitTarget.y - hitTarget.radius,
          '#ffe1a1',
          0.58,
          10,
        )
      }
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
  compactObstacles()
}

function updatePickups(dt) {
  const player = state.player

  for (const pickup of state.pickups) {
    if (pickup.collected) continue
    const resource = resourceTypes[pickup.type]
    pickup.age += dt
    pickup.phase += dt * (pickup.type === 'reactor' ? 2.4 : 1.9)
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
    if (!pickup.collected && pickup.age < PICKUP_LIFETIME) {
      pickups[writeIndex] = pickup
      writeIndex += 1
    }
  }
  pickups.length = writeIndex
  // A surge lowers the spawn budget, but existing salvage remains in the
  // world. Trimming only to the device hard cap prevents visible pickups from
  // popping out when the performance profile changes mid-run.
  trimOldestInPlace(pickups, entityCaps.pickups)
}

function updateObstacles(dt) {
  for (const obstacle of state.obstacles) {
    obstacle.flash = Math.max(0, obstacle.flash - dt)
    obstacle.phase = (obstacle.phase + dt * 1.8) % TAU
  }
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

  const bossEffects = state.bossEffects
  let bossEffectWriteIndex = 0
  const bossEffectDamping = Math.pow(0.16, dt)
  for (let index = 0; index < bossEffects.length; index += 1) {
    const effect = bossEffects[index]
    effect.x += effect.vx * dt
    effect.y += effect.vy * dt
    effect.vx *= bossEffectDamping
    effect.vy *= bossEffectDamping
    effect.rotation += effect.spin * dt
    effect.life -= dt * (reducedEffects ? 1.25 : 1)
    if (effect.life > 0) {
      bossEffects[bossEffectWriteIndex] = effect
      bossEffectWriteIndex += 1
    }
  }
  bossEffects.length = bossEffectWriteIndex
  trimOldestInPlace(bossEffects, getEntityCap('bossEffects'))

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
  updateObstacles(dt)
  updatePlayer(dt)
  updateTitanEncounter(dt)
  if (state.mode !== 'running') return
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

function drawSectorAtmosphere() {
  const visual = getSector().visual
  if (visual.effect === 'datacenter') {
    ctx.save()
    const scanY = (state.elapsed * 13) % (height + 120) - 60
    ctx.globalAlpha = reducedEffects ? 0.025 : 0.045
    ctx.fillStyle = '#45b7d4'
    ctx.fillRect(0, scanY, width, 1)
    if (!reducedEffects) {
      const warningPulse = (Math.sin(state.elapsed * 0.82) + 1) * 0.5
      ctx.globalAlpha = 0.008 + warningPulse * 0.012
      ctx.fillStyle = '#8f252d'
      ctx.fillRect(0, 0, width, height)
    }
    ctx.restore()
    return
  }

  if (visual.effect === 'electric') {
    if (reducedEffects) return
    ctx.save()
    ctx.lineWidth = 1.4
    ctx.shadowColor = '#64d5ff'
    ctx.shadowBlur = 4
    for (const arc of sectorArcs) {
      const charge =
        (Math.sin(state.elapsed * arc.speed * 3.2 + arc.phase) + 1) * 0.5
      if (charge < 0.78) continue
      ctx.globalAlpha = (charge - 0.78) * 1.1
      ctx.strokeStyle = '#79dcff'
      ctx.beginPath()
      for (let index = 0; index < arc.points.length; index += 1) {
        const point = arc.points[index]
        if (index === 0) ctx.moveTo(point.x, point.y)
        else ctx.lineTo(point.x, point.y)
      }
      ctx.stroke()
    }
    ctx.restore()
    return
  }

  if (visual.effect === 'radiation') {
    const pulse = (Math.sin(state.elapsed * 1.35) + 1) * 0.5
    ctx.save()
    ctx.globalAlpha = (reducedEffects ? 0.012 : 0.018) + pulse * 0.018
    ctx.fillStyle = '#c8b83e'
    ctx.fillRect(0, 0, width, height)
    if (!reducedEffects) {
      const scanY = (state.elapsed * 24) % (height + 80) - 40
      ctx.globalAlpha = 0.08 + pulse * 0.05
      ctx.strokeStyle = '#e5c848'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, scanY)
      ctx.lineTo(width, scanY)
      ctx.stroke()
      ctx.globalAlpha *= 0.45
      ctx.beginPath()
      ctx.moveTo(0, scanY + 7)
      ctx.lineTo(width, scanY + 7)
      ctx.stroke()
    }
    ctx.restore()
  }
}

function drawBackground() {
  const visual = getSector().visual
  ctx.drawImage(backgroundLayer, 0, 0, width, height)

  if (!reducedEffects) {
    for (const glow of ambientGlows) {
      const glowStrength =
        0.62 + Math.sin(state.elapsed * 0.55 + glow.phase) * 0.12
      ctx.globalAlpha = glowStrength
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
    ctx.globalAlpha =
      dust.opacity * (0.82 + Math.sin(state.elapsed * 0.72 + dust.phase) * 0.18)
    ctx.fillStyle = visual.dustColor
    ctx.fillRect(dustX, dustY, dust.size * 2.2, dust.size)
  }
  ctx.globalAlpha = 1
  drawSectorAtmosphere()
  ctx.drawImage(vignetteLayer, 0, 0, width, height)
}

function drawObstacleHealthBar(obstacle) {
  if (obstacle.health >= obstacle.maxHealth || obstacle.health <= 0) return
  const healthRatio = Math.max(0, obstacle.health / obstacle.maxHealth)
  const barWidth = obstacle.radius * 1.65
  const barX = Math.round(obstacle.x - barWidth * 0.5)
  const barY = Math.round(obstacle.y - obstacle.radius - 9)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.72)'
  ctx.fillRect(barX, barY, barWidth, 4)
  ctx.fillStyle = obstacleTypes[obstacle.type].effectColor
  ctx.fillRect(barX, barY, Math.max(1, barWidth * healthRatio), 4)
}

function drawScrapBarricade(obstacle) {
  const radius = obstacle.radius
  ctx.fillStyle = '#252a29'
  ctx.strokeStyle = obstacle.flash > 0 ? '#fff1ce' : '#080c0d'
  ctx.lineWidth = obstacle.flash > 0 ? 4 : 3
  ctx.beginPath()
  ctx.moveTo(-radius * 0.95, -radius * 0.28)
  ctx.lineTo(-radius * 0.42, -radius * 0.75)
  ctx.lineTo(radius * 0.78, -radius * 0.55)
  ctx.lineTo(radius, radius * 0.18)
  ctx.lineTo(radius * 0.4, radius * 0.66)
  ctx.lineTo(-radius * 0.72, radius * 0.56)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = '#a9562e'
  ctx.fillRect(-radius * 0.74, -radius * 0.34, radius * 0.58, radius * 0.56)
  ctx.fillStyle = '#727d7b'
  ctx.fillRect(-radius * 0.08, -radius * 0.48, radius * 0.72, radius * 0.26)
  ctx.fillStyle = '#c2783e'
  ctx.fillRect(radius * 0.22, radius * 0.02, radius * 0.58, radius * 0.3)
  ctx.strokeStyle = '#c5cecb'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(-radius * 0.65, radius * 0.43)
  ctx.lineTo(radius * 0.68, -radius * 0.4)
  ctx.stroke()

  ctx.fillStyle = '#d5ddda'
  ctx.beginPath()
  ctx.arc(-radius * 0.48, -radius * 0.08, 2, 0, TAU)
  ctx.arc(radius * 0.58, radius * 0.17, 2, 0, TAU)
  ctx.fill()
}

function drawBatteryPylon(obstacle) {
  const radius = obstacle.radius
  const pulse = (Math.sin(obstacle.phase * 2.2) + 1) * 0.5
  ctx.fillStyle = '#10191d'
  ctx.strokeStyle = obstacle.flash > 0 ? '#e9fbff' : '#071014'
  ctx.lineWidth = obstacle.flash > 0 ? 4 : 3
  ctx.fillRect(
    -radius * 0.62,
    -radius * 0.9,
    radius * 1.24,
    radius * 1.8,
  )
  ctx.strokeRect(
    -radius * 0.62,
    -radius * 0.9,
    radius * 1.24,
    radius * 1.8,
  )

  ctx.fillStyle = '#263a42'
  ctx.fillRect(-radius * 0.48, -radius * 0.72, radius * 0.96, radius * 0.42)
  ctx.fillRect(-radius * 0.48, -radius * 0.16, radius * 0.96, radius * 0.42)
  ctx.fillRect(-radius * 0.48, radius * 0.4, radius * 0.96, radius * 0.3)
  ctx.strokeStyle = '#4db9e5'
  ctx.lineWidth = 2
  ctx.strokeRect(-radius * 0.48, -radius * 0.72, radius * 0.96, radius * 0.42)
  ctx.strokeRect(-radius * 0.48, -radius * 0.16, radius * 0.96, radius * 0.42)

  ctx.shadowColor = '#55cfff'
  ctx.shadowBlur = reducedEffects ? 0 : 7 + pulse * 4
  ctx.fillStyle = '#72dcff'
  ctx.fillRect(-radius * 0.29, -radius * 0.57, radius * 0.58, 3)
  ctx.fillRect(-radius * 0.29, -radius * 0.01, radius * 0.58, 3)
  ctx.shadowBlur = 0
  ctx.fillStyle = '#b8efff'
  ctx.fillRect(-4, -radius - 3, 8, 5)
}

function drawReactorVent(obstacle) {
  const radius = obstacle.radius
  const pulse = (Math.sin(obstacle.phase * 1.8) + 1) * 0.5
  ctx.fillStyle = '#28261b'
  ctx.strokeStyle = obstacle.flash > 0 ? '#fff4c6' : '#080b0b'
  ctx.lineWidth = obstacle.flash > 0 ? 4 : 3
  ctx.beginPath()
  for (let index = 0; index < 8; index += 1) {
    const angle = Math.PI / 8 + index * (TAU / 8)
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    if (index === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = '#6f3b20'
  ctx.strokeStyle = '#d09b36'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(0, 0, radius * 0.62, 0, TAU)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#161917'
  ctx.beginPath()
  ctx.arc(0, 0, radius * 0.34, 0, TAU)
  ctx.fill()

  ctx.shadowColor = '#ffba38'
  ctx.shadowBlur = reducedEffects ? 0 : 5 + pulse * 5
  ctx.strokeStyle = '#f2c84b'
  ctx.lineWidth = 2
  for (let index = 0; index < 3; index += 1) {
    const angle = obstacle.phase * 0.08 + index * (TAU / 3)
    ctx.beginPath()
    ctx.moveTo(Math.cos(angle) * radius * 0.22, Math.sin(angle) * radius * 0.22)
    ctx.lineTo(Math.cos(angle + 0.18) * radius * 0.55, Math.sin(angle + 0.18) * radius * 0.55)
    ctx.lineTo(Math.cos(angle - 0.08) * radius * 0.82, Math.sin(angle - 0.08) * radius * 0.82)
    ctx.stroke()
  }
  ctx.shadowBlur = 0
  ctx.fillStyle = '#d9432f'
  ctx.beginPath()
  ctx.arc(0, 0, 4 + pulse * 1.5, 0, TAU)
  ctx.fill()
}

function drawServerRack(obstacle) {
  const radius = obstacle.radius
  const rackWidth = radius * 1.2
  const rackHeight = radius * 1.82
  const pulse = (Math.sin(obstacle.phase * 1.25) + 1) * 0.5

  ctx.fillStyle = '#091116'
  ctx.strokeStyle = obstacle.flash > 0 ? '#e9fbff' : '#020609'
  ctx.lineWidth = obstacle.flash > 0 ? 4 : 3
  ctx.fillRect(-rackWidth * 0.5, -rackHeight * 0.5, rackWidth, rackHeight)
  ctx.strokeRect(-rackWidth * 0.5, -rackHeight * 0.5, rackWidth, rackHeight)

  ctx.fillStyle = '#15242b'
  ctx.fillRect(
    -rackWidth * 0.39,
    -rackHeight * 0.39,
    rackWidth * 0.78,
    rackHeight * 0.78,
  )
  ctx.fillStyle = '#071014'
  const bayHeight = rackHeight * 0.125
  for (let index = 0; index < 5; index += 1) {
    const y = -rackHeight * 0.34 + index * rackHeight * 0.155
    ctx.fillRect(-rackWidth * 0.31, y, rackWidth * 0.62, bayHeight)
  }

  ctx.shadowColor = '#54cbe8'
  ctx.shadowBlur = reducedEffects ? 0 : 3 + pulse * 2
  ctx.fillStyle = '#56d2ee'
  ctx.fillRect(-rackWidth * 0.24, -rackHeight * 0.3, rackWidth * 0.28, 2)
  ctx.fillRect(-rackWidth * 0.24, rackHeight * 0.01, rackWidth * 0.38, 2)
  ctx.fillRect(-rackWidth * 0.24, rackHeight * 0.32, rackWidth * 0.22, 2)
  ctx.shadowBlur = 0

  ctx.fillStyle =
    obstacle.detail > 0.58 && pulse > 0.35 ? '#d84b54' : '#28343a'
  ctx.fillRect(rackWidth * 0.2, -rackHeight * 0.3, 3, 3)
  ctx.strokeStyle = 'rgba(98, 156, 170, 0.35)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(-rackWidth * 0.42, rackHeight * 0.43)
  ctx.lineTo(rackWidth * 0.42, rackHeight * 0.43)
  ctx.stroke()
}

function drawObstacle(obstacle) {
  if (obstacle.dead) return
  ctx.save()
  ctx.translate(obstacle.x, obstacle.y)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.44)'
  ctx.beginPath()
  ctx.ellipse(
    2,
    obstacle.radius * 0.58,
    obstacle.radius * 0.98,
    obstacle.radius * 0.42,
    0,
    0,
    TAU,
  )
  ctx.fill()
  ctx.rotate(
    obstacle.type === 'battery-pylon'
      ? (obstacle.detail - 0.5) * 0.12
      : obstacle.rotation,
  )

  if (obstacle.type === 'scrap-barricade') drawScrapBarricade(obstacle)
  else if (obstacle.type === 'battery-pylon') drawBatteryPylon(obstacle)
  else if (obstacle.type === 'reactor-vent') drawReactorVent(obstacle)
  else drawServerRack(obstacle)
  ctx.restore()
  drawObstacleHealthBar(obstacle)
}

function drawObstacles() {
  for (const obstacle of state.obstacles) drawObstacle(obstacle)
}

function drawPickup(pickup) {
  const bobAmount = pickup.type === 'scrap' ? 1.2 : 2
  const bob = Math.sin(pickup.phase) * bobAmount
  const pulseAmount =
    pickup.type === 'reactor' ? 0.07 : pickup.type === 'scrap' ? 0 : 0.025
  const pulse = 1 + Math.sin(pickup.phase * 1.15) * pulseAmount

  ctx.save()
  ctx.translate(pickup.x, pickup.y + bob)
  ctx.scale(pulse, pulse)

  if (pickup.type === 'gpu') drawGpuPickup(pickup)
  else if (pickup.type === 'battery') drawBatteryPickup(pickup)
  else if (pickup.type === 'scrap') drawScrapPickup(pickup)
  else if (pickup.type === 'reactor') drawReactorPickup(pickup)

  ctx.restore()
}

function drawPickupAura(color, radius, phase, beacon = true) {
  ctx.shadowColor = color
  ctx.shadowBlur = reducedEffects ? 0 : Math.min(10, radius * 0.4)
  ctx.fillStyle = color
  ctx.globalAlpha = 0.1
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, TAU)
  ctx.fill()
  ctx.globalAlpha = 0.36
  ctx.strokeStyle = color
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(0, 0, radius * 0.72 + Math.sin(phase * 1.1) * 1.2, 0, TAU)
  ctx.stroke()

  if (beacon) {
    ctx.globalAlpha = 0.3
    ctx.fillRect(-1, -radius - 12, 2, 14)
  }
  ctx.globalAlpha = 1
}

function drawGpuPickup(pickup) {
  drawPickupAura('#63ff91', 22, pickup.phase)
  ctx.shadowColor = '#63ff91'
  ctx.shadowBlur = reducedEffects ? 0 : 6
  ctx.fillStyle = '#182c22'
  ctx.fillRect(-9, -8, 18, 16)
  ctx.fillStyle = '#5ce984'
  ctx.fillRect(-7, -6, 14, 12)
  ctx.shadowBlur = 0
  ctx.fillStyle = '#123a27'
  ctx.fillRect(-4, -3, 8, 6)
  ctx.strokeStyle = '#c3ffd1'
  ctx.lineWidth = 1.25
  ctx.strokeRect(-9, -8, 18, 16)

  for (let i = -6; i <= 6; i += 4) {
    ctx.fillStyle = '#a7ffba'
    ctx.fillRect(i, -11, 2, 3)
    ctx.fillRect(i, 8, 2, 3)
  }
}

function drawBatteryPickup(pickup) {
  drawPickupAura('#58cfff', 23, pickup.phase)
  ctx.shadowColor = '#6ad7ff'
  ctx.shadowBlur = reducedEffects ? 0 : 7
  ctx.fillStyle = '#163745'
  ctx.fillRect(-9, -12, 18, 24)
  ctx.fillStyle = '#42b9eb'
  ctx.fillRect(-7, -10, 14, 20)
  ctx.fillStyle = '#a8ebff'
  ctx.fillRect(-4, -15, 8, 3)
  ctx.shadowBlur = 0
  ctx.fillStyle = '#092d3f'
  ctx.fillRect(-4, -7, 8, 14)
  ctx.fillStyle = '#68d8ff'
  ctx.fillRect(-3, 2, 6, 5)
  ctx.fillStyle = '#d8f7ff'
  ctx.fillRect(-1, -6, 2, 6)
  ctx.fillRect(-3, -4, 6, 2)
  ctx.strokeStyle = '#c6f3ff'
  ctx.lineWidth = 1.25
  ctx.strokeRect(-9, -12, 18, 24)
}

function drawScrapPickup(pickup) {
  ctx.save()
  ctx.rotate(pickup.phase * 0.12)
  ctx.shadowColor = '#f0a056'
  ctx.shadowBlur = reducedEffects ? 0 : 5
  ctx.fillStyle = 'rgba(226, 151, 73, 0.1)'
  ctx.beginPath()
  ctx.arc(0, 0, 16, 0, TAU)
  ctx.fill()
  ctx.fillStyle = '#858f8e'
  ctx.strokeStyle = '#f2a45a'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(-12, -4)
  ctx.lineTo(-3, -11)
  ctx.lineTo(10, -8)
  ctx.lineTo(7, 0)
  ctx.lineTo(11, 7)
  ctx.lineTo(-3, 10)
  ctx.lineTo(-9, 5)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.shadowBlur = 0
  ctx.fillStyle = '#c9d1cf'
  ctx.fillRect(-7, -5, 3, 3)
  ctx.fillStyle = '#4c5555'
  ctx.fillRect(5, 4, 2, 2)
  ctx.strokeStyle = '#dce3e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(-2, -7)
  ctx.lineTo(3, 5)
  ctx.lineTo(8, 1)
  ctx.stroke()
  ctx.restore()
}

function drawReactorPickup(pickup) {
  drawPickupAura('#ff9e32', 27, pickup.phase)
  ctx.save()
  ctx.rotate(pickup.phase * 0.22)
  ctx.shadowColor = '#ff5a32'
  ctx.shadowBlur = reducedEffects ? 0 : 8
  ctx.fillStyle = '#551a16'
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
  ctx.shadowBlur = reducedEffects ? 3 : 9
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

function drawTitanMines() {
  for (const mine of state.bossMines) {
    const pulse = (Math.sin(mine.phase) + 1) * 0.5
    ctx.save()
    ctx.translate(mine.x, mine.y)
    ctx.globalAlpha = 0.18 + pulse * 0.13
    ctx.fillStyle = '#ff5f32'
    ctx.beginPath()
    ctx.arc(0, 0, mine.radius + 6 + pulse * 3, 0, TAU)
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.fillStyle = '#321815'
    ctx.strokeStyle = '#ff7b3f'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(0, 0, mine.radius, 0, TAU)
    ctx.fill()
    ctx.stroke()
    ctx.strokeStyle = '#a83f29'
    ctx.lineWidth = 3
    for (let index = 0; index < 4; index += 1) {
      const angle = index * (TAU / 4) + mine.phase * 0.12
      ctx.beginPath()
      ctx.moveTo(Math.cos(angle) * 7, Math.sin(angle) * 7)
      ctx.lineTo(Math.cos(angle) * 14, Math.sin(angle) * 14)
      ctx.stroke()
    }
    ctx.shadowColor = '#ff9a42'
    ctx.shadowBlur = reducedEffects ? 0 : 10
    ctx.fillStyle = '#ff9a43'
    ctx.beginPath()
    ctx.arc(0, 0, 5 + pulse * 2, 0, TAU)
    ctx.fill()
    ctx.restore()
  }
}

function drawTitanProjectiles() {
  for (const projectile of state.bossProjectiles) {
    ctx.save()
    ctx.translate(projectile.x, projectile.y)
    ctx.rotate(projectile.phase)
    ctx.shadowColor = '#ff9e44'
    ctx.shadowBlur = reducedEffects ? 0 : 8
    ctx.fillStyle = '#ffc361'
    ctx.strokeStyle = '#ff7439'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(projectile.radius + 2, 0)
    ctx.lineTo(0, projectile.radius)
    ctx.lineTo(-projectile.radius - 2, 0)
    ctx.lineTo(0, -projectile.radius)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  }
}

function drawHarvesterTitan() {
  if (state.titan.status !== 'active' || !state.titan.boss) return
  const boss = state.titan.boss
  const radius = boss.radius
  const corePulse = (Math.sin(boss.phase * 2.3) + 1) * 0.5

  if (boss.pullWarning > 0 || boss.pullActive > 0) {
    const active = boss.pullActive > 0
    const warningProgress = 1 - Math.max(0, boss.pullWarning) / 0.9
    const fieldRadius = active
      ? 215 + Math.sin(boss.phase * 4) * 4
      : 155 + warningProgress * 60
    ctx.save()
    ctx.globalAlpha = active ? 0.22 : 0.12 + warningProgress * 0.13
    ctx.strokeStyle = active ? '#ff9c55' : '#ffbd72'
    ctx.lineWidth = active ? 2 : 1.5
    ctx.beginPath()
    ctx.arc(boss.x, boss.y, fieldRadius, 0, TAU)
    ctx.stroke()
    if (active && !reducedEffects) {
      ctx.globalAlpha = 0.1
      ctx.beginPath()
      ctx.arc(boss.x, boss.y, fieldRadius * 0.66, 0, TAU)
      ctx.stroke()
    }
    ctx.restore()
  }

  ctx.save()
  ctx.translate(boss.x, boss.y)
  ctx.rotate(boss.angle)

  if (!reducedEffects) {
    ctx.globalAlpha = 0.12 + corePulse * 0.08
    ctx.fillStyle = '#ff6238'
    ctx.beginPath()
    ctx.arc(0, 0, radius * 1.22, 0, TAU)
    ctx.fill()
    ctx.globalAlpha = 1
  }

  ctx.fillStyle = '#111719'
  ctx.strokeStyle = boss.flash > 0 ? '#fff0c7' : '#793c2c'
  ctx.lineWidth = boss.flash > 0 ? 3 : 2
  ctx.fillRect(-radius * 0.72, -radius * 0.8, radius * 1.14, radius * 0.3)
  ctx.strokeRect(-radius * 0.72, -radius * 0.8, radius * 1.14, radius * 0.3)
  ctx.fillRect(-radius * 0.72, radius * 0.5, radius * 1.14, radius * 0.3)
  ctx.strokeRect(-radius * 0.72, radius * 0.5, radius * 1.14, radius * 0.3)

  ctx.fillStyle = '#24292a'
  ctx.strokeStyle = boss.flash > 0 ? '#fff4d8' : '#b24a30'
  ctx.beginPath()
  ctx.moveTo(radius * 0.76, 0)
  ctx.lineTo(radius * 0.32, radius * 0.58)
  ctx.lineTo(-radius * 0.58, radius * 0.52)
  ctx.lineTo(-radius * 0.82, radius * 0.22)
  ctx.lineTo(-radius * 0.82, -radius * 0.22)
  ctx.lineTo(-radius * 0.58, -radius * 0.52)
  ctx.lineTo(radius * 0.32, -radius * 0.58)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Forward salvage claws keep the silhouette readable even with reduced FX.
  ctx.strokeStyle = boss.flash > 0 ? '#fff1cc' : '#bf5737'
  ctx.lineWidth = Math.max(3, radius * 0.08)
  for (const side of [-1, 1]) {
    ctx.beginPath()
    ctx.moveTo(radius * 0.35, side * radius * 0.38)
    ctx.lineTo(radius * 0.82, side * radius * 0.64)
    ctx.lineTo(radius * 1.08, side * radius * 0.48)
    ctx.stroke()
    ctx.lineWidth = Math.max(2, radius * 0.055)
    ctx.beginPath()
    ctx.moveTo(radius * 1.08, side * radius * 0.48)
    ctx.lineTo(radius * 0.98, side * radius * 0.28)
    ctx.moveTo(radius * 1.08, side * radius * 0.48)
    ctx.lineTo(radius * 0.86, side * radius * 0.58)
    ctx.stroke()
    ctx.lineWidth = Math.max(3, radius * 0.08)
  }

  ctx.fillStyle = '#0d1112'
  ctx.strokeStyle = '#5f3027'
  ctx.lineWidth = 2
  ctx.fillRect(-radius * 0.58, -radius * 0.3, radius * 0.48, radius * 0.6)
  ctx.strokeRect(-radius * 0.58, -radius * 0.3, radius * 0.48, radius * 0.6)
  ctx.fillStyle = '#89321f'
  ctx.fillRect(radius * 0.27, -radius * 0.31, radius * 0.2, radius * 0.62)

  ctx.shadowColor = '#ff5f32'
  ctx.shadowBlur = reducedEffects ? 5 : 18
  ctx.fillStyle = '#ff6938'
  ctx.beginPath()
  ctx.arc(0, 0, radius * 0.22 + corePulse * 2, 0, TAU)
  ctx.fill()
  ctx.fillStyle = '#ffd05d'
  ctx.beginPath()
  ctx.arc(0, 0, radius * 0.09 + corePulse, 0, TAU)
  ctx.fill()
  ctx.shadowBlur = 0
  ctx.restore()
}

function drawTitanEffects() {
  for (const effect of state.bossEffects) {
    ctx.save()
    ctx.translate(effect.x, effect.y)
    ctx.rotate(effect.rotation)
    ctx.globalAlpha = Math.max(0, effect.life / effect.maxLife)
    ctx.fillStyle = effect.color
    ctx.fillRect(
      -effect.size * 0.5,
      -effect.size * 0.35,
      effect.size,
      effect.size * 0.7,
    )
    ctx.restore()
  }
}

function drawEnemyHealthBar(enemy, healthRatio) {
  if (healthRatio >= 0.98 || healthRatio <= 0) return
  const barWidth = enemy.radius * 1.7
  const barX = Math.round(enemy.x - barWidth / 2)
  const barY = Math.round(enemy.y - enemy.radius - 10)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)'
  ctx.fillRect(barX, barY, barWidth, 3)
  ctx.fillStyle = enemy.color
  ctx.fillRect(barX, barY, Math.max(1, barWidth * healthRatio), 3)
}

function drawScavengerEnemy(enemy) {
  const radius = enemy.radius
  ctx.fillStyle = '#241d1b'
  ctx.beginPath()
  ctx.moveTo(radius * 0.82, 0)
  ctx.lineTo(radius * 0.48, radius * 0.58)
  ctx.lineTo(-radius * 0.52, radius * 0.62)
  ctx.lineTo(-radius * 0.78, radius * 0.3)
  ctx.lineTo(-radius * 0.78, -radius * 0.3)
  ctx.lineTo(-radius * 0.52, -radius * 0.62)
  ctx.lineTo(radius * 0.48, -radius * 0.58)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = '#111516'
  ctx.fillRect(-radius * 0.78, -radius * 0.72, radius * 0.3, radius * 0.28)
  ctx.fillRect(-radius * 0.78, radius * 0.44, radius * 0.3, radius * 0.28)
  ctx.strokeStyle = '#6f3930'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(-radius * 0.34, -radius * 0.42)
  ctx.lineTo(-radius * 0.34, radius * 0.42)
  ctx.moveTo(radius * 0.08, -radius * 0.5)
  ctx.lineTo(radius * 0.08, radius * 0.5)
  ctx.stroke()
}

function drawScoutEnemy(enemy) {
  const radius = enemy.radius
  ctx.fillStyle = '#20201d'
  ctx.beginPath()
  ctx.moveTo(radius * 1.12, 0)
  ctx.lineTo(-radius * 0.3, radius * 0.76)
  ctx.lineTo(-radius * 0.12, radius * 0.25)
  ctx.lineTo(-radius * 0.96, radius * 0.12)
  ctx.lineTo(-radius * 0.96, -radius * 0.12)
  ctx.lineTo(-radius * 0.12, -radius * 0.25)
  ctx.lineTo(-radius * 0.3, -radius * 0.76)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.strokeStyle = '#87502f'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(-radius * 0.24, radius * 0.42)
  ctx.lineTo(-radius * 0.82, radius * 0.86)
  ctx.moveTo(-radius * 0.24, -radius * 0.42)
  ctx.lineTo(-radius * 0.82, -radius * 0.86)
  ctx.stroke()
}

function drawHeavyEnemy(enemy) {
  const radius = enemy.radius
  ctx.fillStyle = '#101415'
  ctx.fillRect(-radius * 0.82, -radius * 0.82, radius * 0.4, radius * 1.64)
  ctx.fillRect(radius * 0.4, -radius * 0.82, radius * 0.4, radius * 1.64)

  ctx.fillStyle = '#2b211e'
  ctx.beginPath()
  ctx.moveTo(radius * 0.74, -radius * 0.46)
  ctx.lineTo(radius * 0.74, radius * 0.46)
  ctx.lineTo(radius * 0.44, radius * 0.7)
  ctx.lineTo(-radius * 0.6, radius * 0.7)
  ctx.lineTo(-radius * 0.78, radius * 0.42)
  ctx.lineTo(-radius * 0.78, -radius * 0.42)
  ctx.lineTo(-radius * 0.6, -radius * 0.7)
  ctx.lineTo(radius * 0.44, -radius * 0.7)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.strokeStyle = '#7e3931'
  ctx.lineWidth = 1.5
  ctx.strokeRect(-radius * 0.38, -radius * 0.5, radius * 0.66, radius)
  ctx.beginPath()
  ctx.moveTo(-radius * 0.7, 0)
  ctx.lineTo(-radius * 0.4, 0)
  ctx.stroke()
}

function drawReclaimerEnemy(enemy) {
  const radius = enemy.radius
  ctx.strokeStyle = enemy.flash > 0 ? '#ffd9b5' : '#d95778'
  ctx.lineWidth = enemy.flash > 0 ? 2.6 : 2
  for (const side of [-1, 1]) {
    ctx.beginPath()
    ctx.moveTo(-radius * 0.24, side * radius * 0.48)
    ctx.lineTo(-radius * 0.66, side * radius * 0.9)
    ctx.lineTo(-radius * 1.02, side * radius * 0.7)
    ctx.lineTo(-radius * 0.82, side * radius * 0.56)
    ctx.stroke()
  }

  ctx.fillStyle = '#261a20'
  ctx.beginPath()
  ctx.moveTo(radius * 0.98, 0)
  ctx.lineTo(radius * 0.48, radius * 0.72)
  ctx.lineTo(-radius * 0.66, radius * 0.62)
  ctx.lineTo(-radius * 0.96, radius * 0.24)
  ctx.lineTo(-radius * 0.96, -radius * 0.24)
  ctx.lineTo(-radius * 0.66, -radius * 0.62)
  ctx.lineTo(radius * 0.48, -radius * 0.72)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = '#101416'
  ctx.fillRect(-radius * 0.62, -radius * 0.36, radius * 0.46, radius * 0.72)
  ctx.strokeStyle = '#8e304e'
  ctx.lineWidth = 1.5
  ctx.strokeRect(-radius * 0.02, -radius * 0.52, radius * 0.38, radius * 1.04)
  ctx.beginPath()
  ctx.moveTo(radius * 0.46, -radius * 0.44)
  ctx.lineTo(radius * 0.72, 0)
  ctx.lineTo(radius * 0.46, radius * 0.44)
  ctx.stroke()
}

function drawEnemyCore(enemy) {
  const radius = enemy.radius
  const coreColor =
    enemy.type === 'reclaimer'
      ? '#ff5d83'
      : enemy.type === 'scout'
        ? '#ffb052'
        : enemy.type === 'heavy'
          ? '#ff633d'
          : '#ff7942'
  ctx.shadowColor = coreColor
  ctx.shadowBlur = reducedEffects ? 0 : enemy.type === 'reclaimer' ? 8 : 5
  ctx.fillStyle = coreColor

  if (enemy.type === 'reclaimer') {
    ctx.beginPath()
    ctx.arc(radius * 0.3, 0, radius * 0.16, 0, TAU)
    ctx.fill()
    ctx.strokeStyle = '#ffc078'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(radius * 0.3, 0, radius * 0.24, 0, TAU)
    ctx.stroke()
  } else if (enemy.type === 'scout') {
    ctx.beginPath()
    ctx.moveTo(radius * 0.52, 0)
    ctx.lineTo(radius * 0.12, radius * 0.2)
    ctx.lineTo(radius * 0.12, -radius * 0.2)
    ctx.closePath()
    ctx.fill()
  } else {
    const coreHeight = enemy.type === 'heavy' ? 7 : 5
    ctx.fillRect(
      radius * 0.08,
      -coreHeight / 2,
      radius * 0.5,
      coreHeight,
    )
  }
  ctx.shadowBlur = 0
}

function drawEnemy(enemy) {
  if (enemy.dead) return
  const healthRatio = Math.max(0, enemy.health / enemy.maxHealth)
  ctx.save()
  ctx.translate(enemy.x, enemy.y)
  ctx.rotate(enemy.angle)
  ctx.shadowBlur = 0
  ctx.strokeStyle = enemy.flash > 0 ? '#ffd9ad' : enemy.color
  ctx.lineWidth = enemy.flash > 0 ? 2.6 : 2

  if (enemy.type === 'reclaimer') drawReclaimerEnemy(enemy)
  else if (enemy.type === 'scout') drawScoutEnemy(enemy)
  else if (enemy.type === 'heavy') drawHeavyEnemy(enemy)
  else drawScavengerEnemy(enemy)

  drawEnemyCore(enemy)
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

  ctx.save()
  ctx.translate(player.x, player.y)
  ctx.rotate(player.angle + tilt)

  if (player.hitCooldown > 0) {
    ctx.globalAlpha = 0.3
    ctx.strokeStyle = '#ff7767'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(0, 0, player.radius + 7, 0, TAU)
    ctx.stroke()
    ctx.globalAlpha = 1
  }

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

  ctx.fillStyle = 'rgba(3, 8, 10, 0.88)'
  ctx.beginPath()
  ctx.ellipse(0, 0, 24, 16, 0, 0, TAU)
  ctx.fill()

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
  // Gameplay layers keep a fixed order so fallback detail changes never alter
  // which objects cover pickups, hostiles, projectiles, or the player.
  drawSurgePulse()
  ctx.save()
  const shakeX = state.shake ? (Math.random() - 0.5) * state.shake : 0
  const shakeY = state.shake ? (Math.random() - 0.5) * state.shake : 0
  ctx.translate(shakeX, shakeY)
  drawExtractionBeacon()
  drawObstacles()
  state.pickups.forEach(drawPickup)
  drawTitanMines()
  state.enemies.forEach(drawEnemy)
  drawHarvesterTitan()
  drawTitanProjectiles()
  drawBullets()
  drawOrbitDrones()
  drawPlayer()
  drawTitanEffects()
  drawEffects()
  ctx.restore()
  drawTouchControl()
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
  updateEffectBudget(rawDt)
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
    showSectorSelect()
  }
  if (
    event.code === 'Escape' &&
    (state.mode === 'hangar' || state.mode === 'sector')
  ) {
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
ui.sectorOptions.addEventListener('click', (event) => {
  const startButton = event.target.closest('[data-start-sector]')
  if (startButton) {
    startMission(startButton.dataset.startSector)
    return
  }
  const card = event.target.closest('[data-sector]')
  if (card) previewSector(card.dataset.sector)
})
ui.menuStartButton.addEventListener('click', showSectorSelect)
ui.menuHangarButton.addEventListener('click', showHangar)
ui.resetSaveButton.addEventListener('click', handleResetSave)
ui.sectorBackButton.addEventListener('click', showMainMenu)
ui.hangarBackButton.addEventListener('click', showMainMenu)
ui.hangarStartButton.addEventListener('click', showSectorSelect)
ui.summaryHangarButton.addEventListener('click', showHangar)
ui.summaryRestartButton.addEventListener('click', showSectorSelect)
ui.extractionButton.addEventListener('click', callExtraction)

const resizeObserver = new ResizeObserver(resizeCanvas)
resizeObserver.observe(canvas)
resizeCanvas()
showMainMenu()
requestAnimationFrame(gameLoop)
