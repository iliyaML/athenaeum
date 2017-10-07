const express = require('express');
const router = express.Router();

// Index
router.get('/', (req, res) => {
  res.render('records/index');
});

// add
router.get('/add', (req, res) => {
  res.render('records/add');
});

module.exports = router;
