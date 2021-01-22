// Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Entity schema
var EventSchema = new Schema({
    EventName:  {type: String, required: true, unique: true},
    EventDate:  {type: Date, required: true, unique: true},
    EventDescription:  {type: String, required: true},
    EventLocation:  {type: String, required: true},
    EventParticipants:  {type: [Number], required: true},
    EventAttendees: [{type: Schema.Types.ObjectId, ref: "employee"}],
    EventStartTime:  {type: String, required: true},
    EventEndTime:  {type: String, required: true},
    Manager: {type: String, required: true}
});

// Make schema available to the application
module.exports = mongoose.model("event", EventSchema, "Event")

