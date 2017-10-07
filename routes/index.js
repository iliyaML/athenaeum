const express = require('express');
const router = express.Router();

// Index
router.get('/', (req, res) => {
  res.render('index/welcome');
});

// About
router.get('/about', (req, res) => {
  res.render('index/about');
});

// Dashboard
router.get('/dashboard', (req, res) => {
  res.render('index/dashboard');
});

module.exports = router;
