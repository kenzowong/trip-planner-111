const express = require('express');
const router = express.Router();
const { Hotel, Restaurant, Activity } = require('../models');

router.get('/', (req, res, next) => {
  Promise.all([
    Hotel.findAll({ include: [{ all: true }] }),
    Restaurant.findAll({ include: [{ all: true }] }),
    Activity.findAll({ include: [{ all: true }] }),
  ]).then(values => {
    res.send(values);
  });
});

module.exports = router;
