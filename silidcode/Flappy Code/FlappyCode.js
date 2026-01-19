document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 600;

    let bird = { x: 50, y: 150, w: 34, h: 24, velocity: 0, gravity: 0.25, jump: -4.8 };
    let pipes = [];
    let isPaused = false;
    let gameActive = true;
    let gameSpeed = 2.5;
    let score = 0;
    let pipeSpawner;

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

    function fly() { if (!isPaused && gameActive) bird.velocity = bird.jump; }

    function update() {
        if (isPaused || !gameActive) return;
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;
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
        pipes.forEach(p => {
            ctx.fillStyle = "#2d3748"; ctx.fillRect(p.x, 0, 60, p.top);
            ctx.fillRect(p.x, canvas.height - p.bottom, 60, p.bottom);
        });
        ctx.fillStyle = "#80ff00"; ctx.fillRect(bird.x, bird.y, bird.w, bird.h);
        update();
        if (gameActive) requestAnimationFrame(draw);
    }

    function gameOver() {
        gameActive = false;
        clearInterval(pipeSpawner);
        document.getElementById('game-over-screen').classList.remove('hidden');
        document.getElementById('final-score').innerText = score;

        const user = localStorage.getItem('g2fa') || "Guest";
        let leaderboard = JSON.parse(localStorage.getItem('FlappyCode_leaderboard')) || [];
        const existing = leaderboard.findIndex(e => e.name === user);
        
        if (existing !== -1) {
            if (score > leaderboard[existing].score) leaderboard[existing].score = score;
        } else {
            leaderboard.push({ name: user, score: score });
        }
        
        leaderboard.sort((a, b) => b.score - a.score);
        localStorage.setItem('FlappyCode_leaderboard', JSON.stringify(leaderboard.slice(0, 50)));
    }

    canvas.addEventListener('mousedown', fly);
    window.addEventListener('keydown', (e) => { if(e.code === 'Space') fly(); });
    pipeSpawner = setInterval(createPipe, 2500);
    draw();
});

(function() {
    const storageKey = 'theme';
    const getThemeFromCookie = () => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${storageKey}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };
    const savedTheme = getThemeFromCookie() || localStorage.getItem(storageKey) || 'dark-modern';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();