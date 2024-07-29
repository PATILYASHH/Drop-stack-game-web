let scene, camera, renderer, ball, stack, score = 0, ballSpeed = 0.1, stackSpeed = 0.01;

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 10);

    // Renderer setup
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('game-container').appendChild(renderer.domElement);

    // Light setup
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    scene.add(light);

    // Ball setup
    const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.y = 3;
    scene.add(ball);

    // Stack setup
    stack = [];
    createStack();

    // Start the animation
    animate();
}

function createStack() {
    for (let i = 0; i < 10; i++) {
        const stackGeometry = new THREE.CylinderGeometry(3, 3, 0.5, 32);
        const stackMaterial = new THREE.MeshStandardMaterial({ color: (i % 2 === 0) ? 0xff0000 : 0x0000ff });
        const stackPiece = new THREE.Mesh(stackGeometry, stackMaterial);
        stackPiece.position.y = i - 5;
        stackPiece.rotation.y = Math.random() * Math.PI;
        stack.push(stackPiece);
        scene.add(stackPiece);
    }
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate stack
    stack.forEach(piece => {
        piece.rotation.y += stackSpeed;
    });

    // Drop ball
    ball.position.y -= ballSpeed;

    // Check for collisions
    checkCollision();

    renderer.render(scene, camera);
}

function checkCollision() {
    if (ball.position.y < -5) {
        ball.position.y = 3;
        score++;
        if (score % 5 === 0) {
            ballSpeed += 0.01;
            stackSpeed += 0.001;
        }
        const topPiece = stack.shift();
        scene.remove(topPiece);
        const stackGeometry = new THREE.CylinderGeometry(3, 3, 0.5, 32);
        const stackMaterial = new THREE.MeshStandardMaterial({ color: (score % 2 === 0) ? 0xff0000 : 0x0000ff });
        const stackPiece = new THREE.Mesh(stackGeometry, stackMaterial);
        stackPiece.position.y = 4.5;
        stackPiece.rotation.y = Math.random() * Math.PI;
        stack.push(stackPiece);
        scene.add(stackPiece);
    }

    const topPiece = stack[0];
    const ballBox = new THREE.Box3().setFromObject(ball);
    const topPieceBox = new THREE.Box3().setFromObject(topPiece);

    if (ballBox.intersectsBox(topPieceBox)) {
        alert(`Game Over! Your score: ${score}`);
        resetGame();
    }
}

function resetGame() {
    score = 0;
    ballSpeed = 0.1;
    stackSpeed = 0.01;
    ball.position.y = 3;
    stack.forEach(piece => scene.remove(piece));
    stack = [];
    createStack();
}

window.onload = init;