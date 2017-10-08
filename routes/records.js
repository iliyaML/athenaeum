const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');
const mongoose = require('mongoose');
const Record = mongoose.model('records');
const User = mongoose.model('users');

// Index
router.get('/', (req, res) => {
  Record.find({ status: 'public' })
  .populate('user')
  .then(records => {
    res.render('records/index', {
      records: records
    })
  });
});

// Single record
router.get('/:id', (req, res) => {
  Record.findOne({ _id: req.params.id })
  .populate('user')
  .then(record => {
    res.render('records/show', {
      record: record
    });
  })
});

// add
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('records/add');
});

// edit
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Record.findOne({ _id: req.params.id })
  .then(record => {
    res.render('records/edit', {
      record: record
    });
  });
});

// Edit form process
router.put('/:id', (req, res) => {
  Record.findOne({
    _id: req.params.id
  })
  .then(record => {
    let allowComments = false;

    if(req.body.allowComments){
      allowComments = true;
    }

    record.title = req.body.title;
    record.body = req.body.body;
    record.status = req.body.status;
    record.allowComments = allowComments;

    record.save()
    .then(record => {
      res.redirect('/dashboard');
    });
  })
});

// Delete
router.delete('/:id', (req, res) => {
  Record.remove({
    _id: req.params.id
  })
  .then(() => res.redirect('/dashboard'));
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
    res.redirect(`/records/${record.id}`);
  });
});

module.exports = router;
