import { useEffect, useState } from 'react';
import './App.css';
import EmployeeForm from './components/EmployeeForm';
import EmployeeTable from './components/EmployeeTable';
import axios from 'axios';

function App() {
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [firstId, setFirstId] = useState("");
  const [secondId, setSecondId] = useState("");
  const [comparisonResult, setComparisonResult] = useState(null); // State to hold comparison result
  const [quarter, setQuarter] = useState("");
  const [quarter2, setQuarter2] = useState("");

  const getAllEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8080/getAllEmployees");
      setEmployees(response.data.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const onView = async (employeeId) => {
    try {
      const response = await axios.get(`http://localhost:8080/employDetails/${employeeId}`);
      setEmployee(response.data.employee);
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  const doComparison = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/comparison/${firstId}/${secondId}/${quarter}/${quarter2}`
      );
      if (response.data.success) {
        setComparisonResult(response.data.comparison); // Set the comparison result from the response
      } else {
        alert("Error comparing employees.");
      }
    } catch (error) {
      console.error("Error comparing employees:", error);
    }
  };

  const onDelete = async (employeeId) => {
    if (employee && employee.employeeId === employeeId) {
      setEmployee(null);
    }

    try {
      const response = await axios.delete(`http://localhost:8080/deleteEmployee/${employeeId}`);
      if (response.data.success) {
        alert("Employee deleted successfully");
        setEmployees((prevEmployees) => 
          prevEmployees.filter(emp => emp.employeeId !== employeeId)
        );
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const onEdit = (employeeData) => {
    setEmployee(employeeData);
  };

  useEffect(() => {
    getAllEmployees();
  }, []);

  return (
    <>
      <div>
        <EmployeeForm employee={employee} setEmployee={setEmployee} />
        <EmployeeTable employees={employees} onView={onView} onDelete={onDelete} onEdit={onEdit} />
        <div>
          <div>Comparison</div>
          <input 
            type="text" 
            value={firstId} 
            onChange={(e) => setFirstId(e.target.value)} 
            placeholder='Please Enter First Employee ID' 
          />
          <input 
            type="text" 
            value={secondId} 
            onChange={(e) => setSecondId(e.target.value)} 
            placeholder='Please Enter Second Employee ID' 
          />
          <input 
            type="text" 
            value={quarter} 
            onChange={(e) => setQuarter(e.target.value)} 
            placeholder='Please Enter First Quarter' 
          />
          <input 
            type="text" 
            value={quarter2} 
            onChange={(e) => setQuarter2(e.target.value)} 
            placeholder='Please Enter Second Quarter' 
          />
          <button onClick={doComparison}>Compare</button>
        </div>
        
        {/* Display comparison result */}
        {comparisonResult && (
          <div className="comparison-results">
            <h2>Comparison Results</h2>
            {/* Display comparison result properly as an object */}
            <pre>{JSON.stringify(comparisonResult, null, 2)}</pre>
          </div>
        )}

        {employee && ( // Conditional rendering for employee details
          <div className="employee-details">
            <h2>Employee Details</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Employee ID</th>
                  <th>Quarters</th>
                </tr>
              </thead>
              <tbody>
                <tr>
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
                        {employee.quarters.map((quarter, index) => (
                          <tr key={index}>
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
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
