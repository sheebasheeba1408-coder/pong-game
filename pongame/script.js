// Canvas and context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game objects
const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 8;

// Player paddle (left)
const player = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 6
};

// Computer paddle (right)
const computer = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 5
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 5,
    dy: 5,
    radius: ballSize,
    speed: 5
};

// Scores
let playerScore = 0;
let computerScore = 0;

// Input handling
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Mouse control
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const center = player.y + player.height / 2;
    
    if (Math.abs(mouseY - center) > 10) {
        if (mouseY < center) {
            player.y -= player.speed;
        } else {
            player.y += player.speed;
        }
    }
});

// Draw functions
function drawPaddle(paddle) {
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawCenterLine() {
    ctx.strokeStyle = '#00ff00';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw elements
    drawCenterLine();
    drawPaddle(player);
    drawPaddle(computer);
    drawBall();
}

// Update functions
function updatePlayer() {
    // Arrow keys control
    if (keys['ArrowUp'] && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys['ArrowDown'] && player.y < canvas.height - player.height) {
        player.y += player.speed;
    }
    
    // Boundary check
    if (player.y < 0) player.y = 0;
    if (player.y > canvas.height - player.height) {
        player.y = canvas.height - player.height;
    }
}

function updateComputer() {
    // Simple AI - follows the ball
    const computerCenter = computer.y + computer.height / 2;
    const ballCenter = ball.y;
    
    if (ballCenter < computerCenter - 35) {
        computer.y -= computer.speed;
    } else if (ballCenter > computerCenter + 35) {
        computer.y += computer.speed;
    }
    
    // Boundary check
    if (computer.y < 0) computer.y = 0;
    if (computer.y > canvas.height - computer.height) {
        computer.y = canvas.height - computer.height;
    }
}

function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Wall collision (top and bottom)
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = Math.max(ball.radius, Math.min(canvas.height - ball.radius, ball.y));
    }
    
    // Paddle collision
    if (
        ball.x - ball.radius < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height
    ) {
        ball.dx = -ball.dx;
        ball.x = player.x + player.width + ball.radius;
        
        // Add spin based on where ball hits paddle
        const deltaY = ball.y - (player.y + player.height / 2);
        ball.dy = (deltaY / (player.height / 2)) * ball.speed;
    }
    
    if (
        ball.x + ball.radius > computer.x &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height
    ) {
        ball.dx = -ball.dx;
        ball.x = computer.x - ball.radius;
        
        // Add spin based on where ball hits paddle
        const deltaY = ball.y - (computer.y + computer.height / 2);
        ball.dy = (deltaY / (computer.height / 2)) * ball.speed;
    }
    
    // Scoring
    if (ball.x - ball.radius < 0) {
        computerScore++;
        document.getElementById('computerScore').textContent = computerScore;
        resetBall();
    }
    
    if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        document.getElementById('playerScore').textContent = playerScore;
        resetBall();
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() - 0.5) * ball.speed;
}

function update() {
    updatePlayer();
    updateComputer();
    updateBall();
}

// Game loop
function gameLoop() {
    update();
    drawGame();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();