// Pure Snake logic — no three/React imports so it stays testable in isolation
// and importable from both the canvas tree (screen) and the DOM tree (d-pad).

export type Direction = 'up' | 'down' | 'left' | 'right'
export type SnakeStatus = 'attract' | 'running' | 'paused' | 'over'

export interface Cell {
  x: number
  y: number
}

export const COLS = 22
export const ROWS = 17
export const TICK_MS = 110

const START_LENGTH = 3
const HIGH_SCORE_KEY = 'snakeHighScore'

const OPPOSITE: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
}

const DELTA: Record<Direction, Cell> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

const readHighScore = (): number => {
  try {
    const value = Number.parseInt(localStorage.getItem(HIGH_SCORE_KEY) ?? '', 10)
    return Number.isFinite(value) && value > 0 ? value : 0
  } catch {
    return 0
  }
}

const writeHighScore = (score: number) => {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(score))
  } catch {
    /* private mode: the high score lives only for this visit */
  }
}

export class SnakeEngine {
  status: SnakeStatus = 'attract'
  /** Head first. */
  snake: Cell[] = []
  food: Cell = { x: 0, y: 0 }
  direction: Direction = 'right'
  score = 0
  highScore = readHighScore()
  /** Monotonic per run; cheap repaint key for the renderer. */
  ticks = 0
  /** Wakes the render loop after out-of-frame input (d-pad, key, visibility). */
  wake: () => void = () => {}

  private queue: Direction[] = []
  private readonly random: () => number

  constructor(random: () => number = Math.random) {
    this.random = random
  }

  start() {
    const y = Math.floor(ROWS / 2)
    this.snake = Array.from({ length: START_LENGTH }, (_, i) => ({ x: 5 - i, y }))
    this.direction = 'right'
    this.queue = []
    this.score = 0
    this.ticks = 0
    this.status = 'running'
    this.placeFood()
    this.wake()
  }

  /** Direction input: steers a run, continues a paused one, starts a fresh one. */
  input(direction: Direction) {
    if (this.status === 'running') this.enqueue(direction)
    else if (this.status === 'paused') this.status = 'running'
    else this.start()
    this.wake()
  }

  /** Start/confirm input (Enter, Space, d-pad center). */
  pressStart() {
    if (this.status === 'paused') this.status = 'running'
    else if (this.status !== 'running') this.start()
    this.wake()
  }

  pause() {
    if (this.status === 'running') this.status = 'paused'
    this.wake()
  }

  reset() {
    this.status = 'attract'
    this.snake = []
    this.score = 0
    this.queue = []
  }

  tick() {
    if (this.status !== 'running') return
    this.ticks += 1
    const queued = this.queue.shift()
    if (queued) this.direction = queued
    const head = this.snake[0]
    const next = { x: head.x + DELTA[this.direction].x, y: head.y + DELTA[this.direction].y }
    const eats = next.x === this.food.x && next.y === this.food.y
    // moving into the tail cell is legal when the tail vacates it this tick
    const body = eats ? this.snake : this.snake.slice(0, -1)
    const hitsWall = next.x < 0 || next.x >= COLS || next.y < 0 || next.y >= ROWS
    if (hitsWall || body.some((c) => c.x === next.x && c.y === next.y)) {
      this.status = 'over'
      return
    }
    this.snake.unshift(next)
    if (eats) {
      this.score += 1
      if (this.score > this.highScore) {
        this.highScore = this.score
        writeHighScore(this.highScore)
      }
      this.placeFood()
    } else {
      this.snake.pop()
    }
  }

  private enqueue(direction: Direction) {
    const reference = this.queue[this.queue.length - 1] ?? this.direction
    if (direction === reference || direction === OPPOSITE[reference]) return
    if (this.queue.length < 2) this.queue.push(direction)
  }

  private placeFood() {
    const free: Cell[] = []
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (!this.snake.some((c) => c.x === x && c.y === y)) free.push({ x, y })
      }
    }
    if (free.length === 0) {
      this.status = 'over'
      return
    }
    this.food = free[Math.floor(this.random() * free.length)]
  }
}

export const snakeEngine = new SnakeEngine()
