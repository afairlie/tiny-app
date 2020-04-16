const express = require("express");
const router = express.Router();

// LOCAL MODULES
const urlDatabase = require('../data/urlDatabase');
const users = require('../data/users');

// HELPER FUNCTIONS
const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
}

const fetchUserByCookie = (req) => {
  const { user_id } = req.cookies;
  return userObj = users[user_id];
}

// take in userID, iterate database, return userURLsObj
const fetchURLSByUser = (signedInUser) => {
  let userURLsObj = {}
  for (let shortURL in urlDatabase) {
    const { user_id } = urlDatabase[shortURL];
    if (user_id === signedInUser) {
      userURLsObj[shortURL] = urlDatabase[shortURL];
    }
  }
  return userURLsObj;
}

// ROUTING
// view url index - my URLs
router.get('/', (req, res) => {
  const user = fetchUserByCookie(req);

  if (user) {
    const userURLs = fetchURLSByUser(user.id)
    const templateVars = { userURLs, user };
  
    res.render('urls_index', templateVars);
  } else {
    res.redirect('../');
  }
});

// create new URL
router.get("/new", (req, res) => {
  const user = fetchUserByCookie(req);

  if (user) {
    const templateVars = { user };
  
    res.render("urls_new", templateVars);
  } else {
    res.redirect('../');
  }
});

// post new URL
router.post("/", (req, res) => {
  const shortURL = generateRandomString();
  const { longURL } = req.body;
  const { user_id } = req.cookies;
  // UPDATE FLOW
  urlDatabase[shortURL] = { longURL, user_id }

  res.redirect(`urls/${shortURL}`);
});

// individual URL page
router.get('/:shortURL', (req, res) => {
  const user = fetchUserByCookie(req);

  if (user) {
  const { shortURL } = req.params;
  const { longURL } = urlDatabase[shortURL];
  
  const templateVars = { user, shortURL, longURL};

  res.render('urls_show', templateVars);
  } else {
    res.redirect(403, '/login');
  }
});

// update individual longURL
router.post('/:shortURL', (req, res) => {
  // UPDATE template to use fetchUserByCookie?
  const { user_id } = req.cookies;
  let { shortURL } = req.params;
  let { longURL } = req.body;
  urlDatabase[shortURL] = { longURL, user_id };

  res.redirect('/urls');
})

// delete URL from database
router.post('/:shortURL/delete', (req, res) => {
  const { shortURL } = req.params;
  delete urlDatabase[shortURL];

  res.redirect('/urls');
})

module.exports = router;