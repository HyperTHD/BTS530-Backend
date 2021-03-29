// Add dotenv to access sensitive information
require('dotenv').config()

const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Load the schemas...

// Data entities; the standard format is:
const EventSchema = require('./events');
const EmployeeSchema = require('./employees');


// ################################################################################
// Define the functions that can be called by server.js

module.exports = function () {

  // Collection properties, which get their values upon connecting to the database
  
  return{

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
            mongoose.connect(process.env.DB_EVENTS_URL, { connectTimeoutMS: 5000, useUnifiedTopology: true });
      
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
        
    EventsGetAll: function () {
      return new Promise((resolve, reject) => {
        EventSchema.find()
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

    getEventsByID: function(termID) {
      return new Promise((resolve, reject) => {
          EventSchema.findById(termID)
          .exec((error, item) => {
            if (error) {
              return reject(error.message);
            }

            if (item) {
              return resolve(item);
            } else {
              return reject("EventSchema could not be found!");
            }
          });
      });
    },

    EventsAdd: async function (newItem) {
      // Attempt to create a new item
    try{
    let event = await EventSchema.create(newItem);
          if (event) {
            return event;
          }
      }catch(error){
        return error.message;
      } 
    },

    EventsEdit: function (newItem) {
      return new Promise(function (resolve, reject) {

        EventSchema.findByIdAndUpdate(newItem._id, newItem, { new: true }, (error, item) => {
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

    EventsDelete: function (itemId) {
      return new Promise(function (resolve, reject) {

        EventSchema.findByIdAndRemove(itemId, (error) => {
          if (error) {
            // Cannot delete item
            return reject(error.message);
          }
          // Return success, but don't leak info
          return resolve();
        })
      })
    },

    EventsAddToEventAttendees: function (id, empID)  {
      try {
        EventSchema.findByIdAndUpdate(id, 
          {$push: {EventAttendees: empID}},
          {$safe: true, upsert: true},
          (err, doc) => {
            if (err) {
              console.log(err);
            } else {
              console.log(doc);
              return doc;
            }
          }
          )
      }
      catch (error) {
        console.log(error);
      }
    }
  }
}