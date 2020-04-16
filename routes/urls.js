const express = require("express");
const router = express.Router();

// LOCAL MODULES
const urlDatabase = require('../data/urlDatabase');
const users = require('../data/users');
const { fetchUserByCookie } = require('../helpers');

// HELPER FUNCTIONS
const generateShortURL = () => {
  return Math.random().toString(36).substring(2, 8);
}

// provide user ID, iterate database, return user's URLs
const fetchURLSByUser = (signedInUser, urlDB) => {
  let userURLsObj = {}
  for (let shortURL in urlDB) {
    const { user_id } = urlDB[shortURL];
    if (user_id === signedInUser) {
      userURLsObj[shortURL] = urlDB[shortURL];
    }
  }
  return userURLsObj;
}

// ROUTING

// PERMISSION RESTRICTED: view url index - my URLs
router.get('/', (req, res) => {
  const user = fetchUserByCookie(req, users);

  if (user) {
    const userURLs = fetchURLSByUser(user.id, urlDatabase)
    const templateVars = { userURLs, user };
  
    res.render('urls_index', templateVars);
  } else {
    res.redirect('../');
  }
});

// (RESTRICTED to users): create new URL
router.get("/new", (req, res) => {
  const user = fetchUserByCookie(req, users);

  if (user) {
    const templateVars = { user };
  
    res.render("urls_new", templateVars);
  } else {
    res.redirect('../');
  }
});

// post new URL
router.post("/", (req, res) => {
  const { longURL } = req.body;
  const { user_id } = req.session;

  const shortURL = generateShortURL();
  urlDatabase[shortURL] = { longURL, user_id }

  res.redirect(`urls/${shortURL}`);
});

// PERMISSION RESTRICTED: individual URL page
router.get('/:shortURL', (req, res) => {
  const user = fetchUserByCookie(req, users);
  const { shortURL } = req.params;

  if (user) {
    const userURLs = fetchURLSByUser(user.id, urlDatabase);

    if (userURLs[shortURL]) {
      const { longURL } = userURLs[shortURL];
      const templateVars = { user, shortURL, longURL};
    
      res.render('urls_show', templateVars);
    } else {
      res.redirect(403, '/login');
    }
  } else {
    res.redirect(403, '/login');
  }
});

// PERMISSION RESTRICTED update a longURL
router.post('/:shortURL', (req, res) => {
  const user = fetchUserByCookie(req, users);
  const { shortURL } = req.params;

  if (user) {
    const userURLs = fetchURLSByUser(user.id, urlDatabase);
    if (userURLs[shortURL]){
      const { longURL } = req.body;
      const user_id = user.id;
      urlDatabase[shortURL] = { longURL, user_id };
      console.log(urlDatabase);
      res.redirect('/urls');
    } else {
      res.redirect(403, '/login');
    }
  } else {
    res.redirect(403, '/login');
  }
})

// PERMISSION RESTRICTED: delete URL from database
router.post('/:shortURL/delete', (req, res) => {
  const user = fetchUserByCookie(req, users);
  const { shortURL } = req.params;

  if (user) {
    const userURLs = fetchURLSByUser(user.id, urlDatabase);

    if (userURLs[shortURL]){
      delete urlDatabase[shortURL];
      res.redirect('/urls');
    } else {
      res.redirect(403, '/login');
    }
  } else {
    res.redirect(403, '/login');
  }
})

module.exports = router;