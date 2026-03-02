import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const getSystemPreference = () =>
    window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ?? 'system';
    });

    const resolvedTheme = theme === 'system' ? getSystemPreference() : theme;
    const isDarkMode = resolvedTheme === 'dark';

    useEffect(() => {
        localStorage.setItem('theme', theme);
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode, theme]);

    // Listen for system preference changes
    useEffect(() => {
        if (theme !== 'system') return;
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => {
            document.documentElement.classList.toggle('dark', mq.matches);
        };
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [theme]);

    const setThemeMode = (mode) => setTheme(mode); // 'light' | 'dark' | 'system'
    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    return (
        <ThemeContext.Provider value={{ isDarkMode, theme, toggleTheme, setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
};
