const express = require('express');
const events = require('../schemas/eventmanagers');
const router = express.Router();
const Event = events();

// ######################################################
// Event routes

router.get("/", (req, res) => {
    Event.EventsGetAll()
          .then(data => {
              res.json(data);
          })
          .catch(error => {
              res.status(500).json({ "message": error.message });
          })
});

router.get("/:id", getEvent, (req, res) => {
    try {
        res.status(200).json(res.event);
    } catch (err) {
        res.status(500).json({ "message": err.message });
    }
});

router.post("/", (req, res) => {
    Event.EventsAdd(req.body)
         .then(data => {
             res.json(data);
         })
         .catch(error => {
             res.status(400).json({ "message" : error.message });
         })
});

router.put("/:id", (req,res) => {
    Event.EventsEdit(req.body)
         .then(data => {
             res.json(data);
         })
         .catch(error => {
            res.status(400).json({ "message": error.message });
         })
});


// * Patch routes to update attending and invited arrays
router.patch("/:id/update/:empID", getEvent, (req,res) => {
    try {
       res.event.EventAttendees.push(req.params.empID);
       res.event.save();
       return res.status(200).json({ "message": "This employee is now attending this event" });
    } catch(error) {
        res.status(500).json({ "message": error.message });
    }
})

router.patch("/:id/add/:empID", getEvent, (req,res,) => {
    try {
        res.event.EventInvited.push(req.params.empID);
        res.event.save();
        return res.status(200).json({ "message": "This employee is now attending this event" });
    } catch (error) {
        res.status(500).json({ "message": error.message });
    }
})

router.patch("/:id/remove/:empID", getEvent, (req,res,) => {
    try {
        const index = res.event.EventInvited.indexOf(req.params.empID);
        if (index > -1) {
            res.event.EventInvited.splice(index, 1);
            res.event.save();
            return res.status(200).json({ "message": "This employee is now attending this event" });
        }
        return res.status(404).json({ "message": "Resource not found"});
    } catch (error) {
        res.status(500).json({ "message": error.message });
    }
})

router.delete("/:id", (req, res) => {
    Event.EventsDelete(req.params.id)
         .then(() => {
             res.status(204).end();
         })
         .catch(error => {
             res.status(500).json({ "message": error.message });
         }) 
});


async function getEvent(req, res, next) {
    let event;
    try {
        event = await Event.getEventsByID(req.params.id);
        if (event == null) {
            return res.status(404).json({ "message": "Resource not found"});
        }
    } catch(error) {
        res.status(500).json({ "message": error.message });
    }
    res.event = event;
    next();
}

module.exports = router;