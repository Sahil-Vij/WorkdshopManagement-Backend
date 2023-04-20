const express = require('express');
const router = express.Router();
const event = require('../models/event');

router.get('/getallevents', async (req, res) => {
  try {
    const events = await event.find({});
    res.send(events);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post('/geteventbyid', async (req, res) => {
  const eventid = req.body.eventid;
  try {
    const selectedEvent = await event.findOne({ _id: eventid });
    res.send(selectedEvent);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post('/addevent', async (req, res) => {
  try {
    const newEvent = new event(req.body);
    await newEvent.save();
    res.send('New event added successfully.');
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
