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
        FPS <b>--</b> · EN <b>0</b> · BLT <b>0</b> · PCK <b>0</b>
      </div>

      <div class="hud hud-bottom">
        <div class="weapon-card">
          <span class="eyebrow">Weapon system</span>
          <strong>ARC PULSE // AUTO</strong>
          <div class="weapon-stats">
            <span>DMG <b id="damage-stat">18</b></span>
            <span>RATE <b id="rate-stat">1.8/s</b></span>
            <span>MOVE <b id="speed-stat">230</b></span>
          </div>
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

      <div id="game-over" class="modal-overlay" hidden>
        <div class="modal-panel game-over-panel" role="dialog" aria-modal="true" aria-labelledby="game-over-title">
          <span class="modal-kicker danger">Signal lost</span>
          <h2 id="game-over-title">Drone destroyed</h2>
          <p>The dead zone reclaimed another machine.</p>
          <div class="run-summary">
            <div><span>Survival time</span><strong id="final-time">00:00</strong></div>
            <div><span>Bots destroyed</span><strong id="final-kills">0</strong></div>
            <div><span>Level reached</span><strong id="final-level">1</strong></div>
          </div>
          <button id="restart-button" class="restart-button" type="button">
            <span>Reinitialize drone</span>
            <small>Press Enter</small>
          </button>
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
  levelUp: document.querySelector('#level-up'),
  upgradeOptions: document.querySelector('#upgrade-options'),
  gameOver: document.querySelector('#game-over'),
  finalTime: document.querySelector('#final-time'),
  finalKills: document.querySelector('#final-kills'),
  finalLevel: document.querySelector('#final-level'),
  restartButton: document.querySelector('#restart-button'),
  onboardingHint: document.querySelector('#onboarding-hint'),
  reactorStatus: document.querySelector('#reactor-status'),
  reactorTime: document.querySelector('#reactor-time'),
  reactorMeter: document.querySelector('#reactor-meter'),
  performanceReadout: document.querySelector('#performance-readout'),
  weaponCard: document.querySelector('.weapon-card'),
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
let reducedEffects = false

const MOBILE_CAPS = {
  enemies: 64,
  heavyEnemies: 7,
  bullets: 90,
  pickups: 40,
  particles: 130,
  rings: 28,
  floatingTexts: 18,
  reducedEffectsEnemies: 42,
}

const DESKTOP_CAPS = {
  enemies: 96,
  heavyEnemies: 10,
  bullets: 150,
  pickups: 60,
  particles: 220,
  rings: 45,
  floatingTexts: 26,
  reducedEffectsEnemies: 68,
}

const MIN_FIRE_INTERVAL = 0.22
const PICKUP_LIFETIME = 20
let entityCaps = DESKTOP_CAPS

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
}

const resourceTypes = {
  gpu: { radius: 11, magnetRadius: 190, color: '#68f78e' },
  battery: { radius: 12, magnetRadius: 205, color: '#59cfff' },
  scrap: { radius: 10, magnetRadius: 165, color: '#e6a15b' },
  reactor: { radius: 14, magnetRadius: 205, color: '#ffb13b' },
}

function createInitialState() {
  return {
    mode: 'running',
    elapsed: 0,
    spawnClock: 0.16,
    fireClock: 0,
    shake: 0,
    hudClock: 0,
    introClock: 8,
    targetId: null,
    scoutIntroduced: false,
    heavyIntroduced: false,
    level: 1,
    gpu: 0,
    gpuNeeded: 6,
    totalGpu: 0,
    scrap: 0,
    batteriesCollected: 0,
    reactorSurge: 0,
    reactorSurgeDuration: 10,
    warningFlash: 0,
    fps: 60,
    fpsFrames: 0,
    fpsTime: 0,
    kills: 0,
    nextEntityId: 1,
    player: {
      x: width / 2,
      y: height / 2,
      radius: 19,
      health: 100,
      maxHealth: 100,
      shield: 0,
      maxShield: 30,
      shieldDecayDelay: 0,
      speed: 230,
      damage: 18,
      fireInterval: 0.52,
      bulletSpeed: 700,
      hitCooldown: 0,
      angle: -Math.PI / 2,
      rotorPhase: 0,
      muzzleGlow: 0,
      moveX: 0,
      moveY: 0,
    },
    enemies: [],
    bullets: [],
    pickups: [],
    particles: [],
    rings: [],
    floatingTexts: [],
  }
}

function resetGame() {
  state = createInitialState()
  ui.levelUp.hidden = true
  ui.gameOver.hidden = true
  ui.onboardingHint.classList.remove('is-hidden')
  ui.performanceReadout.textContent = 'FPS -- · EN 0 · BLT 0 · PCK 0'
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
  return Math.max(
    0.14,
    state.player.fireInterval * (isReactorSurging() ? 0.62 : 1),
  )
}

function updateEffectBudget() {
  reducedEffects =
    state.enemies.length >= entityCaps.reducedEffectsEnemies ||
    state.particles.length >= entityCaps.particles * 0.72 ||
    state.bullets.length >= entityCaps.bullets * 0.75 ||
    state.pickups.length >= entityCaps.pickups * 0.65
}

function updatePerformanceReadout(rawDt) {
  state.fpsFrames += 1
  state.fpsTime += rawDt
  if (state.fpsTime < 0.5) return

  state.fps = Math.round(state.fpsFrames / state.fpsTime)
  state.fpsFrames = 0
  state.fpsTime = 0
  ui.performanceReadout.textContent =
    `FPS ${state.fps} · EN ${state.enemies.length} · ` +
    `BLT ${state.bullets.length} · PCK ${state.pickups.length}`
}

function updateHud() {
  const player = state.player
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
  ui.rate.textContent = `${(1 / getCurrentFireInterval()).toFixed(1)}/s`
  ui.speed.textContent = Math.round(player.speed)

  const surging = isReactorSurging()
  ui.reactorStatus.hidden = !surging
  ui.weaponCard.classList.toggle('is-surging', surging)
  ui.reactorTime.textContent = `${Math.max(0, state.reactorSurge).toFixed(1)}s`
  ui.reactorMeter.style.width = `${Math.min(
    100,
    (state.reactorSurge / state.reactorSurgeDuration) * 100,
  )}%`
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
  const roll = Math.random()
  if (state.elapsed > 18 && roll < 0.07 + difficulty * 0.1) return 'heavy'
  if (state.elapsed > 3.5 && roll < 0.3 + difficulty * 0.1) return 'scout'
  return 'scavenger'
}

function spawnEnemy(forcedType = null) {
  if (state.enemies.length >= entityCaps.enemies) return false

  const margin = 34
  const side = Math.floor(Math.random() * 4)
  let x
  let y

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

  let typeName = forcedType || randomEnemyType()
  if (typeName === 'heavy') {
    let heavyCount = 0
    for (const enemy of state.enemies) {
      if (!enemy.dead && enemy.type === 'heavy') heavyCount += 1
    }
    if (heavyCount >= entityCaps.heavyEnemies) typeName = 'scavenger'
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
    dead: false,
  })
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
  if (state.bullets.length >= entityCaps.bullets) return true

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
  if (
    !important &&
    reducedEffects &&
    state.rings.length >= entityCaps.rings * 0.7
  ) {
    return
  }
  if (state.rings.length >= entityCaps.rings) state.rings.shift()
  state.rings.push(ring)
}

function createMuzzleEffect(x, y, dx, dy, surged = false) {
  const color = surged ? '#ffd35c' : '#65f6ff'
  addRing({ x, y, radius: 2, maxRadius: 13, life: 0.14, maxLife: 0.14, color })
  const particleCount = reducedEffects ? 1 : 3
  const availableParticles = entityCaps.particles - state.particles.length
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
      color: surged ? '#ffe48a' : '#adfbff',
    })
  }
}

function createHitEffect(x, y, color = '#ffb064', count = 5) {
  const effectCount = reducedEffects ? Math.ceil(count * 0.42) : count
  const availableParticles = entityCaps.particles - state.particles.length
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
  if (reducedEffects && !important) return
  if (state.floatingTexts.length >= entityCaps.floatingTexts) {
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

function destroyEnemy(enemy) {
  if (enemy.dead) return
  enemy.dead = true
  state.kills += enemy.score
  createHitEffect(enemy.x, enemy.y, enemy.color, enemy.type === 'heavy' ? 20 : 12)
  addRing({
    x: enemy.x,
    y: enemy.y,
    radius: enemy.radius * 0.5,
    maxRadius: enemy.radius * 2.2,
    life: 0.28,
    maxLife: 0.28,
    color: enemy.color,
  })

  const resourceType = rollResourceDrop(enemy.type)
  if (resourceType) spawnResourcePickup(resourceType, enemy)
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
  const atPickupCap = state.pickups.length >= entityCaps.pickups
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
    state.pickups.length >= entityCaps.pickups * 0.75 &&
    Math.random() < 0.55
  ) {
    return
  }

  const resource = resourceTypes[type]
  const pickupMargin = resource.radius + 10
  const isHeavyScrap = type === 'scrap' && enemy.type === 'heavy'

  state.pickups.push({
    type,
    value: isHeavyScrap && Math.random() < 0.55 ? 2 : 1,
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
  state.reactorSurge = state.reactorSurgeDuration
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
    title: 'Fire rate',
    description: 'Arc Pulse fires faster.',
    current: () => `${(1 / state.player.fireInterval).toFixed(1)} shots/s`,
    next: () =>
      `${(1 / Math.max(MIN_FIRE_INTERVAL, state.player.fireInterval * 0.76)).toFixed(1)} shots/s`,
    confirmation: 'FIRE RATE UP',
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
    title: 'Damage',
    description: 'Arc Pulse hits harder.',
    current: () => `${Math.round(state.player.damage)} damage`,
    next: () => `${Math.round(state.player.damage + 7)} damage`,
    confirmation: 'DAMAGE UP',
    apply: () => {
      state.player.damage += 7
    },
  },
  {
    id: 'speed',
    icon: 'MV',
    title: 'Thrusters',
    description: 'Drone moves faster.',
    current: () => `${Math.round(state.player.speed)} speed`,
    next: () => `${Math.round(state.player.speed + 28)} speed`,
    confirmation: 'THRUSTERS UP',
    apply: () => {
      state.player.speed += 28
    },
  },
]

function openLevelUp() {
  state.mode = 'levelup'
  ui.upgradeOptions.innerHTML = upgrades
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
  const upgrade = upgrades.find((item) => item.id === id)
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
  lastFrame = performance.now()
}

function endGame() {
  state.mode = 'gameover'
  state.player.health = 0
  pointer.active = false
  ui.finalTime.textContent = formatTime(state.elapsed)
  ui.finalKills.textContent = state.kills
  ui.finalLevel.textContent = state.level
  ui.gameOver.hidden = false
  updateHud()
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

  const surgePressure = isReactorSurging() ? 0.88 : 1
  const baseSpawnInterval = Math.max(
    0.31,
    0.86 - Math.min(state.elapsed, 180) * 0.00305,
  )
  const spawnInterval = baseSpawnInterval * surgePressure
  const waveChance = Math.max(
    0,
    Math.min(0.12, (state.elapsed - 55) * 0.00085),
  )
  const waveSize = Math.random() < waveChance ? 2 : 1
  const maxEnemies = Math.min(
    entityCaps.enemies,
    26 + Math.floor(state.elapsed * 0.28),
  )
  let forcedType = null

  if (state.elapsed >= 4 && !state.scoutIntroduced) {
    forcedType = 'scout'
    state.scoutIntroduced = true
  } else if (state.elapsed >= 14 && !state.heavyIntroduced) {
    forcedType = 'heavy'
    state.heavyIntroduced = true
  }

  for (let i = 0; i < waveSize && state.enemies.length < maxEnemies; i += 1) {
    spawnEnemy(i === 0 ? forcedType : null)
  }
  state.spawnClock = spawnInterval * (0.86 + Math.random() * 0.28)
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
  // the overwhelming majority of pairs.
  for (let i = 0; i < state.enemies.length; i += 1) {
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
      }
    }
  }
}

function updateBullets(dt) {
  for (const bullet of state.bullets) {
    bullet.previousX = bullet.x
    bullet.previousY = bullet.y
    bullet.x += bullet.vx * dt
    bullet.y += bullet.vy * dt
    bullet.life -= dt

    if (bullet.life <= 0) continue

    for (const enemy of state.enemies) {
      if (enemy.dead) continue
      const dx = bullet.x - enemy.x
      const dy = bullet.y - enemy.y
      const collisionDistance = bullet.radius + enemy.radius
      if (dx * dx + dy * dy <= collisionDistance * collisionDistance) {
        enemy.health -= bullet.damage
        enemy.flash = 0.14
        bullet.life = 0
        createHitEffect(bullet.x, bullet.y, '#ffd077', 6)
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
    }
  }

  state.bullets = state.bullets.filter(
    (bullet) =>
      bullet.life > 0 &&
      bullet.x > -48 &&
      bullet.x < width + 48 &&
      bullet.y > -48 &&
      bullet.y < height + 48,
  )
  if (state.bullets.length > entityCaps.bullets) {
    state.bullets.splice(0, state.bullets.length - entityCaps.bullets)
  }
  state.enemies = state.enemies.filter(
    (enemy) =>
      !enemy.dead &&
      enemy.x > -140 &&
      enemy.x < width + 140 &&
      enemy.y > -140 &&
      enemy.y < height + 140,
  )
  if (state.enemies.length > entityCaps.enemies) {
    state.enemies.splice(0, state.enemies.length - entityCaps.enemies)
  }
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
    const distance = Math.hypot(dx, dy) || 1
    const batteryUrgency =
      pickup.type === 'battery' && player.health < player.maxHealth * 0.55 ? 1.18 : 1
    const magnetRadius = resource.magnetRadius * batteryUrgency
    if (distance < magnetRadius) {
      const pull = (1 - distance / magnetRadius) * 1380 + 110
      pickup.x += (dx / distance) * pull * dt
      pickup.y += (dy / distance) * pull * dt
    }
    pickup.x = Math.max(14, Math.min(width - 14, pickup.x))
    pickup.y = Math.max(14, Math.min(height - 14, pickup.y))

    if (distance < player.radius + pickup.radius + 5) {
      collectPickup(pickup)
      if (state.mode !== 'running') break
    }
  }

  state.pickups = state.pickups.filter(
    (pickup) => !pickup.collected && pickup.age < PICKUP_LIFETIME,
  )
  if (state.pickups.length > entityCaps.pickups) {
    state.pickups.splice(0, state.pickups.length - entityCaps.pickups)
  }
}

function updateEffects(dt) {
  for (const particle of state.particles) {
    particle.x += particle.vx * dt
    particle.y += particle.vy * dt
    particle.vx *= Math.pow(0.07, dt)
    particle.vy *= Math.pow(0.07, dt)
    particle.life -= dt
  }
  state.particles = state.particles.filter((particle) => particle.life > 0)
  if (state.particles.length > entityCaps.particles) {
    state.particles.splice(0, state.particles.length - entityCaps.particles)
  }

  for (const ring of state.rings) {
    ring.life -= dt
    const progress = 1 - ring.life / ring.maxLife
    ring.currentRadius = ring.radius + (ring.maxRadius - ring.radius) * progress
  }
  state.rings = state.rings.filter((ring) => ring.life > 0)
  if (state.rings.length > entityCaps.rings) {
    state.rings.splice(0, state.rings.length - entityCaps.rings)
  }

  for (const text of state.floatingTexts) {
    text.y += text.vy * dt
    text.vy *= Math.pow(0.35, dt)
    text.life -= dt
  }
  state.floatingTexts = state.floatingTexts.filter((text) => text.life > 0)
  if (state.floatingTexts.length > entityCaps.floatingTexts) {
    state.floatingTexts.splice(
      0,
      state.floatingTexts.length - entityCaps.floatingTexts,
    )
  }
  state.warningFlash = Math.max(0, state.warningFlash - dt * 1.8)
  state.shake = Math.max(0, state.shake - dt * 24)
}

function update(dt) {
  if (state.mode !== 'running') {
    updateEffects(dt)
    return
  }

  state.elapsed += dt
  state.reactorSurge = Math.max(0, state.reactorSurge - dt)
  state.introClock -= dt
  if (state.introClock <= 0) ui.onboardingHint.classList.add('is-hidden')
  state.hudClock -= dt
  updatePlayer(dt)
  updateSpawning(dt)
  updateShooting(dt)
  updateEnemies(dt)
  if (state.mode !== 'running') return
  updateBullets(dt)
  updatePickups(dt)
  updateEffects(dt)

  if (state.hudClock <= 0) {
    updateHud()
    state.hudClock = 0.1
  }
}

function drawBackground() {
  const gradient = ctx.createRadialGradient(
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
  ctx.fillStyle = gradient
  ctx.fillRect(-30, -30, width + 60, height + 60)

  if (!reducedEffects) {
    for (const glow of ambientGlows) {
      const flicker = 0.55 + Math.sin(state.elapsed * 0.75 + glow.phase) * 0.3
      const glowGradient = ctx.createRadialGradient(
        glow.x,
        glow.y,
        0,
        glow.x,
        glow.y,
        glow.radius,
      )
      glowGradient.addColorStop(0, `rgba(97, 176, 165, ${glow.opacity * flicker})`)
      glowGradient.addColorStop(1, 'rgba(50, 100, 95, 0)')
      ctx.fillStyle = glowGradient
      ctx.fillRect(
        glow.x - glow.radius,
        glow.y - glow.radius,
        glow.radius * 2,
        glow.radius * 2,
      )
    }
  }

  const gridSize = 56
  ctx.lineWidth = 1
  for (let x = 0; x <= width; x += gridSize) {
    ctx.strokeStyle = x % (gridSize * 4) === 0 ? 'rgba(82, 130, 127, 0.13)' : 'rgba(73, 99, 98, 0.075)'
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
  for (let y = 0; y <= height; y += gridSize) {
    ctx.strokeStyle = y % (gridSize * 4) === 0 ? 'rgba(82, 130, 127, 0.13)' : 'rgba(73, 99, 98, 0.075)'
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }

  for (const mark of backgroundMarks) {
    if (mark.patchRadius) {
      const point = mark.points[0]
      ctx.fillStyle = `rgba(3, 7, 8, ${mark.opacity * 0.32})`
      ctx.beginPath()
      ctx.ellipse(
        point.x,
        point.y,
        mark.patchRadius,
        mark.patchRadius * 0.48,
        mark.opacity * 8,
        0,
        TAU,
      )
      ctx.fill()
    }
    ctx.strokeStyle = `rgba(175, 154, 118, ${mark.opacity})`
    ctx.lineWidth = 1
    ctx.beginPath()
    mark.points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y)
      else ctx.lineTo(point.x, point.y)
    })
    ctx.stroke()
    if (mark.debris) {
      const point = mark.points[0]
      ctx.fillStyle = `rgba(124, 113, 90, ${mark.opacity + 0.05})`
      ctx.fillRect(point.x - 2, point.y - 1, 5, 2)
    }
  }

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

  const vignette = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.25,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.72,
  )
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)')
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.44)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, width, height)
}

function drawPickup(pickup) {
  if (pickup.age > PICKUP_LIFETIME - 2 && Math.floor(pickup.age * 8) % 2 === 0) {
    return
  }
  const bob = Math.sin(pickup.phase) * 3
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

function drawEnemy(enemy) {
  const healthRatio = Math.max(0, enemy.health / enemy.maxHealth)
  ctx.save()
  ctx.translate(enemy.x, enemy.y)
  ctx.rotate(enemy.angle)

  ctx.shadowColor = enemy.color
  ctx.shadowBlur = enemy.flash > 0 ? (reducedEffects ? 8 : 22) : (reducedEffects ? 0 : 7)
  ctx.strokeStyle = enemy.flash > 0 ? '#fff3dc' : enemy.color
  ctx.fillStyle = enemy.flash > 0 ? '#fff1d1' : '#251d1c'
  ctx.lineWidth = 2

  if (enemy.type === 'scout') {
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

  if (healthRatio < 0.98 && healthRatio > 0) {
    const barWidth = enemy.radius * 1.7
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)'
    ctx.fillRect(enemy.x - barWidth / 2, enemy.y - enemy.radius - 10, barWidth, 3)
    ctx.fillStyle = enemy.color
    ctx.fillRect(enemy.x - barWidth / 2, enemy.y - enemy.radius - 10, barWidth * healthRatio, 3)
  }
}

function drawBullets() {
  ctx.lineCap = 'round'
  for (const bullet of state.bullets) {
    const trailColor = bullet.surged ? '255, 205, 76' : '150, 250, 255'
    const bulletColor = bullet.surged ? '#fff0a1' : '#d6fdff'
    const glowColor = bullet.surged ? '#ffbd3d' : '#75f5ff'
    ctx.strokeStyle = `rgba(${trailColor}, 0.72)`
    ctx.lineWidth = width < 700 ? 4.5 : 3.6
    ctx.beginPath()
    ctx.moveTo(bullet.previousX, bullet.previousY)
    ctx.lineTo(bullet.x, bullet.y)
    ctx.stroke()
    ctx.shadowColor = glowColor
    ctx.shadowBlur = reducedEffects ? 0 : 14
    ctx.fillStyle = bulletColor
    ctx.beginPath()
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, TAU)
    ctx.fill()
    ctx.shadowBlur = 0
  }
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
    ctx.shadowBlur = 14
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(0, 0, player.radius + 11 + Math.sin(state.elapsed * 4) * 1.5, 0, TAU)
    ctx.stroke()
  }

  if (surged) {
    ctx.globalAlpha = 0.4 + Math.sin(state.elapsed * 8) * 0.1
    ctx.strokeStyle = '#ffbf3e'
    ctx.shadowColor = '#ff8a34'
    ctx.shadowBlur = 24
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
  ctx.shadowBlur = surged ? 30 : 18
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

  const hullGradient = ctx.createLinearGradient(-18, -12, 18, 12)
  hullGradient.addColorStop(0, '#25444a')
  hullGradient.addColorStop(0.5, '#15282d')
  hullGradient.addColorStop(1, '#091418')
  ctx.fillStyle = hullGradient
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

  ctx.shadowColor = '#69f5ff'
  ctx.shadowBlur = 15
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
    ctx.shadowBlur = 24
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
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(ring.x, ring.y, ring.currentRadius || ring.radius, 0, TAU)
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  for (const particle of state.particles) {
    const alpha = Math.max(0, particle.life / particle.maxLife)
    ctx.globalAlpha = alpha
    ctx.fillStyle = particle.color
    ctx.shadowColor = particle.color
    ctx.shadowBlur = reducedEffects ? 0 : 6
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
  ctx.save()
  const shakeX = state.shake ? (Math.random() - 0.5) * state.shake : 0
  const shakeY = state.shake ? (Math.random() - 0.5) * state.shake : 0
  ctx.translate(shakeX, shakeY)
  drawBackground()
  state.pickups.forEach(drawPickup)
  state.enemies.forEach(drawEnemy)
  drawBullets()
  drawPlayer()
  drawEffects()
  drawTouchControl()
  ctx.restore()

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
  updatePerformanceReadout(Math.min(rawDt, 1))
  updateEffectBudget()
  const dt = Math.min(rawDt, 0.032)
  update(dt)
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
  if (event.code === 'Enter' && state.mode === 'gameover') resetGame()
  if (state.mode === 'levelup' && ['Digit1', 'Digit2', 'Digit3'].includes(event.code)) {
    chooseUpgrade(upgrades[Number(event.code.at(-1)) - 1].id)
  }
})

window.addEventListener('keyup', (event) => {
  keys.delete(event.code)
})

window.addEventListener('blur', () => {
  keys.clear()
  pointer.active = false
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
ui.restartButton.addEventListener('click', resetGame)

const resizeObserver = new ResizeObserver(resizeCanvas)
resizeObserver.observe(canvas)
resizeCanvas()
resetGame()
requestAnimationFrame(gameLoop)
