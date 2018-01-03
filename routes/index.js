const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load Record Model
const Record = mongoose.model('records');

// Helper Methods
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

// Index
router.get('/', ensureGuest, (req, res) => {
  res.render('index/welcome', {
    title: 'Hello'
  });
});

// About
router.get('/about', (req, res) => {
  res.render('index/about');
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Record.find({ user: req.user.id })
  .sort({ date: 'desc' })
  .then(records => {
    res.render('index/dashboard', {
      records: records
    });
  });
});

module.exports = router;
