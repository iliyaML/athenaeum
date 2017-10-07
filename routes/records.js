const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

// Index
router.get('/', (req, res) => {
  res.render('records/index');
});

// add
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('records/add');
});

// process add form
router.post('/', (req, res) => {
  res.send('sent');
});

module.exports = router;
