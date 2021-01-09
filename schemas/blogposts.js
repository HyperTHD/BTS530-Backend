// Setup
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let BlogPostSchema = new Schema({
    blogID: { type: Number, unique: true },
    title: { type: String, required: true, unique: true },
    description: String,
    post: String,
    date: { type: Date, required: true, default: Date.now().toLocaleString()}
});
  
  // Make schema available to the application
  module.exports = mongoose.model("blogpost", BlogPostSchema, "BlogPost")