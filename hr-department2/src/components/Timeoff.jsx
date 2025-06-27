import React, { useState, useEffect } from 'react';
import EmployeeData from '../data/employee_info.json';
import './TimeoffModel.css';

const TIMEOFF_STORAGE_KEY = 'leave_requests';

const Timeoff = () => {
  const [leaveRequests, setLeaveRequests] = useState(() => {
    const stored = localStorage.getItem(TIMEOFF_STORAGE_KEY);
    try {
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Failed to parse leave requests from localStorage:", err);
      return [];
    }
  });

  const [employeeData, setEmployeeData] = useState(EmployeeData.employeeInformation || []);
  const [formData, setFormData] = useState({
    name: '',
    start: '',
    end: '',
    reason: ''
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    localStorage.setItem(TIMEOFF_STORAGE_KEY, JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    setSlideIn(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'name') {
      const found = employeeData.find(emp => emp.name === value);
      setSelectedEmployee(found || null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (new Date(formData.start) > new Date(formData.end)) {
      alert("End date cannot be before start date.");
      return;
    }

    const newRequest = {
      ...formData,
      status: "Pending",
      date: formData.start
    };

    setLeaveRequests(prev => [...prev, newRequest]);
    setFormData({ name: '', start: '', end: '', reason: '' });
    setSelectedEmployee(null);
    setShowModal(false);
  };

  const updateStatus = (index, newStatus) => {
    const updated = [...leaveRequests];
    updated[index].status = newStatus;
    setLeaveRequests(updated);
  };

  const clearAllRequests = () => {
    if (window.confirm("Are you sure you want to clear all leave requests?")) {
      setLeaveRequests([]);
      localStorage.removeItem(TIMEOFF_STORAGE_KEY);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Denied': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div
      className={`container-fluid timeoff-container ${slideIn ? 'slide-in' : ''}`}
    >
      <div className="header d-flex justify-content-between align-items-center mb-4">
        <h2 className="display-5">Leave Requests</h2>
        <div>
          <button className="btn btn-danger me-2" onClick={clearAllRequests}>
            Clear All Requests
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Request Time Off
          </button>
        </div>
      </div>

      <div className="table-container">
        <div >
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Employee</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No leave requests found.</td>
                </tr>
              ) : (
                leaveRequests.map((req, index) => (
                  <tr key={index}>
                    <td>{req.name}</td>
                    <td>{req.start}</td>
                    <td>{req.end}</td>
                    <td>{req.reason}</td>
                    <td>
                      <span className={`badge bg-${getStatusBadgeClass(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      {req.status === 'Pending' ? (
                        <>
                          <button
                            className="btn btn-sm btn-success me-1"
                            onClick={() => updateStatus(index, 'Approved')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => updateStatus(index, 'Denied')}
                          >
                            Deny
                          </button>
                        </>
                      ) : '--'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="custom-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title">Submit Time Off Request</h5>
              <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <label className="form-label">Employee Name</label>
                <select
                  className="form-select mb-3"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Select an employee</option>
                  {employeeData.map(emp => (
                    <option key={emp.employeeId} value={emp.name}>{emp.name}</option>
                  ))}
                </select>

                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  name="start"
                  className="form-control mb-3"
                  value={formData.start}
                  onChange={handleInputChange}
                  required
                />

                <label className="form-label">End Date</label>
                <input
                  type="date"
                  name="end"
                  className="form-control mb-3"
                  value={formData.end}
                  onChange={handleInputChange}
                  required
                />

                <label className="form-label">Reason</label>
                <textarea
                  name="reason"
                  className="form-control mb-3"
                  rows="3"
                  value={formData.reason}
                  onChange={handleInputChange}
                  required
                ></textarea>

                {selectedEmployee && (
                  <div className="alert alert-info">
                    <strong>Position:</strong> {selectedEmployee.position}<br />
                    <strong>Department:</strong> {selectedEmployee.department}<br />
                    <strong>Salary:</strong> R{selectedEmployee.salary}<br />
                    <strong>Email:</strong> {selectedEmployee.contact}<br />
                    <strong>Employment History:</strong> {selectedEmployee.employmentHistory}
                  </div>
                )}

                <button type="submit" className="btn btn-primary w-100">
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeoff;
