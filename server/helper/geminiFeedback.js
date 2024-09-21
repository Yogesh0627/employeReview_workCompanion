import { GoogleGenerativeAI } from "@google/generative-ai";
import { geminiAPI } from "../Config/Secrets.js";

export const generativeFeedback = async (employeeDetails, quarter) => {
    const { name, employeeId, evaluationPeriod, quarters } = employeeDetails;
    // console.log()
    // console.log("Employee details", employeeDetails);
    
    const genAI = new GoogleGenerativeAI(geminiAPI);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Find the evaluation for the selected quarter
    const currentEvaluation = quarters.find(evaluation => evaluation.quarter === quarter);
    
    if (!currentEvaluation) {
        throw new Error(`No evaluation found for quarter: ${quarter}`);
    }

    const { productivity, teamwork, punctuality, communication, problemSolving } = currentEvaluation;

    const prompt = `Generate professional performance feedback for the following employee based on the provided evaluation:

Employee Name: ${name}
Employee ID: ${employeeId}
Evaluation Period: ${evaluationPeriod}
Quarter: ${quarter}

Performance Metrics:
- Productivity: ${productivity} (1-10 scale)
- Teamwork: ${teamwork} (1-10 scale)
- Punctuality: ${punctuality} (1-10 scale)
- Communication: ${communication} (1-10 scale)
- Problem-solving: ${problemSolving} (1-10 scale)

The feedback should follow these guidelines:
- High scores (7-10) should result in positive feedback, emphasizing strengths and successes.
- Mid-range scores (4-6) should include balanced feedback with areas for improvement and suggestions on how to achieve better results.
- Low scores (1-3) should include constructive criticism, explaining where the employee needs to improve and how they can work toward better performance.

Please provide feedback that is professional, actionable, and considerate of the employee's development in the company.
`;

    const result = await model.generateContent(prompt);
    return result.response.text();
};
export const comparisonFeedback = async (employee1, employee2, quarter) => {
    const { name: name_1, employeeId: employeeId_1, quarters: quarters_1 } = employee1;
    const { name: name_2, employeeId: employeeId_2, quarters: quarters_2 } = employee2;

    console.log("Employee 1",employee1)
    console.log("Employee 2",employee2)
    const genAI = new GoogleGenerativeAI(geminiAPI);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Find the evaluation for the selected quarter for both employees
    const currentEvaluation1 = quarters_1.find(evaluation => evaluation.quarter === quarter);
    const currentEvaluation2 = quarters_2.find(evaluation => evaluation.quarter === quarter);
    
    if (!currentEvaluation1 || !currentEvaluation2) {
        throw new Error(`No evaluation found for quarter: ${quarter}`);
    }

    // Destructuring performance metrics from the evaluations
    const { 
        productivity: productivity_1, 
        teamwork: teamwork_1, 
        punctuality: punctuality_1, 
        communication: communication_1, 
        problemSolving: problemSolving_1,
        evaluationPeriod: evaluationPeriod_1  // Extract the evaluation period from the quarter evaluation
    } = currentEvaluation1;

    const { 
        productivity: productivity_2, 
        teamwork: teamwork_2, 
        punctuality: punctuality_2, 
        communication: communication_2, 
        problemSolving: problemSolving_2,
        evaluationPeriod: evaluationPeriod_2  // Extract the evaluation period from the quarter evaluation
    } = currentEvaluation2;

    const prompt = `Generate a comparative performance feedback for the following employees based on their evaluations:

**Employee 1:**
- Name: ${name_1}
- Employee ID: ${employeeId_1}
- Evaluation Period: ${evaluationPeriod_1}
- Quarter: ${quarter}
- Performance Metrics:
  - Productivity: ${productivity_1} (1-10 scale)
  - Teamwork: ${teamwork_1} (1-10 scale)
  - Punctuality: ${punctuality_1} (1-10 scale)
  - Communication: ${communication_1} (1-10 scale)
  - Problem-solving: ${problemSolving_1} (1-10 scale)

**Employee 2:**
- Name: ${name_2}
- Employee ID: ${employeeId_2}
- Evaluation Period: ${evaluationPeriod_2}
- Quarter: ${quarter}
- Performance Metrics:
  - Productivity: ${productivity_2} (1-10 scale)
  - Teamwork: ${teamwork_2} (1-10 scale)
  - Punctuality: ${punctuality_2} (1-10 scale)
  - Communication: ${communication_2} (1-10 scale)
  - Problem-solving: ${problemSolving_2} (1-10 scale)

The feedback should highlight:
- Strengths and successes of both employees.
- Areas where each employee can improve.
- A direct comparison of their performance in each metric.
- Actionable suggestions for both employees to enhance their performance.

Please provide feedback that is professional, constructive, and useful for both employees’ development within the company.`;

    try {
        const result = await model.generateContent(prompt);
        if (result?.response?.text) {
            return result.response.text(); // Ensure response contains text
        } else {
            throw new Error("No valid response from the model.");
        }
    } catch (error) {
        console.error("Error generating feedback:", error);
        throw error; // Rethrow error after logging
    }
};



