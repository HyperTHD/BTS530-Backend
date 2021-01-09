// Setup
const mongoose = require('mongoose');
const blogPostSchema = require('./blogposts');
const Schema = mongoose.Schema;

// Entity schema
let EmployeeSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  employeeNum: { type: Number, default: 110 + 1, unique: true },
  isAdmin: { type: Boolean, default: false },
  isManager: { type: Boolean, default: false },
  phoneNumber: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true, unique: true },
  hireDate: Date,
  DOB: Date,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  blogPosts: [{type: Schema.Types.ObjectId, ref: "blogpost"}]
});

// Make schema available to the application
module.exports = mongoose.model("employee", EmployeeSchema, "Employee")