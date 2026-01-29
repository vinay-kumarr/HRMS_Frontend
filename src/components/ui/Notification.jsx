import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Notification = ({ type = 'success', message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!message) return null;

    const isSuccess = type === 'success';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
                    isSuccess 
                        ? 'bg-emerald-500/90 border-emerald-400/30 text-white' 
                        : 'bg-rose-500/90 border-rose-400/30 text-white'
                }`}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                >
                    {isSuccess ? (
                        <CheckCircle size={22} />
                    ) : (
                        <XCircle size={22} />
                    )}
                </motion.div>
                <span className="font-medium">{message}</span>
                <motion.button
                    onClick={onClose}
                    className="ml-2 p-1 rounded-lg hover:bg-white/20 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <X size={16} />
                </motion.button>
            </motion.div>
        </AnimatePresence>
    );
};

export default Notification;
