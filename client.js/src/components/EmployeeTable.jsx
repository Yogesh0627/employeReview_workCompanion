import axios from 'axios';
import { useState } from 'react';

const EmployeeTable = ({ employees, onEdit, onView, onDelete }) => {
    const [selectedQuarter, setSelectedQuarter] = useState(''); // State to store selected quarter

    const onGenerateFeedback = async (employeeId) => {
        if (!selectedQuarter) {
            alert("Please select a quarter to generate feedback.");
            return;
        }

        const response = await axios.post(`http://localhost:8080/generateFeedback/${employeeId}`, { quarter: selectedQuarter });
        if (response.data.success) {
            alert(response.data.feedback);
        } else {
            alert("Failed to generate feedback.");
        }
    };

    return (
        <div>
            <div className="quarter-selection">
                <label htmlFor="quarter">Select Quarter:</label>
                <select
                    id="quarter"
                    value={selectedQuarter}
                    onChange={(e) => setSelectedQuarter(e.target.value)}
                >
                    <option value="">Select Quarter</option>
                    <option value="Quarter 1">Quarter 1</option>
                    <option value="Quarter 2">Quarter 2</option>
                    <option value="Quarter 3">Quarter 3</option>
                    <option value="Quarter 4">Quarter 4</option>
                </select>
            </div>

            <div className="employee-table-container">
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>Employee Name</th>
                            <th>Employee ID</th>
                            <th>Quarters</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees && employees.length > 0 ? (
                            employees.map((employee, index) => (
                                <tr key={index}>
                                    <td>{employee.name}</td>
                                    <td>{employee.employeeId}</td>
                                    <td>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Quarter</th>
                                                    <th>Evaluation Period</th>
                                                    <th>Productivity</th>
                                                    <th>Teamwork</th>
                                                    <th>Punctuality</th>
                                                    <th>Communication</th>
                                                    <th>Problem Solving</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employee.quarters.map((quarter, quarterIndex) => (
                                                    <tr key={quarterIndex}>
                                                        <td>{quarter.quarter}</td>
                                                        <td>{quarter.evaluationPeriod}</td>
                                                        <td>{quarter.productivity}</td>
                                                        <td>{quarter.teamwork}</td>
                                                        <td>{quarter.punctuality}</td>
                                                        <td>{quarter.communication}</td>
                                                        <td>{quarter.problemSolving}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </td>
                                    <td>
                                        <button onClick={() => onView(employee.employeeId)}>View</button>
                                        <button onClick={() => onEdit(employee)}>Edit</button>
                                        <button onClick={() => onDelete(employee.employeeId)}>Delete</button>
                                        <button onClick={() => onGenerateFeedback(employee.employeeId)}>Generate Feedback</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No employees found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeTable;
