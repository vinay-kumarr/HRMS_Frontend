import React from 'react';

const Spinner = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'h-5 w-5 border-2',
        md: 'h-8 w-8 border-2',
        lg: 'h-12 w-12 border-4',
    };

    return (
        <div className="flex justify-center items-center p-4">
            <div
                className={`${sizeClasses[size]} animate-spin rounded-full border-slate-200 border-t-indigo-600`}
            />
        </div>
    );
};

export default Spinner;
