import mongoose from 'mongoose';

const quarterSchema = new mongoose.Schema({
  quarter: {
    type: String,
    required: true,
    trim: true,
  },
  evaluationPeriod: {
    type: String,
    required: true,
  },
  productivity: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  teamwork: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  punctuality: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  communication: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  problemSolving: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  feedback: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  quarters: [quarterSchema], // Array of quarter reviews
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
