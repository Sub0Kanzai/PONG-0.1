// Initialize the canvas and context with dynamic resolution
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Dynamically set canvas resolution to match browser window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Constants and variables
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const paddleWidth = 25;
const paddleHeight = 100;
const paddleSpeed = 20; // Increased paddle speed
let playerY = HEIGHT / 2 - paddleHeight / 2;
let opponentY = HEIGHT / 2 - paddleHeight / 2;
let ballX = WIDTH / 2;
let ballY = HEIGHT / 2;
let ballSpeedX = 10; // Increased ball speed
let ballSpeedY = 10; // Increased ball speed
const leftPaddleOffset = 50; // Offset from the left side
const rightPaddleOffset = 50; // Offset from the right side

let playerScore = 0;
let opponentScore = 0;

// Elements
const playerScoreElement = document.getElementById('playerScore');
const opponentScoreElement = document.getElementById('opponentScore');

// Event listener for mouse movement to control player's paddle
canvas.addEventListener('mousemove', function(event) {
    const rect = canvas.getBoundingClientRect();
    playerY = event.clientY - rect.top - paddleHeight / 2; // Centering paddle on mouse y position
});

// Function to calculate opponent paddle movement
function moveOpponent() {
    // Calculate target y position (middle of the ball) only when the ball is approaching opponent's side
    if (ballSpeedX > 0 && ballX > WIDTH / 2) {
        const targetY = ballY - paddleHeight / 2;

        // Move opponent paddle towards the target y position or randomly (25% of the time)
        if (Math.random() < 0.25) {
            // Random movement
            opponentY += Math.random() < 0.5 ? paddleSpeed : -paddleSpeed; // Increased paddleSpeed
        } else {
            // Move towards the ball
            if (opponentY < targetY) {
                opponentY += paddleSpeed; // Increased paddleSpeed
            } else if (opponentY > targetY) {
                opponentY -= paddleSpeed; // Increased paddleSpeed
            }
        }
    }

    // Ensure opponent paddle stays within bounds
    if (opponentY < 0) {
        opponentY = 0;
    } else if (opponentY > HEIGHT - paddleHeight) {
        opponentY = HEIGHT - paddleHeight;
    }
}

// Function to update score and reset ball position
function updateScore(winner) {
    if (winner === 'player') {
        playerScore++;
    } else if (winner === 'opponent') {
        opponentScore++;
    }

    // Update scoreboard
    playerScoreElement.textContent = playerScore;
    opponentScoreElement.textContent = opponentScore;

    // Reset ball position
    ballX = WIDTH / 2;
    ballY = HEIGHT / 2;
    ballSpeedX *= Math.random() < 0.5 ? -1 : 1;
    ballSpeedY *= Math.random() < 0.5 ? -1 : 1;
}

// Game loop
function gameLoop() {
    // Update opponent paddle position
    moveOpponent();

    // Update ball position
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top/bottom walls
    if (ballY <= 0 || ballY >= HEIGHT) {
        ballSpeedY *= -1;
    }

    // Ball collision with paddles
    if (ballX <= leftPaddleOffset + paddleWidth && ballY >= playerY && ballY <= playerY + paddleHeight) {
        ballSpeedX *= -1;
    }
    if (ballX >= WIDTH - rightPaddleOffset - paddleWidth && ballY >= opponentY && ballY <= opponentY + paddleHeight) {
        ballSpeedX *= -1;
    }

    // Score update when ball goes past player or opponent paddles
    if (ballX <= 0) {
        updateScore('opponent');
    } else if (ballX >= WIDTH) {
        updateScore('player');
    }

    // Draw
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(leftPaddleOffset, playerY, paddleWidth, paddleHeight);
    ctx.fillRect(WIDTH - rightPaddleOffset - paddleWidth, opponentY, paddleWidth, paddleHeight);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
    ctx.fill();

    // Request animation frame
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
