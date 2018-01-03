const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Helpers
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

// Load Models
const Record = mongoose.model('records');
const User = mongoose.model('users');

// Index
router.get('/', (req, res) => {
  // Show public records only
  Record.find({ status: 'public' })
    .populate('user')
    .sort({ date: 'desc' })
    .then(records => {
      res.render('records/index', {
        records: records
      })
    });
});

// Add
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('records/add');
});

// Edit
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Record.findOne({ _id: req.params.id })
    .then(record => {
      // If not author
      if (record.user != req.user.id) {
        res.redirect('/records');
      } else {
        res.render('records/edit', {
          record: record
        });
      }
    });
});

// Edit Form Process
router.put('/:id', (req, res) => {
  Record.findOne({
    _id: req.params.id
  })
    .then(record => {
      const allowComments = (req.body.allowComments) ? true : false;

      record.title = req.body.title;
      record.body = req.body.body;
      record.status = req.body.status;
      record.allowComments = allowComments;

      record.save()
        .then(record => res.redirect('/dashboard'));
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
  const allowComments = (req.body.allowComments) ? true : false;

  const newRecord = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id
  }

  new Record(newRecord)
    .save()
    .then(record => res.redirect(`/records/${record.id}`));
});

// Single Record
router.get('/:id', (req, res) => {
  Record.findOne({ _id: req.params.id })
    .populate('user')
    .populate('comments.commentUser')
    .then(record => {
      if (record.status == 'public') {
        res.render('records/show', {
          record: record
        });
      } else {
        if (req.user) {
          if(req.user.id == record.user._id){
            res.render('records/show', {
              record: record
            });
          } else {
            res.redirect('/auth/google');
          }
        } else {
          res.redirect('/auth/google');
        }
      }
    })
});

// Add Comment
router.post('/comment/:id', (req, res) => {
  Record.findById({
    _id: req.params.id
  })
    .then(record => {
      const newComment = {
        commentBody: req.body.commentBody,
        commentUser: req.user.id
      };

      // Add to comments array in Records
      record.comments.unshift(newComment);

      record.save()
        .then(record => res.redirect(`/records/${record.id}`));
    })
});

module.exports = router;
