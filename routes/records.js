const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');
const mongoose = require('mongoose');
const Record = mongoose.model('records');
const User = mongoose.model('users');

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
  let allowComments = false;

  if(req.body.allowComments){
    allowComments = true;
  }

  const newRecord = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id
  }

  new Record(newRecord)
  .save()
  .then(record => {
    res.redirect(`/records/show/${record.id}`);
  });
});

module.exports = router;
