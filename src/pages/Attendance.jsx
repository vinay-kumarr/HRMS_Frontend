import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Calendar, UserCheck, UserX, Percent, ChevronDown, X } from 'lucide-react';
import api from '../services/api';
import Spinner from '../components/ui/Spinner';
import Notification from '../components/ui/Notification';
import { cn } from '../lib/utils';

const Attendance = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [markDate, setMarkDate] = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState('Present');
    const [notification, setNotification] = useState(null);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const showNotification = (type, message) => {
        setNotification({ type, message });
    };

    useEffect(() => {
        if (selectedEmployee) {
            const empObj = employees.find(e => e._id === selectedEmployee);
            if (empObj) {
                fetchAttendance(empObj.employee_id);
            }
        } else {
            setAttendanceRecords([]);
        }
    }, [selectedEmployee, employees]);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/employees/');
            setEmployees(response.data);
        } catch (err) {
            showNotification('error', 'Failed to fetch employees');
        }
    };

    const fetchAttendance = async (empId) => {
        setLoading(true);
        try {
            const response = await api.get(`/attendance/${empId}`);
            const sorted = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setAttendanceRecords(sorted);
        } catch (err) {
            showNotification('error', 'Failed to fetch attendance');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAttendance = async (e) => {
        e.preventDefault();
        if (!selectedEmployee) {
            showNotification('error', 'Please select an employee');
            return;
        }

        try {
            const empObj = employees.find(e => e._id === selectedEmployee);
            if (!empObj) return;

            const payload = {
                employee_id: empObj.employee_id,
                date: markDate,
                status: status
            };

            await api.post('/attendance/', payload);
            fetchAttendance(payload.employee_id);
            showNotification('success', 'Attendance marked successfully');
        } catch (err) {
            const msg = err.response?.data?.detail || 'Failed to mark attendance';
            showNotification('error', msg);
        }
    };

    const filteredRecords = useMemo(() => {
        return attendanceRecords.filter(record => {
            if (startDate && new Date(record.date) < new Date(startDate)) return false;
            if (endDate && new Date(record.date) > new Date(endDate)) return false;
            return true;
        });
    }, [attendanceRecords, startDate, endDate]);

    const stats = useMemo(() => {
        const total = filteredRecords.length;
        const present = filteredRecords.filter(r => r.status === 'Present').length;
        const absent = total - present;
        const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
        return { total, present, absent, percentage };
    }, [filteredRecords]);

    const selectedEmployeeData = employees.find(e => e._id === selectedEmployee);

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div className="flex items-center gap-4">
                    <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                        style={{
                            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                            boxShadow: '0 4px 20px rgba(249, 115, 22, 0.3)'
                        }}
                    >
                        <Calendar className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-display font-bold text-dark-900 dark:text-white">
                            Attendance
                        </h1>
                        <p className="text-sm text-dark-500 dark:text-dark-400">
                            Track and manage employee attendance
                        </p>
                    </div>
                </div>
            </motion.div>

            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Attendance Marking Form */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-1"
                >
                    <div className="glass rounded-2xl p-6 sticky top-24">
                        <h2 className="text-lg font-display font-semibold text-dark-900 dark:text-white mb-6 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                <UserCheck className="text-orange-600 dark:text-orange-400" size={18} />
                            </div>
                            Mark Attendance
                        </h2>
                        
                        <form onSubmit={handleMarkAttendance} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
                                    Select Employee
                                </label>
                                <div className="relative">
                                    <select
                                        className="input-glass w-full appearance-none pr-10"
                                        value={selectedEmployee}
                                        onChange={(e) => setSelectedEmployee(e.target.value)}
                                        required
                                    >
                                        <option value="">-- Choose Employee --</option>
                                        {employees.map(emp => (
                                            <option key={emp._id} value={emp._id}>
                                                {emp.full_name} ({emp.employee_id})
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 pointer-events-none" size={18} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    required
                                    className="input-glass w-full"
                                    value={markDate}
                                    onChange={(e) => setMarkDate(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-3">
                                    Status
                                </label>
                                <div className="flex gap-3">
                                    <motion.button
                                        type="button"
                                        onClick={() => setStatus('Present')}
                                        className={cn(
                                            "flex-1 py-3 rounded-xl font-medium text-sm transition-all border-2",
                                            status === 'Present'
                                                ? "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                                                : "border-dark-200 dark:border-dark-600 text-dark-500 dark:text-dark-400 hover:border-emerald-300"
                                        )}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <UserCheck size={18} className="inline mr-2" />
                                        Present
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        onClick={() => setStatus('Absent')}
                                        className={cn(
                                            "flex-1 py-3 rounded-xl font-medium text-sm transition-all border-2",
                                            status === 'Absent'
                                                ? "bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-300"
                                                : "border-dark-200 dark:border-dark-600 text-dark-500 dark:text-dark-400 hover:border-rose-300"
                                        )}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <UserX size={18} className="inline mr-2" />
                                        Absent
                                    </motion.button>
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                className="btn-primary w-full mt-4"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Submit Attendance
                            </motion.button>
                        </form>
                    </div>
                </motion.div>

                {/* Attendance History & Stats */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 space-y-6"
                >
                    {/* Stats Cards */}
                    <AnimatePresence>
                        {selectedEmployee && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -20, height: 0 }}
                                className="grid grid-cols-3 gap-4"
                            >
                                <motion.div
                                    className="stat-card text-center"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                                        <UserCheck className="text-emerald-600 dark:text-emerald-400" size={20} />
                                    </div>
                                    <p className="text-xs text-dark-500 dark:text-dark-400 uppercase font-semibold mb-1">Present</p>
                                    <p className="text-2xl font-display font-bold text-emerald-600 dark:text-emerald-400">{stats.present}</p>
                                </motion.div>
                                <motion.div
                                    className="stat-card text-center"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.15 }}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mx-auto mb-3">
                                        <UserX className="text-rose-600 dark:text-rose-400" size={20} />
                                    </div>
                                    <p className="text-xs text-dark-500 dark:text-dark-400 uppercase font-semibold mb-1">Absent</p>
                                    <p className="text-2xl font-display font-bold text-rose-600 dark:text-rose-400">{stats.absent}</p>
                                </motion.div>
                                <motion.div
                                    className="stat-card text-center"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-3">
                                        <Percent className="text-orange-600 dark:text-orange-400" size={20} />
                                    </div>
                                    <p className="text-xs text-dark-500 dark:text-dark-400 uppercase font-semibold mb-1">Rate</p>
                                    <p className="text-2xl font-display font-bold text-orange-600 dark:text-orange-400">{stats.percentage}%</p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* History Table */}
                    <div className="glass rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-dark-200/50 dark:border-dark-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-dark-50/30 dark:bg-dark-800/30">
                            <div>
                                <h2 className="text-lg font-display font-semibold text-dark-900 dark:text-white">
                                    Attendance History
                                </h2>
                                {selectedEmployeeData && (
                                    <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
                                        Showing records for <span className="font-medium text-orange-600 dark:text-orange-400">{selectedEmployeeData.full_name}</span>
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <div className="flex items-center gap-2 glass-subtle rounded-lg px-3 py-1.5">
                                    <Filter size={14} className="text-dark-400" />
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="bg-transparent border-0 text-sm text-dark-700 dark:text-dark-200 focus:outline-none w-28"
                                    />
                                    <span className="text-dark-400">-</span>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="bg-transparent border-0 text-sm text-dark-700 dark:text-dark-200 focus:outline-none w-28"
                                    />
                                </div>
                                {(startDate || endDate) && (
                                    <motion.button
                                        onClick={() => { setStartDate(''); setEndDate(''); }}
                                        className="p-1.5 rounded-lg text-dark-400 hover:text-dark-600 dark:hover:text-dark-200 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <X size={16} />
                                    </motion.button>
                                )}
                            </div>
                        </div>

                        {!selectedEmployee ? (
                            <div className="p-16 text-center">
                                <div className="w-16 h-16 rounded-full bg-dark-100 dark:bg-dark-800 flex items-center justify-center mx-auto mb-4">
                                    <Calendar size={32} className="text-dark-300 dark:text-dark-600" />
                                </div>
                                <h3 className="text-lg font-display font-semibold text-dark-900 dark:text-white mb-2">
                                    No Employee Selected
                                </h3>
                                <p className="text-sm text-dark-500 dark:text-dark-400">
                                    Select an employee to view their attendance record.
                                </p>
                            </div>
                        ) : loading ? (
                            <div className="py-16 flex justify-center">
                                <Spinner />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-dark-50/50 dark:bg-dark-800/50">
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider">
                                                Logged At
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <AnimatePresence>
                                            {filteredRecords.length === 0 ? (
                                                <tr>
                                                    <td colSpan="3" className="px-6 py-12 text-center text-dark-500 dark:text-dark-400">
                                                        No records found for the selected range.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredRecords.map((record, index) => (
                                                    <motion.tr
                                                        key={record._id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.02 }}
                                                        className="hover:bg-dark-50/50 dark:hover:bg-dark-700/30 transition-colors border-t border-dark-200/50 dark:border-dark-700/50"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-900 dark:text-white">
                                                            {new Date(record.date).toLocaleDateString('en-US', {
                                                                weekday: 'short',
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={cn(
                                                                "px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5",
                                                                record.status === 'Present'
                                                                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                                                                    : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'
                                                            )}>
                                                                {record.status === 'Present' ? (
                                                                    <UserCheck size={12} />
                                                                ) : (
                                                                    <UserX size={12} />
                                                                )}
                                                                {record.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-500 dark:text-dark-400">
                                                            {new Date(record.timestamp).toLocaleTimeString('en-US', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </td>
                                                    </motion.tr>
                                                ))
                                            )}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Attendance;
