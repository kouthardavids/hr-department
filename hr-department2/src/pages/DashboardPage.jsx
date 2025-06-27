import React, { useState, useEffect } from 'react';
import DashboardContent from '../components/DashboardContent';

const EMPLOYEE_STORAGE_KEY = 'employees_data';
const ATTENDANCE_STORAGE_KEY = 'attendanceRecords';
const PAYROLL_STORAGE_KEY = 'total_payroll';
const TIMEOFF_STORAGE_KEY = 'leave_requests';  // Add this

const DashboardPage = () => {
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [overallAttendancePercent, setOverallAttendancePercent] = useState(0);
    const [totalPayroll, setTotalPayroll] = useState(0);
    const [timeOffCounts, setTimeOffCounts] = useState({
        approved: 0,
        denied: 0,
        pending: 0
    });

    useEffect(() => {
        // Load total employees
        const savedEmployees = localStorage.getItem(EMPLOYEE_STORAGE_KEY);
        if (savedEmployees) {
            try {
                const employees = JSON.parse(savedEmployees);
                setTotalEmployees(employees.length);
            } catch {
                setTotalEmployees(0);
            }
        }

        // Load attendance data and calculate percentage
        const savedAttendance = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
        if (savedAttendance) {
            try {
                const attendanceRecords = JSON.parse(savedAttendance);

                const totalDays = attendanceRecords.reduce((acc, emp) => {
                    return acc + Object.values(emp.attendance).length;
                }, 0);

                const totalPresent = attendanceRecords.reduce((acc, emp) => {
                    return acc + Object.values(emp.attendance).filter((s) => s === 'Present').length;
                }, 0);

                const percent = totalDays === 0 ? 0 : ((totalPresent / totalDays) * 100).toFixed(1);
                setOverallAttendancePercent(percent);
            } catch {
                setOverallAttendancePercent(0);
            }
        }

        // Load total payroll
        const savedPayroll = localStorage.getItem(PAYROLL_STORAGE_KEY);
        if (savedPayroll) {
            setTotalPayroll(parseFloat(savedPayroll));
        }

        // NEW: Load leave requests and count statuses
        const savedRequests = localStorage.getItem(TIMEOFF_STORAGE_KEY);
        if (savedRequests) {
            try {
                const leaveRequests = JSON.parse(savedRequests);
                const approved = leaveRequests.filter(req => req.status === 'Approved').length;
                const denied = leaveRequests.filter(req => req.status === 'Denied').length;
                const pending = leaveRequests.filter(req => req.status === 'Pending').length;
                setTimeOffCounts({ approved, denied, pending });
            } catch {
                setTimeOffCounts({ approved: 0, denied: 0, pending: 0 });
            }
        }
    }, []);

    return (
        <>
       <DashboardContent
            totalEmployees={totalEmployees}
            overallAttendancePercent={overallAttendancePercent}
            totalPayroll={totalPayroll}
            timeOffCounts={timeOffCounts} // pass counts as props
        />
        </>
    );
};

export default DashboardPage;
