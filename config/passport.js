const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

// Load User model
const User = mongoose.model('users');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy({
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true /* heroku */
    }, (accessToken, refreshToken, profile, done) => {
      console.log(accessToken);
      console.log(profile);

      // Check for existing user
      User.findOne({
        googleID: profile.id
      })
        .then(user => {
          if (user) {
            // If exists, return user
            done(null, user);
          } else {
            // Create user
            const newUser = {
              googleID: profile.id,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile.emails[0].value,
              image: profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'))
            }

            new User(newUser)
              .save()
              .then(save => done(null, user));
          }
        });
    })
  );

  // Documentation
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Documentation
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => done(null, user));
  });
}
