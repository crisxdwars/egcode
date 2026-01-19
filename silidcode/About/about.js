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