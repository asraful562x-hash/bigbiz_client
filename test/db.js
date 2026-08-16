// db.js
// Stores users in a plain JSON file (users.json) instead of a real
// database. Simple to read and inspect, but keep in mind: every save
// rewrites the whole file, so this isn't safe under heavy concurrent
// writes. Fine for learning projects and small personal apps.

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'users.json');

// Create the file with an empty array if it doesn't exist yet.
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
}

function readUsers() {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw || '[]');
}

function writeUsers(users) {
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

/**
 * Given the profile Google returns after login, find the matching
 * local user, or create one if this is their first time logging in.
 * google_sub is Google's permanent unique ID for that person — never
 * changes, so it's used as the lookup key (not email).
 */
function findOrCreateGoogleUser(googleProfile) {
  const users = readUsers();
  const google_sub = googleProfile.id;

  const existing = users.find((u) => u.google_sub === google_sub);
  if (existing) return existing;

  const email = googleProfile.emails && googleProfile.emails[0]
    ? googleProfile.emails[0].value
    : null;
  const name = googleProfile.displayName || null;
  const avatar_url = googleProfile.photos && googleProfile.photos[0]
    ? googleProfile.photos[0].value
    : null;

  const newUser = {
    id: nextId(users),
    google_sub,
    facebook_id: null,
    email,
    name,
    avatar_url,
    created_at: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);
  return newUser;
}

/**
 * Same idea, but for Facebook. facebook_id is Facebook's permanent
 * unique ID for that person, used as the lookup key.
 *
 * Note: this creates a SEPARATE user row from a Google login, even if
 * the email matches. Facebook doesn't always return a verified email,
 * so silently merging by email is a spoofing risk. Real account-linking
 * (letting one person attach both providers to one account) should
 * happen as a deliberate, logged-in action - e.g. an "connect Facebook"
 * button inside the app - not an automatic guess at signup time.
 */
function findOrCreateFacebookUser(facebookProfile) {
  const users = readUsers();
  const facebook_id = facebookProfile.id;

  const existing = users.find((u) => u.facebook_id === facebook_id);
  if (existing) return existing;

  const email = facebookProfile.emails && facebookProfile.emails[0]
    ? facebookProfile.emails[0].value
    : null;
  const name = facebookProfile.displayName || null;
  const avatar_url = facebookProfile.photos && facebookProfile.photos[0]
    ? facebookProfile.photos[0].value
    : null;

  const newUser = {
    id: nextId(users),
    google_sub: null,
    facebook_id,
    email,
    name,
    avatar_url,
    created_at: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);
  return newUser;
}

function nextId(users) {
  return users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
}

function findById(id) {
  const users = readUsers();
  return users.find((u) => u.id === id) || null;
}

module.exports = { findOrCreateGoogleUser, findOrCreateFacebookUser, findById };