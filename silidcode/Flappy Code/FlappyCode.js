document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 600;

    // --- ASSETS SETUP ---
    const birdImg = new Image();
    birdImg.src = '../Assets/Flappy Code/bird.png'; 
    const swooshImg = new Image();
    swooshImg.src = '../Assets/Flappy Code/swoosh.png';
    
    // NEW: Cloud Image Asset
    const cloudImg = new Image();
    cloudImg.src = '../Assets/Flappy Code/cloud.png'; 

    // --- SOUND EFFECTS ---
    const swooshSound = new Audio('../Assets/Flappy Code/jump.mp3');
    const gameOverSound = new Audio('../Assets/Flappy Code/gameover.mp3');

    // --- GAME OBJECTS & STATE ---
    let bird = { x: 50, y: 150, w: 44, h: 34, velocity: 0, gravity: 0.25, jump: -4.8 };
    let pipes = [];
    let clouds = []; 
    let isPaused = true;
    let gameActive = true;
    let gameSpeed = 2.5;
    let score = 0;
    let pipeSpawner;
    let cloudSpawner;
    let showSwoosh = 0; 

    // --- UPDATED CLOUD SYSTEM ---
    function spawnClouds() {
        if (isPaused || !gameActive) return;
        
        // Spawns 1 to 4 clouds as requested
        const count = Math.floor(Math.random() * 4) + 1;
        
        for(let i = 0; i < count; i++) {
            clouds.push({
                x: canvas.width + Math.random() * 100, // Staggered entry
                y: Math.random() * (canvas.height * 0.6), // Keep clouds in upper 60% of screen
                w: Math.random() * 50 + 50, // Random width
                h: Math.random() * 30 + 30, // Random height
                speed: Math.random() * 0.8 + 0.3,
                opacity: Math.random() * 0.4 + 0.2 
            });
        }
    }

    // Pre-fill screen with some clouds
    for(let i = 0; i < 5; i++) {
        spawnClouds();
        clouds.forEach(c => c.x = Math.random() * canvas.width);
    }

    // --- LOADING LOGIC ---
    setTimeout(() => {
        const intro = document.getElementById('intro-overlay');
        if(intro) {
            intro.classList.add('hidden');
            isPaused = false;
            pipeSpawner = setInterval(createPipe, 2500);
            // Spawns 1-4 clouds every 2 seconds as requested
            cloudSpawner = setInterval(spawnClouds, 2000); 
        }
    }, 2500);

    const questions = [
        { q: "What does HTML stand for?", a: ["HyperText Markup Language", "HighTech Machine Language", "Hyperlink Text Mode"], correct: 0 },
        { q: "Which symbol is used for comments in JS?", a: ["#", "//", "/* */"], correct: 1 },
        { q: "Which operator is used to assign a value?", a: ["*", "-", "="], correct: 2 },
        { q: "How do you call a function named 'myFunc'?", a: ["call myFunc()", "myFunc()", "function myFunc()"], correct: 1 }
    ];

    function createPipe() {
        if (isPaused || !gameActive) return;
        let gap = 170;
        let topHeight = Math.floor(Math.random() * (canvas.height - gap - 150)) + 75;
        pipes.push({ x: canvas.width, top: topHeight, bottom: canvas.height - topHeight - gap, passed: false });
    }

    function fly() { 
        if (!isPaused && gameActive) {
            bird.velocity = bird.jump;
            showSwoosh = 10;
            swooshSound.currentTime = 0;
            swooshSound.play().catch(() => {});
        } 
    }

    function update() {
        if (isPaused || !gameActive) return;
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;
        
        if (showSwoosh > 0) showSwoosh--;

        // Update Clouds
        clouds.forEach((c, i) => {
            c.x -= c.speed;
            if (c.x + c.w < -50) clouds.splice(i, 1);
        });

        if (bird.y + bird.h > canvas.height || bird.y < 0) gameOver();

        pipes.forEach((pipe, index) => {
            pipe.x -= gameSpeed;
            if (bird.x < pipe.x + 60 && bird.x + bird.w > pipe.x &&
                (bird.y < pipe.top || bird.y + bird.h > canvas.height - pipe.bottom)) gameOver();

            if (!pipe.passed && bird.x > pipe.x + 60) {
                pipe.passed = true;
                pauseAndAsk();
            }
            if (pipe.x + 60 < 0) pipes.splice(index, 1);
        });
    }

    function pauseAndAsk() {
        isPaused = true;
        const qData = questions[Math.floor(Math.random() * questions.length)];
        document.getElementById('question-text').innerText = qData.q;
        const btnContainer = document.getElementById('answer-options');
        btnContainer.innerHTML = '';
        qData.a.forEach((ans, i) => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.innerText = ans;
            btn.onclick = () => {
                if (i === qData.correct) {
                    score += 10;
                    gameSpeed += 0.1;
                    document.getElementById('scoreVal').innerText = score;
                    document.getElementById('question-overlay').classList.add('hidden');
                    isPaused = false;
                } else gameOver();
            };
            btnContainer.appendChild(btn);
        });
        document.getElementById('question-overlay').classList.remove('hidden');
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // DRAW CLOUD IMAGES
        clouds.forEach(c => {
            ctx.globalAlpha = c.opacity; // Set transparency for the cloud image
            ctx.drawImage(cloudImg, c.x, c.y, c.w, c.h);
            ctx.globalAlpha = 1.0; // Reset transparency for other objects
        });

        // UPGRADED PIPE/LOG DESIGN
        pipes.forEach(p => {
            // Wood-like gradient for logs
            let grad = ctx.createLinearGradient(p.x, 0, p.x + 60, 0);
            grad.addColorStop(0, "#4a2c2a");
            grad.addColorStop(0.5, "#7b4e44");
            grad.addColorStop(1, "#4a2c2a");
            
            ctx.fillStyle = grad;
            ctx.fillRect(p.x, 0, 60, p.top);
            ctx.fillRect(p.x, canvas.height - p.bottom, 60, p.bottom);

            // Log details (End caps and highlight lines)
            ctx.fillStyle = "#2d1b1a";
            ctx.fillRect(p.x - 4, p.top - 15, 68, 15); // Top log end
            ctx.fillRect(p.x - 4, canvas.height - p.bottom, 68, 15); // Bottom log end
        });

        if (showSwoosh > 0) {
            ctx.drawImage(swooshImg, bird.x - 15, bird.y + bird.h - 5, 40, 25);
        }

        ctx.drawImage(birdImg, bird.x, bird.y, bird.w, bird.h);

        update();
        if (gameActive) requestAnimationFrame(draw);
    }

function gameOver() {
    gameActive = false;
    clearInterval(pipeSpawner);
    clearInterval(cloudSpawner);
    gameOverSound.play().catch(() => {});
    
    document.getElementById('game-over-screen').classList.remove('hidden');
    document.getElementById('final-score').innerText = score;

    // --- UNIQUE USER HIGHSCORE LOGIC ---
    const currentUser = localStorage.getItem('g2fa') || "Guest";
    let leaderData = JSON.parse(localStorage.getItem('FlappyCode_leaderboard')) || [];

    // Find if the user already has a score saved
    const userIndex = leaderData.findIndex(entry => entry.name === currentUser);

    if (userIndex !== -1) {
        // User exists: Update only if the new score is higher
        if (score > leaderData[userIndex].score) {
            leaderData[userIndex].score = score;
        }
    } else {
        // New user: Add them to the list
        leaderData.push({ name: currentUser, score: score });
    }

    // Sort by score (Highest first)
    leaderData.sort((a, b) => b.score - a.score);
    
    // Keep only the Top 50 unique players
    const top50 = leaderData.slice(0, 50);
    
    localStorage.setItem('FlappyCode_leaderboard', JSON.stringify(top50));
}

    canvas.addEventListener('mousedown', fly);
    window.addEventListener('keydown', (e) => { if(e.code === 'Space') fly(); });
    
    draw();
});