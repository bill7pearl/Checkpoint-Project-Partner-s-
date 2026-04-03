const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const { User } = require('../models');

// ========================
// Google OAuth Strategy
// ========================
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id') {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({
        where: { oauth_provider: 'google', oauth_id: profile.id }
      });

      if (!user) {
        // Check if a user with the same email exists
        user = await User.findOne({ where: { email: profile.emails[0].value } });

        if (user) {
          // Link Google to existing account
          user.oauth_provider = 'google';
          user.oauth_id = profile.id;
          user.avatar_url = profile.photos?.[0]?.value || user.avatar_url;
          await user.save();
        } else {
          // Create new user
          user = await User.create({
            email: profile.emails[0].value,
            name: profile.displayName,
            avatar_url: profile.photos?.[0]?.value,
            oauth_provider: 'google',
            oauth_id: profile.id
          });
        }
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
}

// ========================
// GitHub OAuth Strategy
// ========================
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_ID !== 'your_github_client_id') {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || '/api/auth/github/callback',
    scope: ['user:email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({
        where: { oauth_provider: 'github', oauth_id: profile.id.toString() }
      });

      if (!user) {
        const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;

        user = await User.findOne({ where: { email } });

        if (user) {
          user.oauth_provider = 'github';
          user.oauth_id = profile.id.toString();
          user.avatar_url = profile.photos?.[0]?.value || user.avatar_url;
          await user.save();
        } else {
          user = await User.create({
            email,
            name: profile.displayName || profile.username,
            avatar_url: profile.photos?.[0]?.value,
            oauth_provider: 'github',
            oauth_id: profile.id.toString()
          });
        }
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
}

// Serialize / Deserialize (for session-based, but we use JWT)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
