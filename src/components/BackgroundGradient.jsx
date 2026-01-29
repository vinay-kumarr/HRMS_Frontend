import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const BackgroundGradient = () => {
    const { theme } = useTheme();

    return (
        <div className="fixed inset-0 z-[-2] pointer-events-none">
            {/* Light Mode Gradient */}
            <motion.div
                className="absolute inset-0"
                initial={{ opacity: theme === 'light' ? 1 : 0 }}
                animate={{ opacity: theme === 'light' ? 1 : 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                style={{
                    background: 'linear-gradient(135deg, hsl(30 25% 98%) 0%, hsl(35 30% 96%) 50%, hsl(25 20% 97%) 100%)'
                }}
            />

            {/* Dark Mode Gradient */}
            <motion.div
                className="absolute inset-0"
                initial={{ opacity: theme === 'dark' ? 1 : 0 }}
                animate={{ opacity: theme === 'dark' ? 1 : 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                style={{
                    background: 'linear-gradient(135deg, hsl(20 20% 6%) 0%, hsl(15 15% 8%) 50%, hsl(25 18% 5%) 100%)'
                }}
            />
        </div>
    );
};

export default BackgroundGradient;
