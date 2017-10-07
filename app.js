const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();

const PORT = process.env.PORT || 5000;
const keys = require('./config/keys');

// passport config
require('./config/passport')(passport);

// routes
const auth = require('./routes/auth');

// mongodb connection
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {
  useMongoClient: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/auth', auth);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
