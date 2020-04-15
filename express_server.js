// SERVER
const express = require('express');
const server = express();
const PORT = 8080; // default port 8080

// MODULES & MIDDLEWARE
const morgan = require('morgan')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

server.set('view engine', 'ejs');
server.use(bodyParser.urlencoded({extended: true}));
server.use(cookieParser());
server.use(morgan('tiny'));

// LOCAL MODULES
const urlDatabase = require('./data/urlDatabase');
const users = require('./data/users');
const uRedirect = require("./routes/uRedirect");

// ROUTING MODULES
server.use('/u', uRedirect);

// HELPER FUNCTIONS
const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
}

const findEmail = (email) => {
  for (let user in users) {
    if (email === users[user].email){
      return email;
    }
  }
  return undefined;
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
  res.clearCookie('user_id');
  res.redirect('/urls');
})

server.get('/register', (req, res) => {
  const { user_id } = req.cookies;
  const user = users[user_id];
  let templateVars = { user };

  res.render('register', templateVars);
})


server.post('/register', (req, res) => {
  const id = generateRandomString();
  const {email, password} = req.body;
  const emailExists = findEmail(email);

  if (!email || !password) {
    res.redirect(401, '/register');
  } else if (emailExists) {
    console.log(email);
    res.redirect(401, '/register');
  } else {
    users[id] = {id, email, password};

    res.cookie('user_id', id);
    res.redirect('/urls');
  }
  console.log(users);
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

server.post('/urls/:shortURL/delete', (req, res) => {
  const { shortURL } = req.params;
  delete urlDatabase[shortURL];

  res.redirect('/urls');
})

server.listen(PORT, () => {
  console.log(`Example server listening on port ${PORT}!`);
});