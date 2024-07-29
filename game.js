const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

const canvasWidth = 400;
const canvasHeight = 600;
const stackRadius = 150;
const ballRadius = 10;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

let score = 0;
let rotation = 0;
let ballY = 50;
let ballSpeed = 2;
let segments = createSegments(8);

function createSegments(count) {
    const segments = [];
    for (let i = 0; i < count; i++) {
        segments.push({
            startAngle: i * (Math.PI * 2 / count),
            endAngle: (i + 1) * (Math.PI * 2 / count),
            color: i % 2 === 0 ? 'red' : 'blue'
        });
    }
    return segments;
}

function drawStack() {
    context.save();
    context.translate(canvasWidth / 2, canvasHeight - stackRadius - 20);
    context.rotate(rotation);
    segments.forEach(segment => {
        context.beginPath();
        context.moveTo(0, 0);
        context.arc(0, 0, stackRadius, segment.startAngle, segment.endAngle);
        context.closePath();
        context.fillStyle = segment.color;
        context.fill();
        context.stroke();
    });
    context.restore();
}

function drawBall() {
    context.beginPath();
    context.arc(canvasWidth / 2, ballY, ballRadius, 0, Math.PI * 2);
    context.fillStyle = 'yellow';
    context.fill();
    context.stroke();
}

function updateGame() {
    rotation += 0.01;
    ballY += ballSpeed;

    if (ballY > canvasHeight - stackRadius - 30) {
        checkCollision();
        ballY = 50; // Reset ball position
        score++;
        if (score % 5 === 0) {
            ballSpeed += 0.5; // Increase difficulty
        }
    }
}

function checkCollision() {
    const angle = ((rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const segment = segments.find(segment => 
        angle >= segment.startAngle && angle <= segment.endAngle
    );
    if (segment.color === 'red') {
        alert('Game Over! Your score: ' + score);
        resetGame();
    } else {
        segments.splice(segments.indexOf(segment), 1);
        if (segments.length === 0) {
            segments = createSegments(8); // Reset stack
        }
    }
}

function resetGame() {
    score = 0;
    ballSpeed = 2;
    segments = createSegments(8);
    ballY = 50;
}

function gameLoop() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    drawStack();
    drawBall();
    updateGame();
    requestAnimationFrame(gameLoop);
}

gameLoop();