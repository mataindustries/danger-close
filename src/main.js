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
          <div class="stat-label"><span>Hull integrity</span><strong id="health-text">100 / 100</strong></div>
          <div class="health-track"><div id="health-bar" class="health-fill"></div></div>
        </div>
        <div class="primary-stats">
          <div class="hud-stat"><span>Time</span><strong id="timer">00:00</strong></div>
          <div class="hud-stat"><span>Level</span><strong id="level">01</strong></div>
          <div class="hud-stat gpu-stat"><span>GPU cache</span><strong id="gpu-count">0 / 6</strong></div>
          <div class="hud-stat"><span>Kills</span><strong id="kill-count">000</strong></div>
        </div>
      </div>

      <div class="hud hud-bottom">
        <div class="weapon-card">
          <span class="eyebrow">Weapon system</span>
          <strong>ARC PULSE // AUTO</strong>
          <div class="weapon-stats">
            <span>DMG <b id="damage-stat">18</b></span>
            <span>RATE <b id="rate-stat">1.8/s</b></span>
            <span>SPD <b id="speed-stat">230</b></span>
          </div>
        </div>
        <div class="controls-hint">
          <span class="desktop-control"><b>WASD</b> / <b>ARROWS</b> TO MOVE</span>
          <span class="touch-control">DRAG TO MOVE</span>
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
            <div><span>Machines scrapped</span><strong id="final-kills">0</strong></div>
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
  healthText: document.querySelector('#health-text'),
  healthBar: document.querySelector('#health-bar'),
  timer: document.querySelector('#timer'),
  level: document.querySelector('#level'),
  gpu: document.querySelector('#gpu-count'),
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
}

const TAU = Math.PI * 2
const keys = new Set()
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

const enemyTypes = {
  scavenger: {
    radius: 17,
    speed: 65,
    health: 34,
    damage: 12,
    color: '#ee6649',
    score: 1,
  },
  skitter: {
    radius: 13,
    speed: 98,
    health: 23,
    damage: 9,
    color: '#f0a253',
    score: 1,
  },
  crusher: {
    radius: 25,
    speed: 43,
    health: 82,
    damage: 18,
    color: '#d84b48',
    score: 2,
  },
}

function createInitialState() {
  return {
    mode: 'running',
    elapsed: 0,
    spawnClock: 0.5,
    fireClock: 0,
    shake: 0,
    hudClock: 0,
    level: 1,
    gpu: 0,
    gpuNeeded: 6,
    totalGpu: 0,
    kills: 0,
    nextEntityId: 1,
    player: {
      x: width / 2,
      y: height / 2,
      radius: 19,
      health: 100,
      maxHealth: 100,
      speed: 230,
      damage: 18,
      fireInterval: 0.56,
      bulletSpeed: 660,
      hitCooldown: 0,
      angle: -Math.PI / 2,
      rotorPhase: 0,
    },
    enemies: [],
    bullets: [],
    pickups: [],
    particles: [],
    rings: [],
  }
}

function resetGame() {
  state = createInitialState()
  ui.levelUp.hidden = true
  ui.gameOver.hidden = true
  pointer.active = false
  keys.clear()
  updateHud()
  lastFrame = performance.now()
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect()
  const oldWidth = width
  const oldHeight = height

  width = Math.max(320, rect.width)
  height = Math.max(360, rect.height)
  dpr = Math.min(window.devicePixelRatio || 1, 2)
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
    })
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainder = Math.floor(seconds % 60)
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
}

function updateHud() {
  const player = state.player
  const healthPercent = Math.max(0, (player.health / player.maxHealth) * 100)
  ui.healthText.textContent = `${Math.ceil(Math.max(0, player.health))} / ${player.maxHealth}`
  ui.healthBar.style.width = `${healthPercent}%`
  ui.healthBar.classList.toggle('critical', healthPercent <= 30)
  ui.timer.textContent = formatTime(state.elapsed)
  ui.level.textContent = String(state.level).padStart(2, '0')
  ui.gpu.textContent = `${state.gpu} / ${state.gpuNeeded}`
  ui.kills.textContent = String(state.kills).padStart(3, '0')
  ui.damage.textContent = Math.round(player.damage)
  ui.rate.textContent = `${(1 / player.fireInterval).toFixed(1)}/s`
  ui.speed.textContent = Math.round(player.speed)
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
    if (distance > 8) {
      const strength = Math.min(distance / 55, 1)
      x += (dragX / distance) * strength
      y += (dragY / distance) * strength
    }
  }

  const magnitude = Math.hypot(x, y)
  if (magnitude > 1) {
    x /= magnitude
    y /= magnitude
  }

  return { x, y }
}

function randomEnemyType() {
  const difficulty = Math.min(state.elapsed / 150, 1)
  const roll = Math.random()
  if (state.elapsed > 45 && roll < 0.11 + difficulty * 0.09) return 'crusher'
  if (state.elapsed > 16 && roll < 0.34 + difficulty * 0.12) return 'skitter'
  return 'scavenger'
}

function spawnEnemy() {
  const margin = 55
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

  const typeName = randomEnemyType()
  const type = enemyTypes[typeName]
  const healthScale = 1 + Math.min(state.elapsed / 300, 0.55)

  state.enemies.push({
    id: state.nextEntityId++,
    type: typeName,
    x,
    y,
    radius: type.radius,
    speed: type.speed * (0.94 + Math.random() * 0.12),
    health: type.health * healthScale,
    maxHealth: type.health * healthScale,
    damage: type.damage,
    color: type.color,
    score: type.score,
    angle: 0,
    phase: Math.random() * TAU,
    flash: 0,
    dead: false,
  })
}

function findNearestEnemy() {
  let nearest = null
  let nearestDistance = Infinity
  const player = state.player

  for (const enemy of state.enemies) {
    if (enemy.dead) continue
    const dx = enemy.x - player.x
    const dy = enemy.y - player.y
    const distanceSquared = dx * dx + dy * dy
    if (distanceSquared < nearestDistance) {
      nearestDistance = distanceSquared
      nearest = enemy
    }
  }

  return nearest
}

function fireAtNearestEnemy() {
  const target = findNearestEnemy()
  if (!target) return false

  const player = state.player
  const dx = target.x - player.x
  const dy = target.y - player.y
  const distance = Math.hypot(dx, dy) || 1
  const directionX = dx / distance
  const directionY = dy / distance
  player.angle = Math.atan2(directionY, directionX)

  state.bullets.push({
    x: player.x + directionX * 24,
    y: player.y + directionY * 24,
    vx: directionX * player.bulletSpeed,
    vy: directionY * player.bulletSpeed,
    radius: 4,
    damage: player.damage,
    life: 1.25,
    trail: [],
  })

  createMuzzleEffect(
    player.x + directionX * 25,
    player.y + directionY * 25,
    directionX,
    directionY,
  )
  return true
}

function createMuzzleEffect(x, y, dx, dy) {
  state.rings.push({ x, y, radius: 2, maxRadius: 13, life: 0.16, maxLife: 0.16, color: '#65f6ff' })
  for (let i = 0; i < 3; i += 1) {
    const spread = (Math.random() - 0.5) * 1.2
    state.particles.push({
      x,
      y,
      vx: dx * (80 + Math.random() * 90) + spread * 50,
      vy: dy * (80 + Math.random() * 90) + spread * 50,
      size: 1.5 + Math.random() * 2,
      life: 0.16 + Math.random() * 0.12,
      maxLife: 0.28,
      color: '#adfbff',
    })
  }
}

function createHitEffect(x, y, color = '#ffb064', count = 5) {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * TAU
    const speed = 35 + Math.random() * 135
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 1.5 + Math.random() * 3,
      life: 0.18 + Math.random() * 0.28,
      maxLife: 0.46,
      color,
    })
  }
}

function destroyEnemy(enemy) {
  if (enemy.dead) return
  enemy.dead = true
  state.kills += enemy.score
  createHitEffect(enemy.x, enemy.y, enemy.color, enemy.type === 'crusher' ? 16 : 10)
  state.rings.push({
    x: enemy.x,
    y: enemy.y,
    radius: enemy.radius * 0.5,
    maxRadius: enemy.radius * 2.2,
    life: 0.28,
    maxLife: 0.28,
    color: enemy.color,
  })

  const dropChance = enemy.type === 'crusher' ? 0.9 : 0.48
  if (Math.random() < dropChance) {
    state.pickups.push({
      x: enemy.x,
      y: enemy.y,
      vx: (Math.random() - 0.5) * 70,
      vy: (Math.random() - 0.5) * 70,
      radius: 10,
      phase: Math.random() * TAU,
      age: 0,
    })
  }
}

function collectGpu(pickup) {
  pickup.collected = true
  state.gpu += 1
  state.totalGpu += 1
  createHitEffect(pickup.x, pickup.y, '#7dff9b', 12)
  state.rings.push({
    x: pickup.x,
    y: pickup.y,
    radius: 6,
    maxRadius: 42,
    life: 0.36,
    maxLife: 0.36,
    color: '#67f58d',
  })

  if (state.gpu >= state.gpuNeeded) {
    state.gpu -= state.gpuNeeded
    state.level += 1
    state.gpuNeeded = Math.round(state.gpuNeeded * 1.35 + 1)
    openLevelUp()
  }
  updateHud()
}

const upgrades = [
  {
    id: 'fireRate',
    icon: 'FR',
    title: 'Overclock trigger',
    description: 'Reduce delay between ARC pulse shots.',
    current: () => `${(1 / state.player.fireInterval).toFixed(1)} shots/s`,
    next: () => `${(1 / Math.max(0.16, state.player.fireInterval * 0.82)).toFixed(1)} shots/s`,
    apply: () => {
      state.player.fireInterval = Math.max(0.16, state.player.fireInterval * 0.82)
    },
  },
  {
    id: 'damage',
    icon: 'DM',
    title: 'Dense payload',
    description: 'Increase damage dealt by every projectile.',
    current: () => `${Math.round(state.player.damage)} damage`,
    next: () => `${Math.round(state.player.damage + 7)} damage`,
    apply: () => {
      state.player.damage += 7
    },
  },
  {
    id: 'speed',
    icon: 'MV',
    title: 'Vector thrusters',
    description: 'Move faster through the dead zone.',
    current: () => `${Math.round(state.player.speed)} speed`,
    next: () => `${Math.round(state.player.speed + 28)} speed`,
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
  state.mode = 'running'
  ui.levelUp.hidden = true
  updateHud()
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

function updatePlayer(dt) {
  const player = state.player
  const movement = getMovementVector()
  player.x += movement.x * player.speed * dt
  player.y += movement.y * player.speed * dt
  player.x = Math.max(player.radius + 8, Math.min(width - player.radius - 8, player.x))
  player.y = Math.max(player.radius + 8, Math.min(height - player.radius - 8, player.y))
  player.hitCooldown = Math.max(0, player.hitCooldown - dt)
  player.rotorPhase += dt * 8

  if (movement.x || movement.y) {
    player.angle = Math.atan2(movement.y, movement.x)
  }
}

function updateSpawning(dt) {
  state.spawnClock -= dt
  if (state.spawnClock > 0) return

  const spawnInterval = Math.max(0.24, 1.05 - state.elapsed * 0.007)
  const waveSize = state.elapsed > 90 && Math.random() < 0.18 ? 2 : 1
  const maxEnemies = Math.min(150, 42 + Math.floor(state.elapsed * 0.65))

  for (let i = 0; i < waveSize && state.enemies.length < maxEnemies; i += 1) {
    spawnEnemy()
  }
  state.spawnClock = spawnInterval * (0.82 + Math.random() * 0.36)
}

function updateShooting(dt) {
  state.fireClock -= dt
  if (state.fireClock > 0) return
  if (fireAtNearestEnemy()) {
    state.fireClock = state.player.fireInterval
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
    enemy.phase += dt * (enemy.type === 'skitter' ? 9 : 5)
    enemy.flash = Math.max(0, enemy.flash - dt)

    const sway = enemy.type === 'skitter' ? Math.sin(enemy.phase) * 24 : 0
    enemy.x += (directionX * enemy.speed + -directionY * sway) * dt
    enemy.y += (directionY * enemy.speed + directionX * sway) * dt

    const collisionDistance = player.radius + enemy.radius
    if (distance < collisionDistance) {
      const overlap = collisionDistance - distance
      enemy.x -= directionX * overlap * 0.55
      enemy.y -= directionY * overlap * 0.55

      if (player.hitCooldown <= 0) {
        player.health -= enemy.damage
        player.hitCooldown = 0.62
        state.shake = Math.min(14, state.shake + 8)
        createHitEffect(player.x, player.y, '#ff5e54', 12)
        state.rings.push({
          x: player.x,
          y: player.y,
          radius: player.radius,
          maxRadius: player.radius * 2.4,
          life: 0.3,
          maxLife: 0.3,
          color: '#ff554d',
        })
        updateHud()
        if (player.health <= 0) {
          endGame()
          return
        }
      }
    }
  }

  // Mild local separation keeps large swarms readable without expensive all-pairs work.
  for (let i = 0; i < state.enemies.length; i += 1) {
    const enemy = state.enemies[i]
    if (enemy.dead) continue
    for (let j = i + 1; j < Math.min(state.enemies.length, i + 9); j += 1) {
      const other = state.enemies[j]
      if (other.dead) continue
      const dx = other.x - enemy.x
      const dy = other.y - enemy.y
      const distance = Math.hypot(dx, dy) || 1
      const targetDistance = (enemy.radius + other.radius) * 0.72
      if (distance < targetDistance) {
        const push = (targetDistance - distance) * 0.08
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
    bullet.trail.unshift({ x: bullet.x, y: bullet.y })
    if (bullet.trail.length > 4) bullet.trail.pop()
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
        enemy.flash = 0.09
        bullet.life = 0
        createHitEffect(bullet.x, bullet.y, '#ffd077', 4)
        if (enemy.health <= 0) destroyEnemy(enemy)
        break
      }
    }
  }

  state.bullets = state.bullets.filter(
    (bullet) =>
      bullet.life > 0 &&
      bullet.x > -60 &&
      bullet.x < width + 60 &&
      bullet.y > -60 &&
      bullet.y < height + 60,
  )
  state.enemies = state.enemies.filter((enemy) => !enemy.dead)
}

function updatePickups(dt) {
  const player = state.player

  for (const pickup of state.pickups) {
    if (pickup.collected) continue
    pickup.age += dt
    pickup.phase += dt * 3.5
    pickup.vx *= Math.pow(0.08, dt)
    pickup.vy *= Math.pow(0.08, dt)
    pickup.x += pickup.vx * dt
    pickup.y += pickup.vy * dt

    const dx = player.x - pickup.x
    const dy = player.y - pickup.y
    const distance = Math.hypot(dx, dy) || 1
    const magnetRadius = 145
    if (distance < magnetRadius) {
      const pull = (1 - distance / magnetRadius) * 920 + 70
      pickup.x += (dx / distance) * pull * dt
      pickup.y += (dy / distance) * pull * dt
    }

    if (distance < player.radius + pickup.radius + 5) {
      collectGpu(pickup)
    }
  }

  state.pickups = state.pickups.filter((pickup) => !pickup.collected)
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

  for (const ring of state.rings) {
    ring.life -= dt
    const progress = 1 - ring.life / ring.maxLife
    ring.currentRadius = ring.radius + (ring.maxRadius - ring.radius) * progress
  }
  state.rings = state.rings.filter((ring) => ring.life > 0)
  state.shake = Math.max(0, state.shake - dt * 24)
}

function update(dt) {
  if (state.mode !== 'running') {
    updateEffects(dt)
    return
  }

  state.elapsed += dt
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
  const bob = Math.sin(pickup.phase) * 3
  const x = pickup.x
  const y = pickup.y + bob
  const pulse = 1 + Math.sin(pickup.phase * 1.6) * 0.12

  ctx.save()
  ctx.translate(x, y)
  ctx.scale(pulse, pulse)
  ctx.shadowColor = '#63ff91'
  ctx.shadowBlur = 18
  ctx.fillStyle = 'rgba(67, 245, 116, 0.16)'
  ctx.beginPath()
  ctx.arc(0, 0, 18, 0, TAU)
  ctx.fill()
  ctx.shadowBlur = 10
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
  ctx.restore()
}

function drawEnemy(enemy) {
  const healthRatio = Math.max(0, enemy.health / enemy.maxHealth)
  ctx.save()
  ctx.translate(enemy.x, enemy.y)
  ctx.rotate(enemy.angle)

  ctx.shadowColor = enemy.color
  ctx.shadowBlur = enemy.flash > 0 ? 22 : 7
  ctx.strokeStyle = enemy.flash > 0 ? '#fff3dc' : enemy.color
  ctx.fillStyle = enemy.flash > 0 ? '#fff1d1' : '#251d1c'
  ctx.lineWidth = 2

  if (enemy.type === 'skitter') {
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
    if (enemy.type === 'crusher') {
      ctx.strokeStyle = '#7e3931'
      ctx.strokeRect(-radius * 0.42, -radius * 0.88, radius * 0.82, radius * 1.76)
    }
  }

  ctx.fillStyle = '#ffcf70'
  ctx.shadowColor = '#ff8c43'
  ctx.shadowBlur = 12
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
    if (bullet.trail.length > 1) {
      const last = bullet.trail[bullet.trail.length - 1]
      const gradient = ctx.createLinearGradient(last.x, last.y, bullet.x, bullet.y)
      gradient.addColorStop(0, 'rgba(96, 238, 255, 0)')
      gradient.addColorStop(1, 'rgba(150, 250, 255, 0.85)')
      ctx.strokeStyle = gradient
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(last.x, last.y)
      ctx.lineTo(bullet.x, bullet.y)
      ctx.stroke()
    }
    ctx.shadowColor = '#75f5ff'
    ctx.shadowBlur = 14
    ctx.fillStyle = '#d6fdff'
    ctx.beginPath()
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, TAU)
    ctx.fill()
    ctx.shadowBlur = 0
  }
}

function drawPlayer() {
  const player = state.player
  const moving = getMovementVector()
  const tilt = moving.x * 0.07
  const hitVisible = player.hitCooldown <= 0 || Math.floor(player.hitCooldown * 18) % 2 === 0
  if (!hitVisible) return

  ctx.save()
  ctx.translate(player.x, player.y)
  ctx.rotate(player.angle + tilt)

  ctx.globalAlpha = 0.35
  ctx.fillStyle = '#65f5ff'
  ctx.shadowColor = '#5befff'
  ctx.shadowBlur = 18
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
    ctx.shadowBlur = 8
    ctx.fillRect(
      particle.x - particle.size / 2,
      particle.y - particle.size / 2,
      particle.size,
      particle.size,
    )
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
}

function gameLoop(now) {
  const dt = Math.min((now - lastFrame) / 1000, 0.033)
  lastFrame = now
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

canvas.addEventListener('pointerdown', (event) => {
  if (state.mode !== 'running') return
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
