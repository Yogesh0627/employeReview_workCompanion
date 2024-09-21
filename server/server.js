import express from "express";
import databaseConnect from "./DBConnect/dbConnect.js";
import { comparisonFeedback, generativeFeedback } from "./helper/geminiFeedback.js";
import Employee from "./Model/employe.model.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Connect to the database
databaseConnect();

// Home route
app.get("/", (req, res) => {
  return res.send("Working");
});

// Generate Feedback Endpoint
app.post("/generateFeedback/:id", async (req, res) => {
  const { id } = req.params;
  const { quarter } = req.body; // Get the quarter from the request body

  if (!id || !quarter) {
    return res.status(400).json({ success: false, msg: "Details missing" });
  }

  try {
    const employee = await Employee.findOne({ employeeId: id });
    if (!employee) {
      return res.status(404).json({ success: false, msg: "Employee not found" });
    }

    const result = await generativeFeedback(employee, quarter); // Pass the quarter to the function
    if (result) {
      return res.status(200).json({ success: true, feedback: result });
    } else {
      return res.status(402).json({ success: false, msg: "Error while generating feedback" });
    }
  } catch (error) {
    console.error("Error generating feedback:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error @ generateFeedback" });
  }
});


// Submit Employee Details Endpoint
app.post("/submitDetails", async (req, res) => {
  const details = req.body;

  // Check for required fields
  if (!details || !details.employeeId || !details.name || !details.quarter) {
    return res.status(400).json({ success: false, msg: "Employee details or employee ID missing" });
  }

  // Prepare the quarter data
  const quarterData = {
    quarter: details.quarter,
    evaluationPeriod: details.evaluationPeriod,
    productivity: Number(details.productivity),
    teamwork: Number(details.teamwork),
    punctuality: Number(details.punctuality),
    communication: Number(details.communication),
    problemSolving: Number(details.problemSolving),
  };

  try {
    const existingEmployee = await Employee.findOne({ employeeId: details.employeeId });

    if (existingEmployee) {
      // Add new quarter evaluation
      existingEmployee.quarters.push(quarterData);
      await existingEmployee.save();
      return res.status(200).json({ success: true, msg: "Employee details updated successfully" });
    }

    // Create a new employee record
    const savedEmployee = await Employee.create({
      name: details.name,
      employeeId: details.employeeId,
      quarters: [quarterData], // Include the quarter data
    });

    return res.status(200).json({ success: true, msg: "Employee details submitted successfully" });
  } catch (error) {
    console.error("Error submitting employee details:", error);
    return res.status(500).json({ success: false, msg: "Server error, please try again later" });
  }
});

// Get Employee Details Endpoint
app.get("/employDetails/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findOne({ employeeId: id });

    if (employee) {
      return res.status(200).json({ success: true, msg: "Employee Found", employee });
    } else {
      return res.status(404).json({ success: false, msg: "Employee not found" });
    }
  } catch (error) {
    console.error("Error finding employee:", error);
    return res.status(500).json({ success: false, msg: "Server error, please try again later" });
  }
});

// Delete Employee Endpoint
app.delete("/deleteEmployee/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEmployee = await Employee.findOneAndDelete({ employeeId: id });

    if (deletedEmployee) {
      return res.status(200).json({ success: true, msg: "Employee deleted successfully" });
    } else {
      return res.status(404).json({ success: false, msg: "Employee not found" });
    }
  } catch (error) {
    console.error("Error deleting employee:", error);
    return res.status(500).json({ success: false, msg: "Server error, please try again later" });
  }
});

// Fetch All Employees Endpoint
app.get("/getAllEmployees", async (req, res) => {
  try {
    const allEmployees = await Employee.find();
    if (allEmployees.length > 0) {
      return res.status(200).json({ success: true, employees: allEmployees });
    } else {
      return res.status(404).json({ success: false, msg: "No employees found" });
    }
  } catch (error) {
    console.error("Error fetching employees:", error);
    return res.status(500).json({ success: false, msg: "Server error, please try again later" });
  }
});

// Fetch Employee Review for Specific Quarter Endpoint
app.get("/employeeReview/:id/:quarter", async (req, res) => {
  const { id, quarter } = req.params;

  try {
    const employee = await Employee.findOne({ employeeId: id });

    if (!employee) {
      return res.status(404).json({ success: false, msg: "Employee not found" });
    }

    const quarterReview = employee.quarters.find(q => q.quarter === quarter);

    if (quarterReview) {
      return res.status(200).json({ success: true, msg: "Quarter review found", review: quarterReview });
    } else {
      return res.status(404).json({ success: false, msg: "Quarter review not found" });
    }
  } catch (error) {
    console.error("Error fetching quarter review:", error);
    return res.status(500).json({ success: false, msg: "Server error, please try again later" });
  }
});

app.get("/comparison/:firstId/:secondId/:quarter/:quarter2", async (req, res) => {
  const { firstId, secondId, quarter, quarter2 } = req.params;

  if (!firstId || !secondId) {
    return res.status(400).json({ success: false, msg: "Employee IDs missing" });
  }

  try {
    const firstEmployee = await Employee.findOne({ employeeId: firstId });
    const secondEmployee = await Employee.findOne({ employeeId: secondId });

    if (!firstEmployee || !secondEmployee) {
      return res.status(404).json({ success: false, msg: "One or both employees not found" });
    }

    // Prepare comparison data
    const employee1 = {
      name: firstEmployee.name,
      employeeId: firstEmployee.employeeId,
      evaluationPeriod: firstEmployee.evaluationPeriod,
      quarters: firstEmployee.quarters,
    };

    const employee2 = {
      name: secondEmployee.name,
      employeeId: secondEmployee.employeeId,
      evaluationPeriod: secondEmployee.evaluationPeriod,
      quarters: secondEmployee.quarters,
    };

    const areIdsSame = firstId === secondId;
    const areQuartersSame = quarter === quarter2;

    if (areIdsSame) {
      // Compare both quarters if IDs are the same and quarters are different
      if (!areQuartersSame) {
        // const forComparison = {}
        const comparisonResultQuarter1 = await comparisonFeedback(employee1, employee1, quarter);
        const comparisonResultQuarter2 = await comparisonFeedback(employee1, employee1, quarter2);
        return res.status(200).json({
          success: true,
          comparisons: { quarter1: comparisonResultQuarter1, quarter2: comparisonResultQuarter2 },
        });
      } else {
        // If both IDs and quarters are the same
        const result = await comparisonFeedback(employee1, employee1, quarter);
        return res.status(200).json({ success: true, comparison: result });
      }
    } else {
      // Handle different IDs
      const comparisonResult1 = await comparisonFeedback(employee1, employee2, quarter);
      const comparisonResult2 = await comparisonFeedback(employee1, employee2, quarter2);

      // Special case: If both quarters are different
      if (!areQuartersSame) {
        return res.status(200).json({
          success: true,
          comparisons: {
            quarter1: comparisonResult1,
            quarter2: comparisonResult2,
          },
          message: "Both employee IDs and quarters are different. Comparisons for each quarter provided.",
        });
      } else {
        return res.status(200).json({
          success: true,
          comparisons: {
            quarter: comparisonResult1,
          },
          message: "Employee IDs are different, but quarters are the same.",
        });
      }
    }
  } catch (error) {
    console.error("Error comparing employees:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error @ comparison" });
  }
});

// Start the server
app.listen(8080, () => {
  console.log(`Server running successfully on port 8080`);
});
