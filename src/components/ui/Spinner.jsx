import React from 'react';
import { motion } from 'framer-motion';

const Spinner = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'h-5 w-5',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <div className="flex justify-center items-center p-4">
            <motion.div
                className={`${sizeClasses[size]} rounded-full border-2 border-dark-200 dark:border-dark-600 border-t-orange-500`}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
        </div>
    );
};

export default Spinner;
