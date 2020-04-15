// PACKAGES ETC.
const express = require('express');
const morgan = require('morgan')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const server = express();
const PORT = 8080; // default port 8080

server.set('view engine', 'ejs');
server.use(bodyParser.urlencoded({extended: true}));
server.use(cookieParser());
server.use(morgan('tiny'));

// HELPER FUNCTIONS
const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
}

// DB
const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

const users = {
  'na0weg': {
    id: 'na0weg', 
    email: 'stevethecat@gmail.com', 
    password: 'booboo'
  },
  'zby6d7': {
    id: 'zby6d7', 
    email: 'vassart.max@gmail.com', 
    password: 'livefreeordie'
  }
}

// ROUTING
server.get('/', (req, res) => {
  res.redirect('/urls');
});

server.post('/login', (req, res) => {
  const {username} = req.body;
  res.cookie('username', username);
  res.redirect('/urls');
})

server.post('/logout', (req, res) => {
  // post to logout
  res.clearCookie('user_id');
  res.redirect('/urls');
})

server.get('/register', (req, res) => {
  res.render('register');
})


server.post('/register', (req, res) => {
  const id = generateRandomString();
  const {email, password} = req.body;
  users[id] = {id, email, password};

  res.cookie('user_id', id);
  res.redirect('/urls');
})

server.get('/urls', (req, res) => {
  const { user_id } = req.cookies;
  const urls = urlDatabase;
  const user = users[user_id];

  let templateVars = { urls, user };

  res.render('urls_index', templateVars);
});

server.get("/urls/new", (req, res) => {
  const { user_id } = req.cookies;
  const user = users[user_id];
  let templateVars = { user };

  res.render("urls_new", templateVars);
});

server.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;

  res.redirect(`urls/${shortURL}`);
});

server.get('/urls/:shortURL', (req, res) => {
  const { user_id } = req.cookies;
  const user = users[user_id];
  const { shortURL } = req.params;
  const { longURL } = urlDatabase[shortURL];
  let templateVars = { user, shortURL, longURL};

  res.render('urls_show', templateVars);
});

server.post('/urls/:shortURL', (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = req.body.longURL
  urlDatabase[shortURL] = longURL;

  res.redirect('/urls')
})

server.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];

  res.redirect(longURL);
});

server.post('/urls/:shortURL/delete', (req, res) => {
  const { shortURL } = req.params;
  delete urlDatabase[shortURL];

  res.redirect('/urls');
})

server.listen(PORT, () => {
  console.log(`Example server listening on port ${PORT}!`);
});