export type ThemeMode = 'light' | 'dark' | 'system';

export class ThemeManager {
    private static instance: ThemeManager;
    private currentTheme: ThemeMode = 'system';

    private constructor() {
        if (typeof window !== 'undefined') {
            this.init();
        }
    }

    public static getInstance(): ThemeManager {
        if (!ThemeManager.instance) {
            ThemeManager.instance = new ThemeManager();
        }
        return ThemeManager.instance;
    }

    private init() {
        const stored = localStorage.getItem('theme') as ThemeMode | null;
        if (stored) {
            this.setTheme(stored);
        } else {
            this.setTheme('system');
        }
    }

    public setTheme(theme: ThemeMode) {
        this.currentTheme = theme;
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', theme);

            if (theme === 'system') {
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                this.applyToDOM(systemDark ? 'dark' : 'light');
            } else {
                this.applyToDOM(theme);
            }
        }
    }

    public toggle() {
        if (this.currentTheme === 'light') this.setTheme('dark');
        else if (this.currentTheme === 'dark') this.setTheme('light');
        else {
            // If system, toggle based on current resolved
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            this.setTheme(isDark ? 'light' : 'dark');
        }
    }

    public getTheme(): ThemeMode {
        return this.currentTheme;
    }

    private applyToDOM(mode: 'light' | 'dark') {
        document.documentElement.setAttribute('data-theme', mode);
        // Optional: If using Tailwind class-mode, we would add 'dark' class here.
        // document.documentElement.classList.toggle('dark', mode === 'dark');
    }
}
