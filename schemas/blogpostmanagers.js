// ################################################################################
// Add dotenv to access sensitive information
require('dotenv').config()

// Data service operations setup

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Load the schemas...

// Data entities; the standard format is:
const BlogPostSchema = require('./blogposts');
// ################################################################################
// Define the functions that can be called by server.js

module.exports = function () {

  // Collection properties, which get their values upon connecting to the database

  return {

    // ############################################################
    // Connect to the database

    connect: function () {
      return new Promise(function (resolve, reject) {

        // Create connection to the database
        console.log('Attempting to connect to the database...');

        // The following works for localhost...
        // Replace the database name with your own value
        //mongoose.connect('mongodb://localhost:27017/db-a2', { connectTimeoutMS: 5000, useUnifiedTopology: true });

        // This one works for MongoDB Atlas...
        // (to be provided)
        mongoose.connect(process.env.DB_BLOGS_URL, { connectTimeoutMS: 5000, useUnifiedTopology: true }); 
        
        // From https://mongoosejs.com/docs/connections.html
        // Mongoose creates a default connection when you call mongoose.connect(). 
        // You can access the default connection using mongoose.connection.
        var db = mongoose.connection;

        // Handle connection events...
        // https://mongoosejs.com/docs/connections.html#connection-events
        // The data type of a connection event is string
        // And more than one connection event may be emitted during execution

        // FYI the Node.js EventEmitter class docs is here...
        // https://nodejs.org/api/events.html#events_class_eventemitter

        // Handle the unable to connect scenario
        // "on" is a Node.js method in the EventEmitter class
        // https://nodejs.org/api/events.html#events_emitter_on_eventname_listener
        db.on('error', (error) => {
          console.log('Connection error:', error.message);
          reject(error);
        });

        // Handle the open/connected event scenario
        // "once" is a Node.js method in the EventEmitter class
        // https://nodejs.org/api/events.html#events_emitter_once_eventname_listener
        db.once('open', () => {
          console.log('Connection to the database was successful');
          resolve();
        });
      });
    },
    
    getAllBlogPosts: function () {
      return new Promise((resolve, reject) => {
      BlogPostSchema.find()
          .sort({ title: 'asc' })
          .exec((error, items) => {
            if (error) {
              // Query error
              return reject(error.message);
            }
            // Found, a collection will be returned
            return resolve(items);
          });
      });
    },

    getBlogPostByID: function(termID) {
      return new Promise((resolve, reject) => {
          BlogPostSchema.findById(termID)
          .exec((error, item) => {
            if (error) {
              return reject(error.message);
            }

            if (item) {
              return resolve(item);
            } else {
              return reject("EmployeeSchema could not be found!");
            }
          });
      });
    },

    blogPostAdd:  function (newPost) {
      // Attempt to create a new blog post
      return new Promise(function(resolve, reject) {

        let newBlogPost = new BlogPostSchema(newPost)

        newBlogPost.save((error) => {
          if (error) {
              reject(`Blog post could not be created`);
          } else {
            resolve("New Blog Post was created!");
          }
        });
    
    })


  },

    blogPostEdit: function (newPost) {
      return new Promise(function (resolve, reject) {

        BlogPostSchema.findByIdAndUpdate(newPost._id, newPost, { new: true }, (error, item) => {
          if (error) {
            // Cannot edit item
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Edited object will be returned
            return resolve(item);
          } else {
            return reject('Not found');
          }

        });
      })
    },

    blogPostDelete: function (postId) {
      return new Promise(function (resolve, reject) {

        BlogPostSchema.findByIdAndRemove(postId, (error) => {
          if (error) {
            // Cannot delete item
            return reject(error.message);
          }
          // Return success, but don't leak info
          return resolve();
        })
      })
    }
  }
}