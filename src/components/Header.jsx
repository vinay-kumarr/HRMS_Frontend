import React from 'react';
import { Bell, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/dashboard': return 'HRMS Lite Dashboard';
            case '/employees': return 'Employee Management';
            case '/attendance': return 'Attendance Management';
            default: return 'HRMS Lite';
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between sticky top-0 z-10 w-full transition-colors duration-200">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button is in Layout, here just title */}
                <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="h-8 w-px bg-gray-200 mx-2"></div>
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-sm font-medium text-gray-900">Admin</span>
                        <span className="text-xs text-gray-500">Administrator</span>
                    </div>
                    <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                        A
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
