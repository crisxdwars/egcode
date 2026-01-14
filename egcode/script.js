/**
 * EGCode - Main Site Logic
 */

// 1. Game Data Array
const games = [
    { name: "Game 1", img: "https://i.ibb.co/YBvrzxCg/ssasda.png" },
    { name: "Game 2", img: "https://i.ibb.co/YBvrzxCg/ssasda.png" },
    { name: "Game 3", img: "https://i.ibb.co/YBvrzxCg/ssasda.png" }
];

// 2. Funny Loading Messages
const heh = [
    "Did you know that...",
    "Have a good day.",
    "Its a Loading Screen! @chrs",
    "You can do it!",
    "Can someone remove this feature.",
    "Whats up?",
    "Hello World(\"print\")",
    "Please wait while the little elves draw the page",
    "Why so serious?"
];

/**
 * Core Site Functionality
 */
function initSite() {
    const grid = document.getElementById('gameGrid');
    const searchInput = document.querySelector('.search-bar input');
    const status = document.querySelector('.loading-status');

    // --- GAME RENDERER & SEARCH LOGIC ---
    function renderGames(filterText = "") {
        if(!grid) return; // Prevent errors on pages without a game grid (like Leaderboard)
        
        const filtered = games.filter(game => 
            game.name.toLowerCase().includes(filterText.toLowerCase())
        );

        if (filtered.length === 0) {
            grid.innerHTML = `<p style="color: var(--text-grey); grid-column: 1/-1; text-align: center; padding: 20px;">No games found matching "${filterText}"</p>`;
            return;
        }

        grid.innerHTML = filtered.map(game => `
            <div class="game-card">
                <img src="${game.img}" alt="${game.name}">
                <div class="game-title">${game.name}</div>
            </div>
        `).join('');
    }

    // Initial grid render
    renderGames();

    // Listen for typing in the search bar
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderGames(e.target.value);
        });
    }

    // --- INTRO OVERLAY & FUNNY MESSAGES ---
    if(status) {
        // Change the text to something funny after 1 second
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * heh.length);
            status.innerText = heh[randomIndex];
        }, 100);
    }

    // Hide the entire intro overlay after 2.5 seconds
    setTimeout(() => {
        const intro = document.getElementById('intro-overlay');
        if(intro) intro.classList.add('hidden');
    }, 2500);

    // --- SIDEBAR CONTROLS ---
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');

    function toggleMenu() {
        if(sidebar) sidebar.classList.toggle('collapsed');
        if(sidebarToggle) sidebarToggle.classList.toggle('open');
        if(backdrop) backdrop.classList.toggle('active');
    }

    if(sidebarToggle) sidebarToggle.addEventListener('click', toggleMenu);
    if(backdrop) backdrop.addEventListener('click', toggleMenu);
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', initSite);

/**
 * THEME ENGINE - IMMEDIATE EXECUTION
 * This runs outside of initSite to prevent "White Flashes" when reloading
 */
const savedTheme = localStorage.getItem('egcode-theme') || 'dark-modern';
document.documentElement.setAttribute('data-theme', savedTheme);