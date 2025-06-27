import React, { useState, useEffect, useMemo } from "react";
import AttendanceDataRaw from "../data/attendance.json";

const departmentMap = {
  1: "HR",
  2: "Engineering",
  3: "Engineering",
  4: "Sales",
  5: "HR",
  6: "Finance",
  7: "Engineering",
  8: "HR",
  9: "Marketing",
  10: "HR",
};

const statuses = ["Present", "Absent", "Late", "On Leave"];

const styles = {
  container: {
    padding: 40,
    fontFamily: "'Raleway', sans-serif",
    color: "#393739",
    backgroundColor: "#f0f0f0",
    minHeight: "100vh",
    overflow: "hidden",
    transition: "all 0.35s ease-in-out",
    width: "100%",
  },
  input: {
    padding: 5,
    marginRight: 10,
    borderRadius: 5,
    border: "1px solid #262626",
  },
  select: {
    cursor: "pointer",
    textAlign: "center",
    borderRadius: 5,
    border: "1px solid #262626",
    padding: 5,
  },
  button: {
    border: "none",
    color: "#fff",
    fontWeight: 600,
    fontSize: "1rem",
    backgroundImage: "linear-gradient(#7e289e , #9b59b6)",
    borderRadius: 19,
    padding: "10px 50px",
    marginLeft: 20,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  buttonHover: {
    backgroundImage: "linear-gradient(#a750c4 , #9b59b6)",
    boxShadow: "0 2px 5px rgba(155, 89, 182, 0.8)",
    transform: "scale(1.01)",
  },
  totalPresentText: {
    color: "#262626",
    fontWeight: 600,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 40,
  },
  th: {
    border: "1px solid #ddd",
    padding: 8,
    textAlign: "left",
    backgroundColor: "#262626",
    color: "#fff",
  },
  td: {
    border: "1px solid #ddd",
    padding: 8,
    textAlign: "left",
  },
  tdCenter: {
    textAlign: "center",
    border: "1px solid #ddd",
    padding: 8,
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 8,
    overflowY: "auto",
    maxWidth: 700,
    margin: "auto 0",
    maxHeight: "90vh",
    minWidth: 300,
  },
  modalCloseButton: {
    marginTop: 20,
    border: "none",
    color: "#fff",
    fontWeight: 600,
    fontSize: "1rem",
    backgroundImage: "linear-gradient(#7e289e , #9b59b6)",
    borderRadius: 19,
    padding: "10px 50px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  modalCloseButtonHover: {
    backgroundImage: "linear-gradient(#a750c4 , #9b59b6)",
    boxShadow: "0 2px 5px rgba(155, 89, 182, 0.8)",
    transform: "scale(1.01)",
  },
  statusColors: {
    Present: { color: "#16a34a" },
    Absent: { color: "#dc2626" },
    Late: { color: "#eab308" },
    "On Leave": { color: "#3b82f6" },
    Default: { color: "#9ca3af" },
  },
};

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [buttonHover, setButtonHover] = useState(false);
  const [modalButtonHover, setModalButtonHover] = useState(false);

  // Load attendance data on mount
  useEffect(() => {
    const raw = AttendanceDataRaw.attendanceAndLeave;
    const data = raw.map((p) => ({
      id: p.employeeId,
      name: p.name,
      department: departmentMap[p.employeeId] || "General",
      attendance: Object.fromEntries(p.attendance.map((a) => [a.date, a.status])),
      leaveRequests: p.leaveRequests,
    }));
    setAttendanceRecords(data);

    // Compute date range
    const datesSet = new Set();
    data.forEach(({ attendance }) => {
      Object.keys(attendance).forEach((date) => datesSet.add(date));
    });
    const sortedDates = Array.from(datesSet).sort();
    setDateRange(sortedDates);
  }, []);

  const departments = useMemo(() => {
    const deptSet = new Set(attendanceRecords.map((e) => e.department));
    return ["All", ...deptSet];
  }, [attendanceRecords]);

  const filteredEmployees = useMemo(() => {
    return attendanceRecords.filter((emp) => {
      const matchesName = emp.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesDept = selectedDepartment === "All" || emp.department === selectedDepartment;
      return matchesName && matchesDept;
    });
  }, [attendanceRecords, searchName, selectedDepartment]);

  const updateTotalPresent = () => {
    return attendanceRecords.reduce(
      (acc, emp) => acc + Object.values(emp.attendance).filter((s) => s === "Present").length,
      0
    );
  };

  const simulateAttendance = () => {
    setAttendanceRecords((prevRecords) =>
      prevRecords.map((emp) => {
        const newAtt = {};
        dateRange.forEach((date) => {
          newAtt[date] = statuses[Math.floor(Math.random() * statuses.length)];
        });
        return { ...emp, attendance: newAtt };
      })
    );
  };

  const openModal = (emp) => {
    setSelectedEmployee(emp);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
  };

  const getSummaryCounts = (emp) => {
    if (!emp) return {};
    const values = Object.values(emp.attendance);
    return {
      present: values.filter((s) => s === "Present").length,
      absent: values.filter((s) => s === "Absent").length,
      late: values.filter((s) => s === "Late").length,
      onLeave: values.filter((s) => s === "On Leave").length,
    };
  };

  return (
    <div style={styles.container}>
      <h2 style={{ fontWeight: 600, marginBottom: 20 }}>Attendance Page</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={styles.input}
        />
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          style={styles.select}
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <button
          onClick={simulateAttendance}
          onMouseEnter={() => setButtonHover(true)}
          onMouseLeave={() => setButtonHover(false)}
          style={{ ...styles.button, ...(buttonHover ? styles.buttonHover : {}) }}
          title="Simulate random attendance data"
        >
          Simulate Attendance
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <strong>Total Present Days (All Employees): </strong>{" "}
        <span style={styles.totalPresentText}>{updateTotalPresent()}</span>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            {dateRange.map((date) => (
              <th key={date} style={styles.th}>
                {date}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp) => (
            <tr
              key={emp.id}
              style={{ cursor: "pointer" }}
              onClick={() => openModal(emp)}
              title="Click to view details"
            >
              <td style={{ ...styles.td, fontWeight: "bold" }}>{emp.name}</td>
              {dateRange.map((date) => {
                const status = emp.attendance[date] || "—";
                const colorStyle = styles.statusColors[status] || styles.statusColors.Default;
                return (
                  <td key={date} style={{ ...styles.tdCenter, ...colorStyle, fontWeight: "bold" }}>
                    {status}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {selectedEmployee && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedEmployee.name} - Attendance Details</h2>
            <h4 style={{ marginBottom: 20 }}>
              <strong>Department:</strong> {selectedEmployee.department}
            </h4>

            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(selectedEmployee.attendance).map(([date, status]) => {
                  const colorStyle = styles.statusColors[status] || styles.statusColors.Default;
                  return (
                    <tr key={date}>
                      <td style={styles.td}>{date}</td>
                      <td style={{ ...styles.td, ...colorStyle, fontWeight: "bold" }}>{status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div>
              <h3>Summary</h3>
              <ul>
                {(() => {
                  const summary = getSummaryCounts(selectedEmployee);
                  return (
                    <>
                      <li>Days Present: {summary.present}</li>
                      <li>Days Absent: {summary.absent}</li>
                      <li>Times Late: {summary.late}</li>
                      <li>On Leave: {summary.onLeave}</li>
                    </>
                  );
                })()}
              </ul>
            </div>

            <button
              onClick={closeModal}
              onMouseEnter={() => setModalButtonHover(true)}
              onMouseLeave={() => setModalButtonHover(false)}
              style={{ ...styles.modalCloseButton, ...(modalButtonHover ? styles.modalCloseButtonHover : {}) }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
