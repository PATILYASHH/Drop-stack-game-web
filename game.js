const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

const canvasWidth = 400;
const canvasHeight = 600;
const blockSize = 40;
const rows = canvasHeight / blockSize;
const cols = canvasWidth / blockSize;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

let grid = Array.from({ length: rows }, () => Array(cols).fill(0));
let score = 0;
let dropInterval = 1000; // Initial drop speed in milliseconds
let lastDropTime = Date.now();

function drawGrid() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (grid[row][col] === 1) {
                context.fillStyle = '#000';
                context.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
            }
            context.strokeStyle = '#ddd';
            context.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);
        }
    }
}

function drawScore() {
    context.fillStyle = '#000';
    context.font = '20px Arial';
    context.fillText(`Score: ${score}`, 10, 30);
}

let currentBlock = { x: Math.floor(cols / 2), y: 0 };

function drawBlock(block) {
    context.fillStyle = '#000';
    context.fillRect(block.x * blockSize, block.y * blockSize, blockSize, blockSize);
}

function moveBlockDown() {
    if (currentBlock.y < rows - 1 && !grid[currentBlock.y + 1][currentBlock.x]) {
        currentBlock.y++;
    } else {
        grid[currentBlock.y][currentBlock.x] = 1;
        score += 10; // Increase score
        if (score % 100 === 0) { // Increase difficulty every 100 points
            dropInterval = Math.max(100, dropInterval - 100); // Decrease interval, min 100ms
        }
        currentBlock = { x: Math.floor(cols / 2), y: 0 };
    }
}

function gameLoop() {
    const now = Date.now();
    if (now - lastDropTime >= dropInterval) {
        moveBlockDown();
        lastDropTime = now;
    }
    drawGrid();
    drawBlock(currentBlock);
    drawScore();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentBlock.x > 0 && !grid[currentBlock.y][currentBlock.x - 1]) {
        currentBlock.x--;
    } else if (e.key === 'ArrowRight' && currentBlock.x < cols - 1 && !grid[currentBlock.y][currentBlock.x + 1]) {
        currentBlock.x++;
    }
});

gameLoop();