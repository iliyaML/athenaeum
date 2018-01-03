const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Helpers
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

// Load Models
const Record = mongoose.model('records');
const User = mongoose.model('users');

router.get('/my', ensureAuthenticated, (req, res) => {
    Record.find({
        user: req.user.id
    })
    .populate('user')
    .then(records => {
        res.render('users/index', {
            records: records
        });
    })
});

router.get('/:id', (req, res) => {
    Record.find({
        user: req.params.id,
        status: 'public'
    })
    .populate('user')
    .then(records => {
        res.render('users/index', {
            records: records
        });
    })
});

module.exports = router;