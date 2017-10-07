const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();

const PORT = process.env.PORT || 5000;

// passport config
require('./config/passport')(passport);

// routes
const auth = require('./routes/auth');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/auth', auth);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
