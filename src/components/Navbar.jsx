import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, 
    Users, 
    CalendarCheck, 
    Moon, 
    Sun,
    Menu,
    X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/employees', label: 'Employees', icon: Users },
    { path: '/attendance', label: 'Attendance', icon: CalendarCheck },
];

const Navbar = () => {
    const location = useLocation();
    const { theme, toggleTheme, isTransitioning } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: 0.2
                }}
                className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="glass-strong rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <motion.div 
                                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                                style={{
                                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                                    boxShadow: '0 4px 20px rgba(249, 115, 22, 0.3)'
                                }}
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="text-white font-display font-bold text-sm">HR</span>
                            </motion.div>
                            <div className="hidden sm:block">
                                <h1 className="font-display font-bold text-lg text-dark-900 dark:text-white">
                                    HRMS <span className="text-orange-500">Lite</span>
                                </h1>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1 bg-dark-100/50 dark:bg-dark-800/50 rounded-xl p-1.5">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className="relative"
                                    >
                                        <motion.div
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                                isActive 
                                                    ? "text-orange-600 dark:text-orange-400" 
                                                    : "text-dark-500 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white"
                                            )}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeNavBg"
                                                    className="absolute inset-0 bg-white dark:bg-dark-700 rounded-lg shadow-sm"
                                                    initial={false}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 300,
                                                        damping: 30
                                                    }}
                                                />
                                            )}
                                            <span className="relative z-10 flex items-center gap-2">
                                                <item.icon size={18} />
                                                {item.label}
                                            </span>
                                        </motion.div>
                                    </NavLink>
                                );
                            })}
                        </div>

                        {/* Right side: Theme toggle + User */}
                        <div className="flex items-center gap-3">
                            {/* Theme Toggle */}
                            <motion.button
                                onClick={toggleTheme}
                                disabled={isTransitioning}
                                className={cn(
                                    "relative w-14 h-8 rounded-full p-1 transition-colors duration-300",
                                    theme === 'dark' 
                                        ? "bg-dark-700" 
                                        : "bg-orange-100"
                                )}
                                whileTap={{ scale: 0.95 }}
                            >
                                <motion.div
                                    className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center shadow-lg",
                                        theme === 'dark' 
                                            ? "bg-dark-500" 
                                            : "bg-white"
                                    )}
                                    animate={{
                                        x: theme === 'dark' ? 22 : 0,
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 30
                                    }}
                                >
                                    <AnimatePresence mode="wait">
                                        {theme === 'dark' ? (
                                            <motion.div
                                                key="moon"
                                                initial={{ scale: 0, rotate: -90 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                exit={{ scale: 0, rotate: 90 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Moon size={14} className="text-orange-400" />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="sun"
                                                initial={{ scale: 0, rotate: 90 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                exit={{ scale: 0, rotate: -90 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Sun size={14} className="text-orange-500" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </motion.button>

                            {/* User Avatar */}
                            <motion.div
                                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg cursor-pointer"
                                style={{
                                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                                    boxShadow: '0 4px 15px rgba(249, 115, 22, 0.25)'
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                A
                            </motion.div>

                            {/* Mobile Menu Button */}
                            <motion.button
                                className="md:hidden p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                whileTap={{ scale: 0.9 }}
                            >
                                {mobileMenuOpen ? (
                                    <X className="text-dark-600 dark:text-dark-300" size={22} />
                                ) : (
                                    <Menu className="text-dark-600 dark:text-dark-300" size={22} />
                                )}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-dark-950/50 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        
                        {/* Menu */}
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-20 left-4 right-4 z-50 glass-strong rounded-2xl p-4 md:hidden"
                        >
                            <div className="flex flex-col gap-2">
                                {navItems.map((item, index) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <motion.div
                                            key={item.path}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <NavLink
                                                to={item.path}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
                                                    isActive
                                                        ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                                                        : "text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700"
                                                )}
                                            >
                                                <item.icon size={20} />
                                                {item.label}
                                            </NavLink>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
