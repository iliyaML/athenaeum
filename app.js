const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const compression = require('compression');
const helmet = require('helmet');
const sslRedirect = require('heroku-ssl-redirect');

const app = express();

const PORT = process.env.PORT || 5000;

// Load Keys
const keys = require('./config/keys');

const { truncate, stripTags, formatDate, select, editIcon } = require('./helpers/hbs');

// Load Models (before passport)
require('./models/Users');
require('./models/Records');

// Passport Config
require('./config/passport')(passport);

// Routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const records = require('./routes/records');
const users = require('./routes/users');

// MongoDB Connection
mongoose.Promise = global.Promise; /* Remove promise warning */
mongoose.connect(keys.mongoURI, {
  useMongoClient: true /* Avoid deprecated error */
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Enable SSL Redirect
app.use(sslRedirect());

// Compression Middleware
app.use(compression());

// Helmet Middleware
app.use(helmet());

// Handlebars Template Engine
app.engine('handlebars', exphbs({
  helpers: {
    truncate: truncate,
    stripTags: stripTags,
    formatDate: formatDate,
    select: select,
    editIcon: editIcon
  },
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// MethodOverride Middleware
app.use(methodOverride('_method'));

// BodyParser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// CookieParser Middleware
app.use(cookieParser());

// Session Middleware (before passport)
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Global Variables
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Routes (load last)
app.use('/auth', auth);
app.use('/records', records);
app.use('/users', users);
app.use('/', index);

// Listening
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
