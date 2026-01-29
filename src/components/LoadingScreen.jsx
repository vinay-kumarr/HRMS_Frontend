import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ onLoadingComplete }) => {
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState('logo');

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + Math.random() * 15;
            });
        }, 100);

        const timer1 = setTimeout(() => setPhase('grid'), 800);
        const timer2 = setTimeout(() => setPhase('complete'), 2000);
        const timer3 = setTimeout(() => onLoadingComplete?.(), 2500);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [onLoadingComplete]);

    return (
        <AnimatePresence>
            {phase !== 'complete' && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)' }}
                    initial={{ opacity: 1 }}
                    exit={{ 
                        opacity: 0,
                        scale: 1.1,
                        filter: 'blur(10px)'
                    }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                >
                    {/* Animated Background */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div
                            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
                            style={{ background: 'rgba(249, 115, 22, 0.15)' }}
                            animate={{
                                scale: [1, 1.2, 1],
                                x: [0, 50, 0],
                                y: [0, -30, 0],
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
                            style={{ background: 'rgba(234, 88, 12, 0.12)' }}
                            animate={{
                                scale: [1.2, 1, 1.2],
                                x: [0, -40, 0],
                                y: [0, 40, 0],
                            }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>

                    {/* Center Content */}
                    <div className="relative z-10 flex flex-col items-center">
                        {/* Logo */}
                        <motion.div
                            className="relative"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ 
                                type: "spring",
                                stiffness: 200,
                                damping: 20,
                                delay: 0.1
                            }}
                        >
                            <motion.div
                                className="absolute inset-0 rounded-2xl blur-2xl"
                                style={{ background: 'rgba(249, 115, 22, 0.4)' }}
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                            
                            <div 
                                className="relative w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl"
                                style={{
                                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                                    boxShadow: '0 20px 50px rgba(249, 115, 22, 0.4)'
                                }}
                            >
                                <motion.span 
                                    className="text-4xl font-display font-bold text-white"
                                    animate={{ opacity: [1, 0.8, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    HR
                                </motion.span>
                            </div>
                        </motion.div>

                        {/* Brand name */}
                        <motion.h1
                            className="mt-8 text-3xl font-display font-bold text-white"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            HRMS <span className="text-orange-400">Lite</span>
                        </motion.h1>

                        <motion.p
                            className="mt-2 text-stone-500 text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Human Resource Management System
                        </motion.p>

                        {/* Progress bar */}
                        <motion.div
                            className="mt-10 w-64 h-1 bg-stone-800 rounded-full overflow-hidden"
                            initial={{ opacity: 0, scaleX: 0.5 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <motion.div
                                className="h-full rounded-full"
                                style={{
                                    background: 'linear-gradient(90deg, #f97316 0%, #fb923c 100%)',
                                    width: `${Math.min(progress, 100)}%`
                                }}
                                transition={{ ease: "easeOut" }}
                            />
                        </motion.div>

                        {/* Loading text */}
                        <motion.div
                            className="mt-4 flex items-center gap-2 text-stone-500 text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <motion.span
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                Loading dashboard
                            </motion.span>
                            <motion.span
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                ...
                            </motion.span>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;
