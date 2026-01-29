import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import EmployeeManagement from './pages/EmployeeManagement';
import Attendance from './pages/Attendance';
import Dashboard from './pages/Dashboard';
import { ThemeProvider } from './context/ThemeContext';

function App() {
    const [isLoading, setIsLoading] = useState(true);

    const handleLoadingComplete = () => {
        setIsLoading(false);
    };

    return (
        <ThemeProvider>
            <AnimatePresence>
                {isLoading && (
                    <LoadingScreen onLoadingComplete={handleLoadingComplete} />
                )}
            </AnimatePresence>
            
            {!isLoading && (
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/employees" element={<EmployeeManagement />} />
                            <Route path="/attendance" element={<Attendance />} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </Layout>
                </Router>
            )}
        </ThemeProvider>
    );
}

export default App;
