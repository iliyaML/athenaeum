const express = require('express');
const router = express.Router();
const passport = require('passport');

// Login Route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Login Callback Route
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/dashboard');
  });

// Validation Route
router.get('/verify', (req, res) => {
  if (req.user) { // if authenticated
    console.log(req.user);
  } else {
    console.log('Not Authorized');
  }
});

// Logout Route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
