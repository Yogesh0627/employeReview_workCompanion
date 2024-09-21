import { useEffect, useState } from 'react';
import axios from "axios";

const EmployeeForm = ({ employee }) => {
    const [formData, setFormData] = useState({
        name: '',
        employeeId: '',
        evaluationPeriod: '',
        productivity: '',
        teamwork: '',
        punctuality: '',
        communication: '',
        problemSolving: '',
        quarter: '', // Field for quarter
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const sendForm = async (formData) => {
        const response = await axios.post("http://localhost:8080/submitDetails", formData);
        if (response.data.success) {
            alert("Details submitted successfully");
        }
    };

    useEffect(() => {
        if (employee) {
            setFormData(employee); // Populate form data when an employee is selected for editing
        } else {
            setFormData({
                name: '',
                employeeId: '',
                evaluationPeriod: '',
                productivity: '',
                teamwork: '',
                punctuality: '',
                communication: '',
                problemSolving: '',
                quarter: '', // Reset quarter field
            });
        }
    }, [employee]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        sendForm(formData);
        setFormData({
            name: '',
            employeeId: '',
            evaluationPeriod: '',
            productivity: '',
            teamwork: '',
            punctuality: '',
            communication: '',
            problemSolving: '',
            quarter: '', // Reset quarter field
        });
    };

    return (
        <form onSubmit={handleSubmit} className="employee-form">
            <div>
                <label htmlFor="name">Employee Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="employeeId">Employee ID:</label>
                <input
                    type="text"
                    id="employeeId"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="evaluationPeriod">Evaluation Period:</label>
                <input
                    type="text"
                    id="evaluationPeriod"
                    name="evaluationPeriod"
                    value={formData.evaluationPeriod}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Quarter Field as Select Dropdown */}
            <div>
                <label htmlFor="quarter">Quarter:</label>
                <select
                    id="quarter"
                    name="quarter"
                    value={formData.quarter}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Quarter</option>
                    <option value="Quarter 1">Quarter 1</option>
                    <option value="Quarter 2">Quarter 2</option>
                    <option value="Quarter 3">Quarter 3</option>
                    <option value="Quarter 4">Quarter 4</option>
                </select>
            </div>

            {/* Performance Metrics */}
            <div>
                <label htmlFor="productivity">Productivity (1-10):</label>
                <input
                    type="number"
                    id="productivity"
                    name="productivity"
                    value={formData.productivity}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    required
                />
            </div>
            <div>
                <label htmlFor="teamwork">Teamwork (1-10):</label>
                <input
                    type="number"
                    id="teamwork"
                    name="teamwork"
                    value={formData.teamwork}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    required
                />
            </div>
            <div>
                <label htmlFor="punctuality">Punctuality (1-10):</label>
                <input
                    type="number"
                    id="punctuality"
                    name="punctuality"
                    value={formData.punctuality}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    required
                />
            </div>
            <div>
                <label htmlFor="communication">Communication (1-10):</label>
                <input
                    type="number"
                    id="communication"
                    name="communication"
                    value={formData.communication}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    required
                />
            </div>
            <div>
                <label htmlFor="problemSolving">Problem Solving (1-10):</label>
                <input
                    type="number"
                    id="problemSolving"
                    name="problemSolving"
                    value={formData.problemSolving}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    required
                />
            </div>

            {/* Submit Button */}
            <button type="submit">Submit Review</button>
        </form>
    );
};

export default EmployeeForm;
