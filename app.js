const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');
const path = require('path');

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
const records = require('./routes/records');

// mongodb connection
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {
  useMongoClient: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Handlebars
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

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

app.use(express.static(path.join(__dirname, 'public')));

// Global variables
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/records', records);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
