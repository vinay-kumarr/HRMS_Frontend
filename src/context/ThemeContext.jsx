import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    );
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const root = window.document.documentElement;
        
        // Add transition class for smooth theme switch
        root.classList.add('theme-transitioning');
        setIsTransitioning(true);
        
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
        
        // Remove transition class after animation completes
        const timeout = setTimeout(() => {
            root.classList.remove('theme-transitioning');
            setIsTransitioning(false);
        }, 600);
        
        return () => clearTimeout(timeout);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isTransitioning }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
