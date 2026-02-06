import React, { useState, useEffect, useMemo } from 'react';
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Calendar className="text-indigo-600" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Attendance
                        </h1>
                        <p className="text-sm text-slate-500">
                            Track and manage employee attendance
                        </p>
                    </div>
                </div>
            </div>

            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Attendance Marking Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
                        <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <UserCheck className="text-indigo-600" size={18} />
                            </div>
                            Mark Attendance
                        </h2>

                        <form onSubmit={handleMarkAttendance} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Select Employee
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent appearance-none pr-10"
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
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
                                    value={markDate}
                                    onChange={(e) => setMarkDate(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Status
                                </label>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setStatus('Present')}
                                        className={cn(
                                            "flex-1 py-2 rounded-md font-medium text-sm transition-all border",
                                            status === 'Present'
                                                ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                                                : "border-gray-200 text-slate-600 hover:bg-slate-50"
                                        )}
                                    >
                                        <UserCheck size={16} className="inline mr-2" />
                                        Present
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStatus('Absent')}
                                        className={cn(
                                            "flex-1 py-2 rounded-md font-medium text-sm transition-all border",
                                            status === 'Absent'
                                                ? "bg-rose-50 border-rose-500 text-rose-700"
                                                : "border-gray-200 text-slate-600 hover:bg-slate-50"
                                        )}
                                    >
                                        <UserX size={16} className="inline mr-2" />
                                        Absent
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
                            >
                                Submit Attendance
                            </button>
                        </form>
                    </div>
                </div>

                {/* Attendance History & Stats */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Cards */}
                    {selectedEmployee && (
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                                    <UserCheck className="text-emerald-600" size={20} />
                                </div>
                                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Present</p>
                                <p className="text-2xl font-bold text-emerald-600">{stats.present}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                                <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center mx-auto mb-2">
                                    <UserX className="text-rose-600" size={20} />
                                </div>
                                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Absent</p>
                                <p className="text-2xl font-bold text-rose-600">{stats.absent}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mx-auto mb-2">
                                    <Percent className="text-indigo-600" size={20} />
                                </div>
                                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Rate</p>
                                <p className="text-2xl font-bold text-indigo-600">{stats.percentage}%</p>
                            </div>
                        </div>
                    )}

                    {/* History Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Attendance History
                                </h2>
                                {selectedEmployeeData && (
                                    <p className="text-sm text-slate-500 mt-1">
                                        Showing records for <span className="font-medium text-indigo-600">{selectedEmployeeData.full_name}</span>
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-1.5">
                                    <Filter size={14} className="text-slate-400" />
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="bg-transparent border-0 text-sm text-slate-700 focus:outline-none w-28"
                                    />
                                    <span className="text-slate-400">-</span>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="bg-transparent border-0 text-sm text-slate-700 focus:outline-none w-28"
                                    />
                                </div>
                                {(startDate || endDate) && (
                                    <button
                                        onClick={() => { setStartDate(''); setEndDate(''); }}
                                        className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {!selectedEmployee ? (
                            <div className="p-16 text-center">
                                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                    <Calendar size={32} className="text-slate-300" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                    No Employee Selected
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Select an employee to view their attendance record.
                                </p>
                            </div>
                        ) : loading ? (
                            <div className="py-16 flex justify-center">
                                <Spinner />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                                Logged At
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredRecords.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-12 text-center text-slate-500">
                                                    No records found for the selected range.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredRecords.map((record) => (
                                                <tr key={record._id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                                        {new Date(record.date).toLocaleDateString('en-US', {
                                                            weekday: 'short',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={cn(
                                                            "px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center gap-1.5",
                                                            record.status === 'Present'
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : 'bg-rose-100 text-rose-700'
                                                        )}>
                                                            {record.status === 'Present' ? (
                                                                <UserCheck size={12} />
                                                            ) : (
                                                                <UserX size={12} />
                                                            )}
                                                            {record.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                        {new Date(record.timestamp).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
