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
const EmployeeSchema = require('./employees');
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
        mongoose.connect(process.env.DB_EMPLOYEE_URL, { connectTimeoutMS: 5000, useUnifiedTopology: true }); 
        
        // Need to use createConnection to connect to the second database since connect can only be called once
        
        let db2 = mongoose.createConnection(process.env.DB_EVENTS_URL, { connectTimeoutMS: 5000, useUnifiedTopology: true });
        
        let db3 = mongoose.createConnection(process.env.DB_BLOGS_URL, { connectTimeoutMS: 5000, useUnifiedTopology: true });
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

        db2.on('error', error => {
          console.log('Connection error:', error.message);
          reject(error);
        });

        db2.once('open', () => {
          resolve()
        })

        db3.on('error', error => {
          console.log('Connection error:', error.message);
          reject(error);
        });

        db3.once('open', () => {
          resolve()
        })
      });
    },
    
    EmployeesGetAll: function () {
      return new Promise((resolve, reject) => {
        EmployeeSchema.find()
          .sort({ firstName: 'asc' })
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

    getEmployeeByID: function(termID) {
      return new Promise((resolve, reject) => {
          EmployeeSchema.findById(termID)
          .populate('events')
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

    EmployeesAdd:  function (newItem) {
      // Attempt to create a new employee followed by salting password to be hashed
      return new Promise(function(resolve, reject) {

        let salt = bcrypt.genSaltSync(10);

        let hash = bcrypt.hashSync(newItem.password, salt);

        newItem.password = hash;

        let newEmployee = new EmployeeSchema(newItem);

        newEmployee.save((error) => {
          if (error) {
            if (error.code == 11000) {
              reject("User account creation - cannot create; user already exists");
            } else {
              reject(`User account creation - ${error.message}`);
            }
          } else {
            resolve("User account was created");
          }
        });
    
    })
  },

    EmployeesEdit: function (newItem) {
      return new Promise(function (resolve, reject) {

        EmployeeSchema.findByIdAndUpdate(newItem._id, newItem, { new: true }, (error, item) => {
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

    EmployeesDelete: function (itemId) {
      return new Promise(function (resolve, reject) {

        EmployeeSchema.findByIdAndRemove(itemId, (error) => {
          if (error) {
            // Cannot delete item
            return reject(error.message);
          }
          // Return success, but don't leak info
          return resolve();
        })
      })
    },

    EmployeeLogin: function(userData) {
      return new Promise(function (resolve, reject) {
        EmployeeSchema.findOne({ username: userData.username}, (err, item) => {
          if (err) {
            return reject(`Login failure ${error.message}`)
          }
          if (item) {
            // Check password
            let passwordCheck = bcrypt.compareSync(userData.password, item.password);
            if (passwordCheck) {
              return resolve(item);
            } else {
              return reject(`Login was unsuccessful`)
            }
          } else {
            return reject(`Could not locate employee`)
          }
        })
      })
  }
  }
}