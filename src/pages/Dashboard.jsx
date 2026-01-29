import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, Activity, TrendingUp, Calendar, Clock } from 'lucide-react';
import api from '../services/api';
import Spinner from '../components/ui/Spinner';
import { cn } from '../lib/utils';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_employees: 0,
        present_today: 0,
        absent_today: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/stats');
                setStats(response.data);
            } catch (err) {
                console.error("Error fetching stats:", err);
                setError("Failed to load dashboard statistics.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass rounded-2xl p-12"
                >
                    <Spinner />
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-8 text-center"
            >
                <div className="text-red-500 dark:text-red-400 font-medium">{error}</div>
            </motion.div>
        );
    }

    const cards = [
        {
            title: 'Total Employees',
            value: stats.total_employees,
            icon: Users,
            gradient: 'from-blue-500 to-cyan-500',
            bgGlow: 'rgba(59, 130, 246, 0.2)',
            iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
            delay: 0,
        },
        {
            title: 'Present Today',
            value: stats.present_today,
            icon: UserCheck,
            gradient: 'from-emerald-500 to-teal-500',
            bgGlow: 'rgba(16, 185, 129, 0.2)',
            iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
            delay: 0.1,
        },
        {
            title: 'Absent Today',
            value: stats.absent_today,
            icon: UserX,
            gradient: 'from-rose-500 to-pink-500',
            bgGlow: 'rgba(244, 63, 94, 0.2)',
            iconBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
            delay: 0.2,
        },
    ];

    const attendanceRate = stats.total_employees > 0 
        ? Math.round((stats.present_today / stats.total_employees) * 100) 
        : 0;

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl sm:text-4xl font-display font-bold text-dark-900 dark:text-white flex items-center gap-3">
                        <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                            style={{
                                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                                boxShadow: '0 4px 20px rgba(249, 115, 22, 0.3)'
                            }}
                        >
                            <Activity className="text-white" size={24} />
                        </div>
                        Dashboard
                    </h1>
                    <p className="mt-2 text-dark-500 dark:text-dark-400">
                        Welcome back! Here's what's happening today.
                    </p>
                </div>
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-xl px-4 py-2 flex items-center gap-2 text-sm text-dark-600 dark:text-dark-300"
                >
                    <Calendar size={16} />
                    <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </motion.div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                            duration: 0.5, 
                            delay: card.delay,
                            type: "spring",
                            stiffness: 100
                        }}
                        whileHover={{ 
                            y: -5,
                            transition: { duration: 0.2 }
                        }}
                        className="stat-card group relative overflow-hidden"
                    >
                        {/* Background glow */}
                        <div 
                            className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity"
                            style={{ background: card.bgGlow }}
                        />
                        
                        <div className="relative z-10 flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">
                                    {card.title}
                                </p>
                                <motion.p 
                                    className="text-4xl font-display font-bold text-dark-900 dark:text-white mt-3"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: card.delay + 0.2, type: "spring" }}
                                >
                                    {card.value}
                                </motion.p>
                            </div>
                            <motion.div 
                                className={cn("p-3 rounded-xl", card.iconBg)}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <card.icon size={24} />
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Attendance Overview Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 glass rounded-2xl p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-display font-semibold text-dark-900 dark:text-white flex items-center gap-2">
                            <TrendingUp className="text-orange-500" size={22} />
                            Attendance Overview
                        </h2>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                        {/* Circular Progress */}
                        <div className="relative w-40 h-40">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    className="fill-none stroke-dark-200 dark:stroke-dark-700"
                                    strokeWidth="12"
                                />
                                <motion.circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="#f97316"
                                    className="fill-none"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                    strokeDasharray={440}
                                    initial={{ strokeDashoffset: 440 }}
                                    animate={{ strokeDashoffset: 440 - (440 * attendanceRate / 100) }}
                                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <motion.span 
                                    className="text-3xl font-display font-bold text-dark-900 dark:text-white"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                >
                                    {attendanceRate}%
                                </motion.span>
                                <span className="text-xs text-dark-500 dark:text-dark-400">Attendance</span>
                            </div>
                        </div>
                        
                        {/* Stats breakdown */}
                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <div className="glass-subtle rounded-xl p-4">
                                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                                    <UserCheck size={18} />
                                    <span className="text-sm font-medium">Present</span>
                                </div>
                                <p className="text-2xl font-display font-bold text-dark-900 dark:text-white">
                                    {stats.present_today}
                                </p>
                            </div>
                            <div className="glass-subtle rounded-xl p-4">
                                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-1">
                                    <UserX size={18} />
                                    <span className="text-sm font-medium">Absent</span>
                                </div>
                                <p className="text-2xl font-display font-bold text-dark-900 dark:text-white">
                                    {stats.absent_today}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass rounded-2xl p-6"
                >
                    <h2 className="text-xl font-display font-semibold text-dark-900 dark:text-white flex items-center gap-2 mb-6">
                        <Clock className="text-orange-500" size={22} />
                        Quick Info
                    </h2>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-dark-200 dark:border-dark-700">
                            <span className="text-dark-500 dark:text-dark-400">Total Staff</span>
                            <span className="font-semibold text-dark-900 dark:text-white">{stats.total_employees}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-dark-200 dark:border-dark-700">
                            <span className="text-dark-500 dark:text-dark-400">Attendance Rate</span>
                            <span className="font-semibold text-orange-600 dark:text-orange-400">{attendanceRate}%</span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <span className="text-dark-500 dark:text-dark-400">Status</span>
                            <span className="px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                                Operational
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass rounded-2xl p-8 text-center relative overflow-hidden"
            >
                <div 
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, transparent 50%, rgba(234, 88, 12, 0.05) 100%)'
                    }}
                />
                <div className="relative z-10">
                    <h2 className="text-2xl font-display font-bold text-dark-900 dark:text-white mb-2">
                        Welcome to HRMS Lite
                    </h2>
                    <p className="text-dark-500 dark:text-dark-400 max-w-lg mx-auto">
                        Your modern Human Resource Management System. Navigate using the top menu to manage employees and track attendance.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
