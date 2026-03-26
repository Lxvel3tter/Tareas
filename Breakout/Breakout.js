/*
 * Breakout — basado en el código de Pong
 *
 * Controles:
 *   ← → / A D   Mover paleta
 *   ESPACIO      Lanzar pelota
 *   P            Pausar / reanudar
 */
"use strict";

// Global variables
const canvasWidth  = 800;
const canvasHeight = 600;

let ctx;
let game;
let oldTime = 0;

let paddleSpeed = 0.5;
let ballSpeed   = 0.4;

// Configuración de bloques (modificable)
const BLOCK_COLS    = 10;
const BLOCK_ROWS    = 5;
const BLOCK_PADDING = 6;
const BLOCK_TOP_OFF = 80;
const BLOCK_AREA_H  = 200;
const MAX_LIVES     = 3;

const ROW_COLORS = [
    "#ff2d78",
    "#ff7b00",
    "#ffe600",
    "#00ffcc",
    "#4d9fff",
];

// ─── Ball ────────────────────────────────────────────────────────────────────
class Ball extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "ball");
        this.velocity = new Vector(0, 0);
        this.served   = false;
    }

    update(deltaTime) {
        if (!this.served) return;
        this.velocity = this.velocity.normalize().times(ballSpeed);
        this.position = this.position.plus(this.velocity.times(deltaTime));
    }

    reset() {
        this.position = new Vector(canvasWidth / 2, canvasHeight - 60);
        this.velocity = new Vector(0, 0);
        this.served   = false;
    }

    serve() {
        if (this.served) return;
        let angle = Math.random() * Math.PI / 2 - (Math.PI / 4);
        this.velocity.x =  Math.cos(angle);
        this.velocity.y = -Math.abs(Math.sin(angle));
        this.served = true;
    }
}

// ─── Paddle ──────────────────────────────────────────────────────────────────
class Paddle extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "paddle");
        this.velocity = new Vector(0, 0);
        this.keys     = [];
    }

    update(deltaTime) {
        this.velocity.x = 0;
        this.velocity.y = 0;

        if (this.keys.includes("left"))  this.velocity.x = -1;
        if (this.keys.includes("right")) this.velocity.x =  1;

        this.velocity = this.velocity.normalize().times(paddleSpeed);
        this.position = this.position.plus(this.velocity.times(deltaTime));

        if (this.position.x - this.halfSize.x < 0)
            this.position.x = this.halfSize.x;
        if (this.position.x + this.halfSize.x > canvasWidth)
            this.position.x = canvasWidth - this.halfSize.x;
    }
}

// ─── Block ───────────────────────────────────────────────────────────────────
class Block extends GameObject {
    constructor(position, width, height, color, points) {
        super(position, width, height, color, "block");
        this.points = points;
    }

    draw(ctx) {
        const x = this.position.x - this.halfSize.x + 2;
        const y = this.position.y - this.halfSize.y + 2;
        const w = this.size.x - 4;
        const h = this.size.y - 4;

        ctx.fillStyle   = this.color;
        ctx.fillRect(x, y, w, h);

        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.lineWidth   = 1;
        ctx.strokeRect(x, y, w, h);
    }
}

// ─── Game ─────────────────────────────────────────────────────────────────────
class Game {
    constructor() {
        this.lives     = MAX_LIVES;
        this.destroyed = 0;
        this.level     = 1;
        this.paused    = false;
        this.state     = "playing";

        this.initObjects();
        this.createEventListeners();

        // TextLabels dentro del canvas — igual que Pong
        this.livesText     = new TextLabel(70,  30, "20px Verdana", "white");
        this.destroyedText = new TextLabel(canvasWidth / 2, 30, "20px Verdana", "white");
    }

    initObjects() {
        this.paddle = new Paddle(
            new Vector(canvasWidth / 2, canvasHeight - 30),
            120, 14, "white"
        );

        this.ball = new Ball(
            new Vector(canvasWidth / 2, canvasHeight - 60),
            14, 14, "white"
        );

        this.barrierLeft  = new GameObject(new Vector(0, canvasHeight / 2), 1, canvasHeight, "");
        this.barrierRight = new GameObject(new Vector(canvasWidth, canvasHeight / 2), 1, canvasHeight, "");
        this.barrierTop   = new GameObject(new Vector(canvasWidth / 2, 0), canvasWidth, 1, "");

        this.initBlocks();
    }

    initBlocks() {
        this.blocks = [];
        const bw = (canvasWidth  - BLOCK_PADDING * (BLOCK_COLS + 1)) / BLOCK_COLS;
        const bh = (BLOCK_AREA_H - BLOCK_PADDING * (BLOCK_ROWS + 1)) / BLOCK_ROWS;

        for (let row = 0; row < BLOCK_ROWS; row++) {
            for (let col = 0; col < BLOCK_COLS; col++) {
                const x = BLOCK_PADDING + col * (bw + BLOCK_PADDING) + bw / 2;
                const y = BLOCK_TOP_OFF + BLOCK_PADDING + row * (bh + BLOCK_PADDING) + bh / 2;
                const color  = ROW_COLORS[row % ROW_COLORS.length];
                const points = BLOCK_ROWS - row;
                this.blocks.push(new Block(new Vector(x, y), bw, bh, color, points));
            }
        }
    }

    showOverlay(msg) {
        document.getElementById("overlayMessage").textContent = msg;
        document.getElementById("overlay").classList.add("visible");
    }

    hideOverlay() {
        document.getElementById("overlay").classList.remove("visible");
    }

    loseLife() {
        this.lives--;
        if (this.lives <= 0) {
            this.state = "gameover";
            this.showOverlay("GAME OVER");
        } else {
            this.ball.reset();
        }
    }

    nextLevel() {
        this.level++;
        ballSpeed += 0.05;
        this.initBlocks();
        this.ball.reset();
    }

    restart() {
        this.lives     = MAX_LIVES;
        this.destroyed = 0;
        this.level     = 1;
        this.state     = "playing";
        ballSpeed      = 0.4;
        this.initBlocks();
        this.ball.reset();
        this.hideOverlay();
    }

    update(deltaTime) {
        if (this.paused || this.state !== "playing") return;

        this.paddle.update(deltaTime);
        this.ball.update(deltaTime);

        if (!this.ball.served) return;

        // Rebote lateral — igual que Pong
        if (boxOverlap(this.ball, this.barrierLeft) || boxOverlap(this.ball, this.barrierRight)) {
            this.ball.velocity.x *= -1;
        }

        // Rebote superior — igual que Pong
        if (boxOverlap(this.ball, this.barrierTop)) {
            this.ball.velocity.y *= -1;
        }

        // Borde inferior → perder vida
        if (this.ball.position.y - this.ball.halfSize.y > canvasHeight) {
            this.loseLife();
            return;
        }

        // Rebote en paleta — igual que Pong
        if (boxOverlap(this.ball, this.paddle)) {
            this.ball.velocity.y *= -1;
        }

        // Colisión con bloques
        for (let i = this.blocks.length - 1; i >= 0; i--) {
            const block = this.blocks[i];
            if (!boxOverlap(this.ball, block)) continue;

            const overlapX = (this.ball.halfSize.x + block.halfSize.x) -
                             Math.abs(this.ball.position.x - block.position.x);
            const overlapY = (this.ball.halfSize.y + block.halfSize.y) -
                             Math.abs(this.ball.position.y - block.position.y);

            if (overlapX < overlapY) {
                this.ball.velocity.x *= -1;
            } else {
                this.ball.velocity.y *= -1;
            }

            this.blocks.splice(i, 1);
            this.destroyed++;
            break;
        }

        // ¿Todos destruidos?
        if (this.blocks.length === 0) {
            if (this.level >= 3) {
                this.state = "win";
                this.showOverlay("¡GANASTE! 🎉");
            } else {
                this.nextLevel();
            }
        }
    }

    draw(ctx) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // HUD dentro del canvas
        this.livesText.draw(ctx,     `Vidas: ${this.lives}`);
        this.destroyedText.draw(ctx, `Bloques: ${this.destroyed}`);

        // Línea divisoria
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth   = 1;
        ctx.beginPath();
        ctx.moveTo(0, 45);
        ctx.lineTo(canvasWidth, 45);
        ctx.stroke();

        for (const b of this.blocks) b.draw(ctx);
        this.paddle.draw(ctx);
        this.ball.draw(ctx);

        // Pausa
        if (this.paused && this.state === "playing") {
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            ctx.font      = "bold 48px Verdana, sans-serif";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("PAUSA", canvasWidth / 2, canvasHeight / 2);
        }
    }

    createEventListeners() {
        window.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft"  || event.key === "a")
                this.addKey("left",  this.paddle);
            if (event.key === "ArrowRight" || event.key === "d")
                this.addKey("right", this.paddle);
            if (event.code === "Space") {
                event.preventDefault();
                if (this.state === "playing") this.ball.serve();
            }
            if (event.key === "p" || event.key === "P") {
                if (this.state === "playing") this.paused = !this.paused;
            }
        });

        window.addEventListener("keyup", (event) => {
            if (event.key === "ArrowLeft"  || event.key === "a")
                this.delKey("left",  this.paddle);
            if (event.key === "ArrowRight" || event.key === "d")
                this.delKey("right", this.paddle);
        });

        document.getElementById("overlayButton").addEventListener("click", () => {
            this.restart();
        });
    }

    addKey(direction, paddle) {
        if (!paddle.keys.includes(direction))
            paddle.keys.push(direction);
    }

    delKey(direction, paddle) {
        const i = paddle.keys.indexOf(direction);
        if (i !== -1) paddle.keys.splice(i, 1);
    }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function main() {
    const canvas  = document.getElementById("canvas");
    canvas.width  = canvasWidth;
    canvas.height = canvasHeight;
    ctx           = canvas.getContext("2d");
    game          = new Game();
    drawScene(0);
}

function drawScene(newTime) {
    let deltaTime = newTime - oldTime;
    game.update(deltaTime);
    game.draw(ctx);
    oldTime = newTime;
    requestAnimationFrame(drawScene);
}