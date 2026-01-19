const games = [
    { 
        name: "Flappy Code", 
        img: "Images/icontemp.png", 
        path: "Flappy Code/Portal.html"
    },
    { 
        name: "Game 2", 
        img: "https://i.ibb.co/YBvrzxCg/ssasda.png", 
        path: "#" 
    },
    { 
        name: "Game 3", 
        img: "https://i.ibb.co/YBvrzxCg/ssasda.png", 
        path: "#" 
    }
];
function initSite() {
    const grid = document.getElementById('gameGrid');
    const searchInput = document.querySelector('.search-bar input');
    const status = document.querySelector('.loading-status');

    // --- GAME RENDERER & SEARCH LOGIC ---
    function renderGames(filterText = "") {
        if(!grid) return; 
        
        const filtered = games.filter(game => 
            game.name.toLowerCase().includes(filterText.toLowerCase())
        );

        if (filtered.length === 0) {
            grid.innerHTML = `<p style="color: var(--text-grey); grid-column: 1/-1; text-align: center; padding: 20px;">No games found matching "${filterText}"</p>`;
            return;
        }

        grid.innerHTML = filtered.map(game => `
            <div class="game-card" onclick="location.href='${game.path}'">
                <img src="${game.img}" alt="${game.name}">
                <div class="game-title">${game.name}</div>
            </div>
        `).join('');
    }

    renderGames();

    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderGames(e.target.value);
        });
    }

    setTimeout(() => {
        const intro = document.getElementById('intro-overlay');
        if(intro) intro.classList.add('hidden');
    }, 2500);

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

    const loginBtn = document.getElementById('openLogin');
    const joinBtn = document.querySelector('.register-btn');
    const currentUser = localStorage.getItem('g2fa');

    if (currentUser) {
        // If logged in: Show username and turn 'Join' into 'Logout'
        if(loginBtn) loginBtn.innerText = currentUser; 
        if(joinBtn) {
            joinBtn.innerText = "Logout";
            joinBtn.style.background = "#dc3545"; // Optional: Red for logout
            joinBtn.onclick = (e) => {
                e.preventDefault();
                localStorage.removeItem('g2fa');
                location.reload();
            };
        }
    } else {
        // If logged out: Link to your new separate pages
        if(loginBtn) {
            loginBtn.onclick = () => { window.location.href = 'Login/login.html'; };
        }
        if(joinBtn) {
            joinBtn.onclick = () => { window.location.href = 'Join/join.html'; };
        }
    }
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', initSite);

/**
 * THEME ENGINE
 */
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