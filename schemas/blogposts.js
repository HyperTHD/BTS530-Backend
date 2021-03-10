// Setup
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let BlogPostSchema = new Schema({
    author: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    post: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now().toLocaleString() }
});
  
  // Make schema available to the application
  module.exports = mongoose.model("blogpost", BlogPostSchema, "BlogPost")