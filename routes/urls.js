const express = require("express");
const router = express.Router();

// LOCAL MODULES
const urlDatabase = require('../data/urlDatabase');
const users = require('../data/users');

// HELPER FUNCTIONS
const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
}

// ROUTING
router.get('/', (req, res) => {
  const { user_id } = req.cookies;
  const urls = urlDatabase;
  const user = users[user_id];

  let templateVars = { urls, user };

  res.render('urls_index', templateVars);
});

router.get("/new", (req, res) => {
  const { user_id } = req.cookies;
  if (user_id) {
    const user = users[user_id];
    let templateVars = { user };
  
    res.render("urls_new", templateVars);
  } else {
    res.redirect(403, '/login');
  }
});

router.post("/", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;

  res.redirect(`urls/${shortURL}`);
});

router.get('/:shortURL', (req, res) => {
  const { user_id } = req.cookies;
  const user = users[user_id];
  const { shortURL } = req.params;
  const longURL = urlDatabase[shortURL];
  let templateVars = { user, shortURL, longURL};

  res.render('urls_show', templateVars);
});

router.post('/:shortURL', (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = req.body.longURL
  urlDatabase[shortURL] = longURL;

  res.redirect('/urls');
})

router.post('/:shortURL/delete', (req, res) => {
  const { shortURL } = req.params;
  delete urlDatabase[shortURL];

  res.redirect('/urls');
})

module.exports = router;