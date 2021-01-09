const express = require('express');
const events = require('../schemas/eventmanagers');
const router = express.Router();
const Event = events();

// ######################################################
// Event routes

router.get("/", (req,res) => {
    Event.EventsGetAll()
          .then(data => {
              res.json(data);
          })
          .catch(error => {
              res.status(500).json({ "message": "Resource not found"})
          })
});

router.get("/:id", (req, res) => {
    Event.getEventsByID(req.params.id)
         .then(data => {
             res.json(data);
         })
         .catch(error => {
             res.status(404).json({ "message" : error.message });
         })
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


router.delete("/:id", (req, res) => {
    Event.EventsDelete(req.params.id)
         .then(() => {
             res.status(204).end();
         })
         .catch(error => {
             res.status(500).json({ "message": "Resource not found"});
         }) 
});


module.exports = router;