const SOUND_PREFERENCE_KEY = 'danger-close-sound-v1'
const MAX_ACTIVE_SOUNDS = 7
const SOUND_SETTINGS = {
  arcShot: [0.11, 0.07],
  explosion: [0.075, 0.34],
  explosionLarge: [0.28, 0.72],
  enemyHit: [0.12, 0.045],
  enemyDestroyed: [0.12, 0.14],
  pickupGpu: [0.045, 0.16],
  pickupScrap: [0.045, 0.09],
  pickupBattery: [0.06, 0.2],
  pickupReactor: [0.2, 0.35],
  levelUp: [0.4, 0.5],
  upgradeConfirm: [0.08, 0.12],
  emp: [0.3, 0.42],
  orbitUnlock: [0.2, 0.3],
  obstacleMetal: [0.12, 0.2],
  obstacleElectric: [0.12, 0.2],
  obstacleReactor: [0.16, 0.3],
  obstacleData: [0.12, 0.22],
  extractionReady: [0.5, 0.38],
  extractionCalled: [0.5, 0.45],
  extractionTick: [0.7, 0.08],
  victory: [1, 0.7],
  gameOver: [1, 0.65],
  titanDetected: [1, 0.7],
  titanHit: [0.14, 0.1],
  titanDestroyed: [1, 0.8],
  playerShieldHit: [0.16, 0.11],
  playerHullHit: [0.16, 0.14],
}

function loadSoundPreference() {
  try {
    return window.localStorage.getItem(SOUND_PREFERENCE_KEY) !== 'off'
  } catch {
    return true
  }
}

function saveSoundPreference(enabled) {
  try {
    window.localStorage.setItem(
      SOUND_PREFERENCE_KEY,
      enabled ? 'on' : 'off',
    )
  } catch {
    // Audio remains usable for this session when storage is unavailable.
  }
}

// One lazily-created context and a small voice cap keep generated effects cheap
// on mobile. Each named sound also has its own anti-spam cooldown.
export function createAudioManager() {
  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext
  const available = Boolean(AudioContextClass)
  const lastPlayed = new Map()
  let enabled = loadSoundPreference()
  let context = null
  let masterGain = null
  let noiseBuffer = null
  let activeSounds = 0
  let paused = false

  function applyMasterLevel() {
    if (!context || !masterGain) return
    masterGain.gain.cancelScheduledValues(context.currentTime)
    masterGain.gain.setTargetAtTime(
      enabled && !paused ? 0.62 : 0.0001,
      context.currentTime,
      0.012,
    )
  }

  function ensureContext() {
    if (!available || !enabled) return null
    try {
      if (!context) {
        context = new AudioContextClass()
        masterGain = context.createGain()
        masterGain.gain.value = paused ? 0.0001 : 0.62
        masterGain.connect(context.destination)

        const sampleCount = Math.ceil(context.sampleRate * 0.35)
        noiseBuffer = context.createBuffer(1, sampleCount, context.sampleRate)
        const samples = noiseBuffer.getChannelData(0)
        for (let index = 0; index < samples.length; index += 1) {
          samples[index] = Math.random() * 2 - 1
        }
      }
      if (context.state !== 'running' && context.state !== 'closed') {
        context.resume().catch(() => {})
      }
      return context
    } catch {
      return null
    }
  }

  function unlock() {
    ensureContext()
  }

  function setEnabled(nextEnabled) {
    enabled = available && Boolean(nextEnabled)
    saveSoundPreference(enabled)
    if (enabled) {
      ensureContext()
    }
    applyMasterLevel()
    return enabled
  }

  function toggle() {
    return setEnabled(!enabled)
  }

  function beginSound(name, cooldown, duration) {
    const audioContext = ensureContext()
    if (!audioContext || !masterGain || audioContext.state === 'closed') {
      return null
    }

    const now = performance.now()
    const lastTime = lastPlayed.get(name) || -Infinity
    if (now - lastTime < cooldown * 1000) return null
    if (activeSounds >= MAX_ACTIVE_SOUNDS) return null

    lastPlayed.set(name, now)
    activeSounds += 1
    window.setTimeout(() => {
      activeSounds = Math.max(0, activeSounds - 1)
    }, Math.ceil((duration + 0.08) * 1000))
    return audioContext
  }

  function tone({
    frequency,
    endFrequency = frequency,
    duration,
    gain,
    type = 'sine',
    delay = 0,
  }) {
    if (!context || !masterGain) return
    const start = context.currentTime + delay
    const oscillator = context.createOscillator()
    const envelope = context.createGain()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(Math.max(20, frequency), start)
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(20, endFrequency),
      start + duration,
    )
    envelope.gain.setValueAtTime(0.0001, start)
    envelope.gain.exponentialRampToValueAtTime(
      Math.max(0.0002, gain),
      start + Math.min(0.012, duration * 0.25),
    )
    envelope.gain.exponentialRampToValueAtTime(
      0.0001,
      start + duration,
    )
    oscillator.connect(envelope)
    envelope.connect(masterGain)
    oscillator.start(start)
    oscillator.stop(start + duration + 0.015)
  }

  function noise({
    duration,
    gain,
    frequency = 1200,
    filterType = 'lowpass',
    delay = 0,
  }) {
    if (!context || !masterGain || !noiseBuffer) return
    const start = context.currentTime + delay
    const source = context.createBufferSource()
    const filter = context.createBiquadFilter()
    const envelope = context.createGain()
    source.buffer = noiseBuffer
    filter.type = filterType
    filter.frequency.setValueAtTime(frequency, start)
    envelope.gain.setValueAtTime(Math.max(0.0002, gain), start)
    envelope.gain.exponentialRampToValueAtTime(
      0.0001,
      start + duration,
    )
    source.connect(filter)
    filter.connect(envelope)
    envelope.connect(masterGain)
    const maxOffset = Math.max(0, noiseBuffer.duration - duration)
    source.start(start, Math.random() * maxOffset, duration)
  }

  function play(name) {
    const settings = SOUND_SETTINGS[name]
    if (!settings || !beginSound(name, settings[0], settings[1])) {
      return false
    }

    switch (name) {
      case 'arcShot':
        noise({
          duration: 0.028,
          gain: 0.022,
          frequency: 3100,
          filterType: 'bandpass',
        })
        tone({
          frequency: 980,
          endFrequency: 470,
          duration: 0.065,
          gain: 0.022,
          type: 'triangle',
        })
        tone({
          frequency: 138,
          endFrequency: 76,
          duration: 0.09,
          gain: 0.02,
          type: 'sawtooth',
        })
        break
      case 'explosion':
        noise({ duration: 0.16, gain: 0.05, frequency: 1200 })
        noise({
          duration: 0.24,
          gain: 0.022,
          frequency: 460,
          delay: 0.055,
        })
        tone({
          frequency: 128,
          endFrequency: 43,
          duration: 0.28,
          gain: 0.045,
          type: 'sawtooth',
        })
        tone({
          frequency: 72,
          endFrequency: 38,
          duration: 0.22,
          gain: 0.025,
          delay: 0.08,
        })
        break
      case 'explosionLarge':
        noise({ duration: 0.34, gain: 0.075, frequency: 980 })
        noise({
          duration: 0.5,
          gain: 0.028,
          frequency: 360,
          delay: 0.12,
        })
        tone({
          frequency: 94,
          endFrequency: 28,
          duration: 0.62,
          gain: 0.072,
          type: 'sawtooth',
        })
        tone({
          frequency: 210,
          endFrequency: 74,
          duration: 0.24,
          gain: 0.032,
          type: 'square',
        })
        tone({
          frequency: 58,
          endFrequency: 30,
          duration: 0.42,
          gain: 0.034,
          delay: 0.2,
        })
        break
      case 'enemyHit':
        noise({ duration: 0.032, gain: 0.018, frequency: 2300 })
        tone({
          frequency: 240,
          endFrequency: 150,
          duration: 0.038,
          gain: 0.012,
          type: 'square',
        })
        break
      case 'enemyDestroyed':
        noise({ duration: 0.105, gain: 0.046, frequency: 1100 })
        tone({
          frequency: 170,
          endFrequency: 68,
          duration: 0.12,
          gain: 0.034,
          type: 'sawtooth',
        })
        break
      case 'pickupGpu':
        tone({ frequency: 880, endFrequency: 1320, duration: 0.09, gain: 0.035 })
        tone({
          frequency: 1320,
          endFrequency: 1680,
          duration: 0.065,
          gain: 0.025,
          delay: 0.07,
        })
        break
      case 'pickupScrap':
        noise({
          duration: 0.05,
          gain: 0.025,
          frequency: 3400,
          filterType: 'bandpass',
        })
        tone({
          frequency: 610,
          endFrequency: 270,
          duration: 0.065,
          gain: 0.022,
          type: 'triangle',
        })
        break
      case 'pickupBattery':
        tone({ frequency: 240, endFrequency: 540, duration: 0.18, gain: 0.038 })
        tone({
          frequency: 480,
          endFrequency: 720,
          duration: 0.1,
          gain: 0.018,
          delay: 0.08,
        })
        break
      case 'pickupReactor':
        tone({
          frequency: 150,
          endFrequency: 62,
          duration: 0.32,
          gain: 0.05,
          type: 'sawtooth',
        })
        tone({
          frequency: 420,
          endFrequency: 690,
          duration: 0.2,
          gain: 0.03,
          delay: 0.08,
        })
        break
      case 'levelUp':
        tone({ frequency: 440, endFrequency: 520, duration: 0.14, gain: 0.035 })
        tone({
          frequency: 660,
          endFrequency: 760,
          duration: 0.14,
          gain: 0.034,
          delay: 0.12,
        })
        tone({
          frequency: 880,
          endFrequency: 1040,
          duration: 0.2,
          gain: 0.04,
          delay: 0.24,
        })
        break
      case 'upgradeConfirm':
        tone({
          frequency: 620,
          endFrequency: 880,
          duration: 0.1,
          gain: 0.032,
          type: 'triangle',
        })
        break
      case 'emp':
        tone({
          frequency: 130,
          endFrequency: 42,
          duration: 0.38,
          gain: 0.055,
          type: 'sine',
        })
        noise({
          duration: 0.22,
          gain: 0.025,
          frequency: 900,
          filterType: 'bandpass',
        })
        break
      case 'orbitUnlock':
        tone({
          frequency: 680,
          endFrequency: 1180,
          duration: 0.14,
          gain: 0.035,
          type: 'triangle',
        })
        tone({
          frequency: 920,
          endFrequency: 1380,
          duration: 0.12,
          gain: 0.025,
          delay: 0.12,
        })
        break
      case 'obstacleMetal':
        noise({
          duration: 0.16,
          gain: 0.055,
          frequency: 1900,
          filterType: 'bandpass',
        })
        tone({
          frequency: 240,
          endFrequency: 90,
          duration: 0.16,
          gain: 0.035,
          type: 'square',
        })
        break
      case 'obstacleElectric':
        noise({
          duration: 0.18,
          gain: 0.04,
          frequency: 2800,
          filterType: 'highpass',
        })
        tone({
          frequency: 980,
          endFrequency: 280,
          duration: 0.17,
          gain: 0.032,
          type: 'sawtooth',
        })
        break
      case 'obstacleReactor':
        tone({
          frequency: 190,
          endFrequency: 75,
          duration: 0.27,
          gain: 0.05,
          type: 'sawtooth',
        })
        tone({
          frequency: 620,
          endFrequency: 440,
          duration: 0.12,
          gain: 0.024,
          delay: 0.04,
        })
        break
      case 'obstacleData':
        noise({
          duration: 0.1,
          gain: 0.036,
          frequency: 2600,
          filterType: 'bandpass',
        })
        tone({
          frequency: 1240,
          endFrequency: 260,
          duration: 0.08,
          gain: 0.034,
          type: 'square',
        })
        tone({
          frequency: 360,
          endFrequency: 920,
          duration: 0.09,
          gain: 0.022,
          delay: 0.09,
        })
        break
      case 'extractionReady':
        tone({ frequency: 520, endFrequency: 660, duration: 0.16, gain: 0.035 })
        tone({
          frequency: 780,
          endFrequency: 980,
          duration: 0.2,
          gain: 0.04,
          delay: 0.14,
        })
        break
      case 'extractionCalled':
        tone({ frequency: 190, endFrequency: 260, duration: 0.22, gain: 0.045 })
        tone({
          frequency: 520,
          endFrequency: 720,
          duration: 0.18,
          gain: 0.03,
          delay: 0.18,
        })
        break
      case 'extractionTick':
        tone({
          frequency: 760,
          endFrequency: 650,
          duration: 0.055,
          gain: 0.022,
          type: 'square',
        })
        break
      case 'victory':
        tone({ frequency: 392, endFrequency: 440, duration: 0.2, gain: 0.04 })
        tone({
          frequency: 587,
          endFrequency: 660,
          duration: 0.22,
          gain: 0.04,
          delay: 0.16,
        })
        tone({
          frequency: 784,
          endFrequency: 1046,
          duration: 0.3,
          gain: 0.05,
          delay: 0.32,
        })
        break
      case 'gameOver':
        tone({
          frequency: 360,
          endFrequency: 180,
          duration: 0.28,
          gain: 0.045,
          type: 'sawtooth',
        })
        tone({
          frequency: 170,
          endFrequency: 55,
          duration: 0.38,
          gain: 0.04,
          delay: 0.22,
        })
        break
      case 'titanDetected':
        tone({
          frequency: 180,
          endFrequency: 150,
          duration: 0.24,
          gain: 0.05,
          type: 'square',
        })
        tone({
          frequency: 180,
          endFrequency: 150,
          duration: 0.24,
          gain: 0.05,
          type: 'square',
          delay: 0.32,
        })
        break
      case 'titanHit':
        noise({ duration: 0.075, gain: 0.038, frequency: 700 })
        tone({
          frequency: 115,
          endFrequency: 65,
          duration: 0.08,
          gain: 0.035,
          type: 'square',
        })
        break
      case 'titanDestroyed':
        noise({ duration: 0.32, gain: 0.075, frequency: 850 })
        tone({
          frequency: 105,
          endFrequency: 36,
          duration: 0.5,
          gain: 0.07,
          type: 'sawtooth',
        })
        tone({
          frequency: 330,
          endFrequency: 760,
          duration: 0.32,
          gain: 0.04,
          delay: 0.28,
        })
        break
      case 'playerShieldHit':
        tone({
          frequency: 430,
          endFrequency: 180,
          duration: 0.1,
          gain: 0.04,
          type: 'triangle',
        })
        break
      case 'playerHullHit':
        noise({ duration: 0.11, gain: 0.05, frequency: 900 })
        tone({
          frequency: 125,
          endFrequency: 58,
          duration: 0.12,
          gain: 0.045,
          type: 'sawtooth',
        })
        break
      default:
        return false
    }
    return true
  }

  function handleVisibility(hidden) {
    if (!context) return
    try {
      if (hidden) context.suspend().catch(() => {})
      else if (enabled) context.resume().catch(() => {})
    } catch {
      // Visibility audio transitions are best-effort.
    }
  }

  function setPaused(nextPaused) {
    paused = Boolean(nextPaused)
    applyMasterLevel()
  }

  return {
    isAvailable: () => available,
    isEnabled: () => enabled,
    unlock,
    toggle,
    play,
    setPaused,
    handleVisibility,
  }
}

const hapticTimes = new Map()

export function triggerHaptic(pattern, key, cooldown = 120) {
  if (
    typeof navigator.vibrate !== 'function' ||
    navigator.maxTouchPoints <= 0 ||
    document.hidden
  ) {
    return
  }
  const now = performance.now()
  if (now - (hapticTimes.get(key) || -Infinity) < cooldown) return
  hapticTimes.set(key, now)
  try {
    navigator.vibrate(pattern)
  } catch {
    // Vibration support varies; feedback must never affect gameplay.
  }
}
