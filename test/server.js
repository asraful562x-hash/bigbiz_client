// server.js
// Minimal Express app demonstrating "Login with Google" using Passport.
// Run: npm install && npm start   (after filling in .env, see .env.example)

require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { findOrCreateGoogleUser, findOrCreateFacebookUser, findById } = require('./db');

const app = express();

// ---------- 1. Sessions ----------
// After login we don't want the user to have to talk to Google again on
// every request, so we store a small session cookie that just points at
// their local user id.
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ---------- 2. Passport + Google strategy ----------
// This is the piece that actually talks to Google: exchanges the
// authorization code for tokens, then fetches the user's profile.
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    function verify(accessToken, refreshToken, profile, done) {
      // "profile" here is Google's data: profile.id, profile.displayName,
      // profile.emails[0].value, profile.photos[0].value.
      // We never see or store the user's Google password.
      try {
        const user = findOrCreateGoogleUser(profile);
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// ---------- 2b. Passport + Facebook strategy ----------
// Same shape as Google: passport-facebook exchanges the code for a
// token, then fetches the profile. profileFields asks explicitly for
// emails/photos, since Facebook doesn't include them by default.
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'displayName', 'emails', 'photos'],
    },
    function verify(accessToken, refreshToken, profile, done) {
      try {
        const user = findOrCreateFacebookUser(profile);
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// What gets stored in the session cookie (kept tiny: just the id).
passport.serializeUser((user, done) => done(null, user.id));

// How to turn that id back into a full user object on each request.
passport.deserializeUser((id, done) => {
  try {
    const user = findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// ---------- 3. Routes ----------

app.get('/', (req, res) => {
  if (req.user) {
    return res.send(`
      <h1>Welcome, ${req.user.name}</h1>
      <p>Email: ${req.user.email}</p>
      <img src="${req.user.avatar_url}" width="60" style="border-radius:50%" />
      <p><a href="/logout">Log out</a> | <a href="/debug/session">See my cookie data</a></p>
    `);
  }
  res.send(`
    <h1>Home</h1>
    <p><a href="/auth/google">Login with Google</a></p>
    <p><a href="/auth/facebook">Login with Facebook</a></p>
  `);
});

// ---------- Debug route ----------
// Shows what's actually in the cookie the browser sent, side by side
// with what's stored on the server for that session. Reload this page
// after logging in and after logging out to see the difference.
app.get('/debug/session', (req, res) => {
  res.send(`
    <h1>Cookie vs. server storage</h1>

    <h3>1. Raw cookie header the browser just sent</h3>
    <pre>${req.headers.cookie || '(no cookie sent)'}</pre>
    <p>This is the ONLY thing stored in the browser. Just a random signed ID — no name, no email.</p>

    <h3>2. Session ID (decoded from that cookie)</h3>
    <pre>${req.sessionID}</pre>

    <h3>3. What the server has stored for this session ID</h3>
    <pre>${JSON.stringify(req.session, null, 2)}</pre>
    <p>This lives only on the server, in memory. The browser never sees this.</p>

    <h3>4. Full user record (looked up from users.json using the id above)</h3>
    <pre>${req.user ? JSON.stringify(req.user, null, 2) : '(not logged in)'}</pre>

    <p><a href="/">Back home</a></p>
  `);
});

// Step 1: send the user to Google.
app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

// Step 2: Google redirects back here with a code. Passport handles the
// code exchange automatically, then calls our verify() function above.
app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login-failed',
  }),
  (req, res) => {
    res.redirect('/');
  }
);

app.get('/login-failed', (req, res) => {
  res.status(401).send('Login failed. <a href="/">Try again</a>');
});

// Step 1: send the user to Facebook.
// No scope requested here - Facebook grants public_profile (name, id,
// photo) by default with no approval needed. "email" is left out for
// now since it needs to be explicitly enabled in the Meta dashboard
// first (Use cases -> Facebook Login -> Customize -> add "email").
app.get(
  '/auth/facebook',
  passport.authenticate('facebook', {
    scope: [],
  })
);

// Step 2: Facebook redirects back here with a code, same idea as Google.
// Using a custom callback here (instead of failureRedirect) so that if
// something goes wrong, we see the REAL reason on screen instead of a
// generic "login failed" with no explanation.
app.get('/auth/facebook/callback', (req, res, next) => {
  passport.authenticate('facebook', (err, user, info) => {
    console.log('Facebook callback result:', { err, user, info });

    if (err) {
      return res
        .status(500)
        .send('<h1>Auth error</h1><pre>' + err.stack + '</pre>');
    }
    if (!user) {
      return res
        .status(401)
        .send('<h1>Login rejected by Facebook</h1><pre>' + JSON.stringify(info, null, 2) + '</pre><a href="/">Back</a>');
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res
          .status(500)
          .send('<h1>Session error</h1><pre>' + loginErr.stack + '</pre>');
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running: http://localhost:${port}`);
});