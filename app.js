const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

const PORT = process.env.PORT || 5000;
const keys = require('./config/keys');

// load user model
require('./models/Users');

// passport config
require('./config/passport')(passport);

// routes
const index = require('./routes/index');
const auth = require('./routes/auth');

// mongodb connection
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {
  useMongoClient: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// CookieParser middleware
app.use(cookieParser());

// Session middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use('/', index);
app.use('/auth', auth);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
