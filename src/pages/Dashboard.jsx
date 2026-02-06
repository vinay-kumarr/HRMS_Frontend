import React, { useState, useEffect } from 'react';
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
                <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200">
                    <Spinner />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-200">
                <div className="text-red-500 font-medium">{error}</div>
            </div>
        );
    }

    const cards = [
        {
            title: 'Total Employees',
            value: stats.total_employees,
            icon: Users,
            iconBg: 'bg-indigo-100 text-indigo-600',
        },
        {
            title: 'Present Today',
            value: stats.present_today,
            icon: UserCheck,
            iconBg: 'bg-emerald-100 text-emerald-600',
        },
        {
            title: 'Absent Today',
            value: stats.absent_today,
            icon: UserX,
            iconBg: 'bg-rose-100 text-rose-600',
        },
    ];

    const attendanceRate = stats.total_employees > 0
        ? Math.round((stats.present_today / stats.total_employees) * 100)
        : 0;

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                            <Activity className="text-indigo-600" size={24} />
                        </div>
                        Dashboard
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Welcome back! Here's what's happening today.
                    </p>
                </div>

                <div className="bg-slate-50 rounded-lg px-4 py-2 flex items-center gap-2 text-sm text-slate-600 border border-gray-200">
                    <Calendar size={16} />
                    <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 transition-all hover:shadow-md"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                                    {card.title}
                                </p>
                                <p className="text-4xl font-bold text-slate-900 mt-3">
                                    {card.value}
                                </p>
                            </div>
                            <div className={cn("p-3 rounded-xl", card.iconBg)}>
                                <card.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Attendance Overview Card */}
                <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                            <TrendingUp className="text-indigo-500" size={22} />
                            Attendance Overview
                        </h2>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-8">
                        {/* Circular Progress (Simplified CSS version) */}
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    className="fill-none stroke-slate-100"
                                    strokeWidth="12"
                                />
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    className="fill-none text-indigo-500"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                    strokeDasharray={440}
                                    strokeDashoffset={440 - (440 * attendanceRate / 100)}
                                    style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold text-slate-900">
                                    {attendanceRate}%
                                </span>
                                <span className="text-xs text-slate-500">Attendance</span>
                            </div>
                        </div>

                        {/* Stats breakdown */}
                        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                            <div className="bg-slate-50 rounded-lg p-4 border border-gray-100">
                                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                                    <UserCheck size={18} />
                                    <span className="text-sm font-medium">Present</span>
                                </div>
                                <p className="text-2xl font-bold text-slate-900">
                                    {stats.present_today}
                                </p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-4 border border-gray-100">
                                <div className="flex items-center gap-2 text-rose-600 mb-1">
                                    <UserX size={18} />
                                    <span className="text-sm font-medium">Absent</span>
                                </div>
                                <p className="text-2xl font-bold text-slate-900">
                                    {stats.absent_today}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Info Card */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2 mb-6">
                        <Clock className="text-indigo-500" size={22} />
                        Quick Info
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <span className="text-slate-500">Total Staff</span>
                            <span className="font-semibold text-slate-900">{stats.total_employees}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <span className="text-slate-500">Attendance Rate</span>
                            <span className="font-semibold text-indigo-600">{attendanceRate}%</span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <span className="text-slate-500">Status</span>
                            <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                                Operational
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-8 text-center text-white shadow-md relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-2">
                        Welcome to HRMS Lite
                    </h2>
                    <p className="text-indigo-100 max-w-lg mx-auto">
                        Your modern Human Resource Management System. Navigate using the top menu to manage employees and track attendance.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
