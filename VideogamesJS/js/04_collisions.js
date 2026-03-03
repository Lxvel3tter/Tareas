/*
 * Detection of collisions between boxes
 *
 * Gilberto Echeverria
 * 2025-03-13
 */

"use strict";

// Global variables
const canvasWidth = 800;
const canvasHeight = 600;

// Context of the Canvas
let ctx;

// A variable to store the game object
let game;

// Variable to store the time at the previous frame
let oldTime = 0;

let playerSpeed = 0.5;

// Class for the main character in the game
class Player extends GameObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "player", sheetCols);
        this.velocity = new Vector(0, 0);
    }

    update(deltaTime) {
        //normalize the velocity vector to use the same speed on the diagnals
        this.velocity = this.velocity.normalize().times(playerSpeed);
        this.position = this.position.plus(this.velocity.times(deltaTime));

        this.clampWithinCanvas();
    }

    clampWithinCanvas() {
        //le quitamos los else para que pueda revisar todas las condicionales y no solo una
        if (this.position.y - this.halfSize.y < 0) {  //top border
            this.position.y = this.halfSize.y;

        } if (this.position.y + this.halfSize.y > canvasHeight) {  //left border
            this.position.y = canvasHeight - this.halfSize.y;

        } if (this.position.x - this.halfSize.x < 0) {  //bottom border
            this.position.x = this.halfSize.x;

        } if (this.position.x + this.halfSize.x  > canvasWidth) {  //right border
            this.position.x = canvasWidth - this.halfSize.x;
        }
    }
}


// Class to keep track of all the events and objects in the game
class Game {
    constructor() {
        this.createEventListeners();
        this.initObjects();
    }

    initObjects() {
        this.player = new Player(new Vector(canvasWidth / 2, canvasHeight / 2), 60, 60, "red");

        this.actors = [];
        const box1 = new GameObject(new Vector(300, 300), 80, 80, "grey");
        this.actors.push(box1);
        const box2 = new GameObject(new Vector(600, 500), 80, 80, "grey");
        this.actors.push(box2);
    }

    draw(ctx) {
        for (let actor of this.actors) {
            actor.draw(ctx);
        }
        this.player.draw(ctx);
    }

    update(deltaTime) {
        // Move the player
        this.player.update(deltaTime);

        // Check collision against other objects
        
        for (let actor of this.actors) {
            if (boxOverlap(this.player, actor)){
                actor.color = "yellow";
            } else {
                actor.color = "grey";
            }
        }
    }

    createEventListeners() {
        // Simple mechanic for the movement of a character
        // It breaks if multiple keys are pressed simultaneously
        window.addEventListener('keydown', (event) => {
            if (event.key == 'ArrowUp') {
                this.player.velocity.y = -1;
            } else if (event.key == 'ArrowLeft') {
                this.player.velocity.x = -1;
            } else if (event.key == 'ArrowDown') {
                this.player.velocity.y = 1;
            } else if (event.key == 'ArrowRight') {
                this.player.velocity.x = 1;
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.key == 'ArrowUp') {
                this.player.velocity.y = 0;
            } else if (event.key == 'ArrowLeft') {
                this.player.velocity.x = 0;
            } else if (event.key == 'ArrowDown') {
                this.player.velocity.y = 0;
            } else if (event.key == 'ArrowRight') {
                this.player.velocity.x = 0;
            }
        });
    }
}


// Starting function that will be called from the HTML page
function main() {
    // Get a reference to the object with id 'canvas' in the page
    const canvas = document.getElementById('canvas');
    // Resize the element
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Get the context for drawing in 2D
    ctx = canvas.getContext('2d');

    // Create the game object
    game = new Game();

    drawScene(0);
}


// Main loop function to be called once per frame
function drawScene(newTime) {
    // Compute the time elapsed since the last frame, in milliseconds
    // TODO: Compute the correct value for deltaTime, using newTime and oldTime
    let deltaTime = newTime - oldTime;

    // Clean the canvas so we can draw everything again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    game.update(deltaTime);

    game.draw(ctx);

    oldTime = newTime;
    requestAnimationFrame(drawScene);
}