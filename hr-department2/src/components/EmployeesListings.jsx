import React, { useState, useEffect } from 'react';
import employeeInfo from '../data/employee_info.json';
import './EmployeesListings.css';

const LOCAL_STORAGE_KEY = 'employees_data';

const EmployeesListings = () => {
  const [employees, setEmployees] = useState(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {}
    }
    return employeeInfo.employeeInformation;
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    department: '',
    salary: '',
    contact: '',
    employmentType: '',
  });

  const [addErrors, setAddErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(employees));
  }, [employees]);

  const validateEmployee = (employee) => {
    const errors = {};
    Object.entries(employee).forEach(([key, value]) => {
      if (key === 'employeeId') return;
      if (!value || value.toString().trim() === '') {
        errors[key] = 'Cannot be empty';
      }
    });

    if (employee.salary && isNaN(Number(employee.salary))) {
      errors.salary = 'Salary must be a number';
    }

    const phoneRegex = /^[0-9\-\+]{9,15}$/;
    if (employee.contact && !phoneRegex.test(employee.contact)) {
      errors.contact = 'Invalid phone number';
    }

    const validTypes = ['Full-Time', 'Part-Time', 'Contractor'];
    if (employee.employmentType && !validTypes.includes(employee.employmentType)) {
      errors.employmentType = 'Must be Full-Time, Part-Time, or Contractor';
    }

    return errors;
  };

  const handleAdd = () => {
    const errors = validateEmployee(newEmployee);
    if (Object.keys(errors).length > 0) {
      setAddErrors(errors);
      return;
    }
    const maxId = employees.length > 0 ? Math.max(...employees.map((emp) => emp.employeeId)) : 0;
    const newId = maxId + 1;

    setEmployees([
      ...employees,
      { ...newEmployee, employeeId: newId, salary: Number(newEmployee.salary) },
    ]);
    setNewEmployee({
      name: '',
      position: '',
      department: '',
      salary: '',
      contact: '',
      employmentType: '',
    });
    setAddErrors({});
    setModalOpen(false);
  };

  const handleSaveEdit = () => {
    const errors = validateEmployee(editingEmployee);
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.employeeId === editingEmployee.employeeId
          ? { ...editingEmployee, salary: Number(editingEmployee.salary) }
          : emp
      )
    );
    setEditErrors({});
    setEditingEmployee(null);
  };

  const handleDelete = (id) => {
    setEmployees(employees.filter((emp) => emp.employeeId !== id));
  };

  return (
    <section>
      <div id="app">
        <h2 className="contentWidth mt-4 mb-4" style={{ fontWeight: 600 }}>
          Employees List
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            id="addEmployeeBtn"
            className="addBtn"
            onClick={() => setModalOpen(true)}
          >
            Add Employee
          </button>
        </div>

        <div>
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Type</th>
                <th>Salary</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center">
                    No employees found.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.employeeId}>
                    <td>{emp.employeeId}</td>
                    <td>{emp.name}</td>
                    <td>{emp.position}</td>
                    <td>{emp.department}</td>
                    <td>{emp.employmentType}</td>
                    <td>{emp.salary}</td>
                    <td>{emp.contact}</td>
                    <td>
                      <button className="btn" onClick={() => setViewingEmployee(emp)}>
                        View
                      </button>
                      <button
                        className="editBtn"
                        onClick={() => {
                          setEditingEmployee({ ...emp });
                          setEditErrors({});
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="deleteBtn"
                        onClick={() => handleDelete(emp.employeeId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL: Add Employee */}
        {modalOpen && (
          <div style={styles.overlay} onClick={() => setModalOpen(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h3>Add New Employee</h3>
              {['name', 'position', 'department', 'salary', 'contact'].map((field) => (
                <div key={field}>
                  <input
                    placeholder={field}
                    value={newEmployee[field]}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, [field]: e.target.value })
                    }
                    style={styles.input}
                  />
                  {addErrors[field] && (
                    <div style={styles.error}>{addErrors[field]}</div>
                  )}
                </div>
              ))}
              <div>
                <select
                  value={newEmployee.employmentType}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, employmentType: e.target.value })
                  }
                  style={styles.input}
                >
                  <option value="">Select Employment Type</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contractor">Contractor</option>
                </select>
                {addErrors.employmentType && (
                  <div style={styles.error}>{addErrors.employmentType}</div>
                )}
              </div>
              <button style={styles.saveBtn} onClick={handleAdd}>
                Save
              </button>
              <button
                style={styles.cancelBtn}
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* MODAL: View Employee */}
        {viewingEmployee && (
          <div style={styles.overlay} onClick={() => setViewingEmployee(null)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h3>{viewingEmployee.name}'s Profile</h3>
              <p><strong>Position:</strong> {viewingEmployee.position}</p>
              <p><strong>Department:</strong> {viewingEmployee.department}</p>
              <p><strong>Salary:</strong> {viewingEmployee.salary}</p>
              <p><strong>Contact:</strong> {viewingEmployee.contact}</p>
              <p><strong>Type:</strong> {viewingEmployee.employmentType}</p>
              <button
                style={styles.cancelBtn}
                onClick={() => setViewingEmployee(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* MODAL: Edit Employee */}
        {editingEmployee && (
          <div style={styles.overlay} onClick={() => setEditingEmployee(null)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h3>Edit Employee</h3>
              {['name', 'position', 'department', 'salary', 'contact'].map((field) => (
                <div key={field}>
                  <input
                    value={editingEmployee[field]}
                    onChange={(e) =>
                      setEditingEmployee({ ...editingEmployee, [field]: e.target.value })
                    }
                    style={styles.input}
                  />
                  {editErrors[field] && (
                    <div style={styles.error}>{editErrors[field]}</div>
                  )}
                </div>
              ))}
              <div>
                <select
                  value={editingEmployee.employmentType}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      employmentType: e.target.value,
                    })
                  }
                  style={styles.input}
                >
                  <option value="">Select Employment Type</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contractor">Contractor</option>
                </select>
                {editErrors.employmentType && (
                  <div style={styles.error}>{editErrors.employmentType}</div>
                )}
              </div>
              <button style={styles.saveBtn} onClick={handleSaveEdit}>
                Save
              </button>
              <button
                style={styles.cancelBtn}
                onClick={() => setEditingEmployee(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    minWidth: 300,
    width: '90%',
    maxWidth: 400,
  },
  input: {
    display: 'block',
    width: '100%',
    padding: 8,
    borderRadius: 4,
    border: '1px solid #ccc',
    marginBottom: 10,
  },
  saveBtn: {
    padding: '10px 16px',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    backgroundColor: '#7e289e',
    backgroundImage: 'linear-gradient(#7e289e, #9b59b6)',
    color: 'white',
    marginRight: 10,
  },
  cancelBtn: {
    padding: '10px 16px',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    backgroundColor: '#95a5a6',
    color: 'white',
  },
  error: {
    color: 'red',
    fontSize: 12,
  },
};

export default EmployeesListings;
