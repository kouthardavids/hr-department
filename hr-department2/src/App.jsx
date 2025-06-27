// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import AttendancePage from './pages/AttendancePage';
import PayrollPage from './pages/PayrollPage';
import TimeoffPage from './pages/TimeoffPage';
import Review from './pages/Review'; // This is your performance review page

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/employees" element={<EmployeesPage />} />
      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/payroll" element={<PayrollPage />} />
      <Route path="/timeoff" element={<TimeoffPage />} />
      <Route path="/performance" element={<Review />} /> {/* Route for your review page */}
    </Routes>
  );
}

export default App;
