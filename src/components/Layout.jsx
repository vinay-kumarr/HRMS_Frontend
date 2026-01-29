import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import BackgroundGradient from './BackgroundGradient';

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98,
    },
    enter: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.98,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 1, 1],
        },
    },
};

const Layout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="min-h-screen relative">
            {/* Smooth Background Transition */}
            <BackgroundGradient />
            
            {/* Animated Background Orbs */}
            <div className="bg-animated">
                <div className="bg-orb bg-orb-1"></div>
                <div className="bg-orb bg-orb-2"></div>
                <div className="bg-orb bg-orb-3"></div>
            </div>
            
            {/* Grid Overlay */}
            <div className="bg-grid-overlay"></div>

            {/* Floating Navigation */}
            <Navbar />

            {/* Main Content Area */}
            <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.main
                            key={location.pathname}
                            variants={pageVariants}
                            initial="initial"
                            animate="enter"
                            exit="exit"
                            className="min-h-[calc(100vh-8rem)]"
                        >
                            {children}
                        </motion.main>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Layout;
