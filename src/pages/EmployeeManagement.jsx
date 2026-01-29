import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Users, Pen, Search, X } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import Notification from '../components/ui/Notification';
import { cn } from '../lib/utils';

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [notification, setNotification] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEmployeeId, setCurrentEmployeeId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        employee_id: '',
        full_name: '',
        email: '',
        department: ''
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const showNotification = (type, message) => {
        setNotification({ type, message });
    };

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response = await api.get('/employees/');
            setEmployees(response.data);
        } catch (err) {
            showNotification('error', 'Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                 await api.put(`/employees/${currentEmployeeId}`, formData);
                 showNotification('success', 'Employee updated successfully');
            } else {
                 await api.post('/employees/', formData);
                 showNotification('success', 'Employee added successfully');
            }
            fetchEmployees();
            setIsAddModalOpen(false);
            resetForm();
        } catch (err) {
            const msg = err.response?.data?.detail || (isEditMode ? 'Failed to update employee' : 'Failed to add employee');
            showNotification('error', msg);
        }
    };

    const resetForm = () => {
        setFormData({ employee_id: '', full_name: '', email: '', department: '' });
        setIsEditMode(false);
        setCurrentEmployeeId(null);
    };

    const handleEditClick = (employee) => {
        setFormData({
            employee_id: employee.employee_id,
            full_name: employee.full_name,
            email: employee.email,
            department: employee.department
        });
        setCurrentEmployeeId(employee._id);
        setIsEditMode(true);
        setIsAddModalOpen(true);
    };

    const handleAddClick = () => {
        resetForm();
        setIsAddModalOpen(true);
    };

    const confirmDelete = (id) => {
        setEmployeeToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!employeeToDelete) return;
        try {
            await api.delete(`/employees/${employeeToDelete}`);
            setEmployees(employees.filter(emp => emp._id !== employeeToDelete));
            showNotification('success', 'Employee deleted successfully');
        } catch (err) {
            showNotification('error', 'Failed to delete employee');
        } finally {
            setIsDeleteModalOpen(false);
            setEmployeeToDelete(null);
        }
    };

    const filteredEmployees = employees.filter(emp => 
        emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getDepartmentColor = (dept) => {
        const colors = {
            'HR': 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
            'Engineering': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
            'Sales': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
            'Marketing': 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
            'Finance': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
        };
        return colors[dept] || 'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
                <div className="flex items-center gap-4">
                    <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                        style={{
                            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                            boxShadow: '0 4px 20px rgba(249, 115, 22, 0.3)'
                        }}
                    >
                        <Users className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-display font-bold text-dark-900 dark:text-white">
                            Employees
                        </h1>
                        <p className="text-sm text-dark-500 dark:text-dark-400">
                            Manage your team members
                        </p>
                    </div>
                </div>
                
                <motion.button
                    onClick={handleAddClick}
                    className="btn-primary flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Plus size={20} />
                    Add Employee
                </motion.button>
            </motion.div>

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-xl p-4"
            >
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, ID, or department..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 bg-dark-50/50 dark:bg-dark-800/50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-dark-800 dark:text-white placeholder:text-dark-400 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600 dark:hover:text-dark-200 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </motion.div>

            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            {loading ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center py-20"
                >
                    <div className="glass rounded-2xl p-12">
                        <Spinner />
                    </div>
                </motion.div>
            ) : employees.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass rounded-2xl p-12 text-center"
                >
                    <div className="mx-auto h-16 w-16 text-dark-300 dark:text-dark-600 mb-4 bg-dark-100 dark:bg-dark-800 rounded-full flex items-center justify-center">
                        <Users size={32} />
                    </div>
                    <h3 className="text-xl font-display font-semibold text-dark-900 dark:text-white">No employees yet</h3>
                    <p className="mt-2 text-dark-500 dark:text-dark-400">Get started by adding a new employee.</p>
                    <motion.button
                        onClick={handleAddClick}
                        className="btn-primary mt-6"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Plus size={18} className="mr-2 inline" />
                        Add Your First Employee
                    </motion.button>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="table-glass"
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider bg-dark-50/50 dark:bg-dark-800/50">
                                        Employee ID
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider bg-dark-50/50 dark:bg-dark-800/50">
                                        Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider bg-dark-50/50 dark:bg-dark-800/50">
                                        Department
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider bg-dark-50/50 dark:bg-dark-800/50">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider bg-dark-50/50 dark:bg-dark-800/50">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {filteredEmployees.map((employee, index) => (
                                        <motion.tr
                                            key={employee._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="hover:bg-dark-50/50 dark:hover:bg-dark-700/30 transition-colors border-t border-dark-200/50 dark:border-dark-700/50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-900 dark:text-white">
                                                {employee.employee_id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div 
                                                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)'
                                                        }}
                                                    >
                                                        {employee.full_name.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-medium text-dark-900 dark:text-white">
                                                        {employee.full_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={cn(
                                                    "px-3 py-1 text-xs font-semibold rounded-full",
                                                    getDepartmentColor(employee.department)
                                                )}>
                                                    {employee.department}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-500 dark:text-dark-300">
                                                {employee.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex justify-end gap-2">
                                                    <motion.button
                                                        onClick={() => handleEditClick(employee)}
                                                        className="p-2 rounded-lg text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <Pen size={18} />
                                                    </motion.button>
                                                    <motion.button
                                                        onClick={() => confirmDelete(employee._id)}
                                                        className="p-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <Trash2 size={18} />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {filteredEmployees.length === 0 && searchQuery && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-dark-500 dark:text-dark-400">
                                            No employees match your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {/* Add/Edit Employee Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title={isEditMode ? "Edit Employee" : "Add New Employee"}
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Employee ID</label>
                        <input
                            type="text"
                            name="employee_id"
                            required
                            className="input-glass w-full"
                            value={formData.employee_id}
                            onChange={handleInputChange}
                            placeholder="e.g., EMP001"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Full Name</label>
                        <input
                            type="text"
                            name="full_name"
                            required
                            className="input-glass w-full"
                            value={formData.full_name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="input-glass w-full"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@company.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Department</label>
                        <select
                            name="department"
                            required
                            className="input-glass w-full"
                            value={formData.department}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Department</option>
                            <option value="HR">HR</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Sales">Sales</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Finance">Finance</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-dark-200 dark:border-dark-700">
                        <motion.button
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
                            className="btn-glass"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            type="submit"
                            className="btn-primary"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isEditMode ? 'Update Employee' : 'Add Employee'}
                        </motion.button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Deletion"
            >
                <div className="space-y-4">
                    <p className="text-dark-600 dark:text-dark-300">
                        Are you sure you want to delete this employee? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 pt-4 border-t border-dark-200 dark:border-dark-700">
                        <motion.button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="btn-glass"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            onClick={handleDelete}
                            className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Delete
                        </motion.button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default EmployeeManagement;
