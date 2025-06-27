import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './DashboardContent.css';
import { Pie, Bar } from 'react-chartjs-2';
import SideBar from './SideBar'; // make sure path is correct
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function DashboardContent({
    totalEmployees,
    overallAttendancePercent,
    totalPayroll,
    timeOffCounts,
    employeeCategories = { fullTime: 60, partTime: 30, contractors: 10 }
}) {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);

    // Animated counts for all three metrics
    const [countEmployees, setCountEmployees] = useState(0);
    const [countAttendance, setCountAttendance] = useState(0);
    const [countPayroll, setCountPayroll] = useState(0);

    const location = useLocation();

    const toggleSidebar = () => {
        setSidebarExpanded(!sidebarExpanded);
    };

    // Adds animation to the total employees
    useEffect(() => {
        let frame;
        let current = 0;
        const duration = 2000;
        const increment = totalEmployees / (duration / 16);

        function updateCounter() {
            current += increment;
            if (current < totalEmployees) {
                setCountEmployees(Math.floor(current));
                frame = requestAnimationFrame(updateCounter);
            } else {
                setCountEmployees(totalEmployees);
                cancelAnimationFrame(frame);
            }
        }
        updateCounter();

        return () => cancelAnimationFrame(frame);
    }, [totalEmployees]);

    // Adds animation to the attendance percentage
    useEffect(() => {
        let frame;
        let current = 0;
        const duration = 2000;
        const increment = overallAttendancePercent / (duration / 16);

        function updateAttendance() {
            current += increment;
            if (current < overallAttendancePercent) {
                setCountAttendance(Math.floor(current));
                frame = requestAnimationFrame(updateAttendance);
            } else {
                setCountAttendance(overallAttendancePercent);
                cancelAnimationFrame(frame);
            }
        }
        updateAttendance();

        return () => cancelAnimationFrame(frame);
    }, [overallAttendancePercent]);

    // Adds animation to the total payroll
    useEffect(() => {
        let frame;
        let current = 0;
        const duration = 2000;
        const increment = totalPayroll / (duration / 16);

        function updatePayroll() {
            current += increment;
            if (current < totalPayroll) {
                setCountPayroll(Math.floor(current));
                frame = requestAnimationFrame(updatePayroll);
            } else {
                setCountPayroll(totalPayroll);
                cancelAnimationFrame(frame);
            }
        }
        updatePayroll();

        return () => cancelAnimationFrame(frame);
    }, [totalPayroll]);

    const messages = [
        "📢 Reminder: Submit your monthly reports.",
        "📝 Update: New HR policies have been released.",
        "💡 Tip: Attend the upcoming training session.",
        "📅 Note: Annual leave requests close next week.",
        "🔔 Announcement: Team meeting scheduled for Friday.",
        "⚠️ Please complete your performance reviews by end of month.",
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentIndex(i => (i + 1) % messages.length);
                setFade(true);
            }, 800);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    const isActive = (path) =>
        location.pathname === path ? "page-links active" : "page-links";

    const pieData = {
        labels: ['Full-Time', 'Part-Time', 'Contractors'],
        datasets: [
            {
                label: 'Employee Breakdown',
                data: [
                    employeeCategories.fullTime,
                    employeeCategories.partTime,
                    employeeCategories.contractors
                ],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(255, 99, 132, 0.7)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#393739' }
            }
        }
    };

    const barData = {
        labels: ['Full-Time', 'Part-Time', 'Contractors'],
        datasets: [
            {
                label: 'Employees Count',
                data: [
                    employeeCategories.fullTime,
                    employeeCategories.partTime,
                    employeeCategories.contractors
                ],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(255, 99, 132, 0.8)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: '#393739' }
            },
            x: {
                ticks: { color: '#393739' }
            }
        },
        plugins: {
            legend: { display: false }
        }
    };

    return (
        <>
            <main>
                <SideBar sidebarExpanded={sidebarExpanded} toggleSidebar={toggleSidebar} />

                <section className={`contentWidth ${sidebarExpanded ? 'expanded' : ''}`}>
                    <br />
                    <h2 className="container contentWidth mb-1 animationTop" style={{ fontWeight: 600 }}>Main Dashboard</h2>
                    <div className="container contentWidth text-start mt-4">
                        <div className="row align-items-start">
                            {/* Total and Percentage Cards (horizontal) */}
                            <div className="col-sm-8 p-3 animationLeft">
                                <h4>Overview</h4>
                                <div className="row gap-3 mt-3 p-2">
                                    {/* Total Employees */}
                                    <div className="col-sm dashboard-content stat-card text-center p-4">
                                        <i className="fa-solid fa-users mb-2 p-2 icon-purple"></i>
                                        <div className="stat-number">{countEmployees}</div>
                                        <div className="stat-label">Total Employees</div>
                                    </div>

                                    {/* Attendance Percentage */}
                                    <div className="col-sm dashboard-content stat-card text-center p-4">
                                        <i className="fa-solid fa-percent mb-2 p-2 icon-purple"></i>
                                        <div className="stat-number">{countAttendance}%</div>
                                        <div className="stat-label">Attendance Percentage</div>
                                    </div>

                                    {/* Total Monthly Payroll */}
                                    <div className="col-sm dashboard-content stat-card text-center p-4">
                                        <i className="fa-solid fa-money-bill-transfer mb-2 p-2 icon-purple"></i>
                                        <div className="stat-number">R{countPayroll}</div>
                                        <div className="stat-label">Total Monthly Payroll</div>
                                    </div>

                                    <div className="mt-4">
                                        <h4>Employee Breakdown</h4>
                                    </div>

                                    <div
                                        className="dashboard-content p-3 d-flex justify-content-around align-items-center"
                                        style={{ gap: '20px', minHeight: '280px' }}
                                    >
                                        <div style={{ flex: '1 1 45%', height: '280px', maxWidth: '300px' }}>
                                            <Pie data={pieData} options={pieOptions} />
                                        </div>
                                        <div style={{ flex: '1 1 45%', height: '280px', maxWidth: '300px' }}>
                                            <Bar data={barData} options={barOptions} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Time off cards (vertical cards) */}
                            <div className="col-sm-4 p-3 animationRight">
                                <h4>Time-off Requests</h4>
                                <div
                                    className="dashboard-content p-3 mt-4 mb-3"
                                    style={{ backgroundImage: 'linear-gradient(#f69610, #fbc100)' }}
                                >
                                    <h5 className="fw-bold">Pending</h5>
                                    <p>{timeOffCounts.pending}</p>
                                </div>
                                <div
                                    className="dashboard-content p-3 mb-3"
                                    style={{ backgroundImage: 'linear-gradient(#38a638, #89e789)' }}
                                >
                                    <h5 className="fw-bold">Approved</h5>
                                    <p>{timeOffCounts.approved}</p>
                                </div>
                                <div
                                    className="dashboard-content p-3 mb-3"
                                    style={{ backgroundImage: 'linear-gradient(#c82c26, #dd7470)' }}
                                >
                                    <h5 className="fw-bold">Denied</h5>
                                    <p>{timeOffCounts.denied}</p>
                                </div>
                                <br />
                                <h4>Reminders</h4>
                                <div className="dashboard-content p-3 mt-4 mb-3" style={{ minHeight: '80px' }}>
                                    <h5
                                        style={{
                                            opacity: fade ? 1 : 0,
                                            transition: 'opacity 0.5s ease-in-out',
                                            margin: 0
                                        }}
                                    >
                                        {messages[currentIndex]}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default DashboardContent;
