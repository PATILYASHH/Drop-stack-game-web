let scene, camera, renderer, ball, ballBody, world, stack = [], stackBodies = [], score = 0, ballSpeed = 0.1, stackSpeed = 0.01;

function init() {
    // Initialize Three.js scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('game-container').appendChild(renderer.domElement);

    // Initialize Cannon.js world
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    world.broadphase = new CANNON.NaiveBroadphase();

    // Ball setup (Three.js)
    const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    scene.add(ball);

    // Ball setup (Cannon.js)
    const ballShape = new CANNON.Sphere(0.5);
    ballBody = new CANNON.Body({ mass: 1, material: new CANNON.Material({ friction: 0.0, restitution: 0.6 }) });
    ballBody.addShape(ballShape);
    ballBody.position.set(0, 10, 0);
    world.addBody(ballBody);

    // Stack setup
    createStack();

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    scene.add(light);

    // Start the animation
    animate();
}

function createStack() {
    for (let i = 0; i < 10; i++) {
        const height = 0.5;
        const radiusTop = 3;
        const radiusBottom = 3;

        // Three.js mesh
        const stackGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 32);
        const stackMaterial = new THREE.MeshStandardMaterial({ color: (i % 2 === 0) ? 0xff0000 : 0x0000ff });
        const stackPiece = new THREE.Mesh(stackGeometry, stackMaterial);
        stackPiece.position.set(0, height / 2 + i * height, 0);
        stack.push(stackPiece);
        scene.add(stackPiece);

        // Cannon.js body
        const stackShape = new CANNON.Cylinder(radiusTop, radiusBottom, height, 32);
        const stackBody = new CANNON.Body({ mass: 0 });
        stackBody.addShape(stackShape);
        stackBody.position.set(0, height / 2 + i * height, 0);
        stackBodies.push(stackBody);
        world.addBody(stackBody);
    }
}

function animate() {
    requestAnimationFrame(animate);

    // Update physics
    world.step(1 / 60);

    // Sync ball position with Cannon.js body
    ball.position.copy(ballBody.position);
    ball.quaternion.copy(ballBody.quaternion);

    // Rotate stack
    stack.forEach((piece, index) => {
        piece.rotation.y += stackSpeed;
        stackBodies[index].quaternion.setFromEuler(0, piece.rotation.y, 0);
    });

    // Render scene
    renderer.render(scene, camera);

    // Check for collisions
    checkCollision();
}

function checkCollision() {
    if (ball.position.y < -5) {
        alert(`Game Over! Your score: ${score}`);
        resetGame();
    }
}

function resetGame() {
    score = 0;
    ballSpeed = 0.1;
    stackSpeed = 0.01;
    ballBody.position.set(0, 10, 0);
    ballBody.velocity.set(0, 0, 0);
    ballBody.angularVelocity.set(0, 0, 0);

    stack.forEach(piece => scene.remove(piece));
    stackBodies.forEach(body => world.remove(body));

    stack = [];
    stackBodies = [];
    createStack();
}

window.onload = init;