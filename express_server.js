// SERVER
const express = require('express');
const server = express();
const PORT = 8080; // default port 8080

// MODULES & MIDDLEWARE
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

server.set('view engine', 'ejs');
server.use(morgan('tiny'));
server.use(bodyParser.urlencoded({extended: true}));
server.use(cookieSession({
  name: 'session',
  keys: ['8dcf3953-0682-421f-9d88-9e611fe5898a', 'c58234cd-cc0b-4a9f-8d31-32257e7bcd6f']
}));

// LOCAL MODULES
const urlDatabase = require('./data/urlDatabase');
const users = require('./data/users');
const urlsRouter = require('./routes/urls');

// ROUTING MODULES
server.use('/urls', urlsRouter);

// HELPER FUNCTIONS

const { getUserByEmail, fetchUserByCookie } = require('./helpers');

// ROUTING
server.get('/', (req, res) => {
  const user = fetchUserByCookie(req, users);
  if (user) {
    res.redirect('/urls');
  } else {
    const templateVars = { user };

    res.render('landing', templateVars);
  }
});

server.get('/register', (req, res) => {
  const user = fetchUserByCookie(req, users);
  if (user) {
    res.redirect('/urls');
  } else {
    let templateVars = { user };

    res.render('register', templateVars);
  }
});


server.post('/register', (req, res) => {
  const {email, password} = req.body;
  const userExists = getUserByEmail(email, users);
  // const user = fetchUserByCookie(req, users);

  if (!email || !password) {
    res.redirect(401, 'http://localhost:8080/register');
  } else if (userExists) {
    res.redirect(403, 'http://localhost:8080/login');
  } else {
    const id = uuidv4();
    const hashedPassword = bcrypt.hashSync(password, 10);
    users[id] = {id, email, password: hashedPassword};

    req.session.user_id = id;
    res.redirect('/urls');
  }
});

server.get('/login', (req, res) => {
  const user = fetchUserByCookie(req, users);
  const templateVars = { user };

  if (user) {
    res.redirect('/urls');
  } else {
    res.render('login', templateVars);
  }
});

server.post('/login', (req, res) => {
  const {email, password} = req.body;
  const user = getUserByEmail(email, users);

  if (!email || !password) {
    res.redirect(401, 'http://localhost:8080/login');
  } else if (user) {
    const { id } = user;
    const hashedPassword = users[id].password;
    if (bcrypt.compareSync(password, hashedPassword)) {
      req.session.user_id = id;
      res.redirect('/urls');
    } else {
      res.redirect(403, 'http://localhost:8080/login');
    }
  } else {
    res.redirect(403, 'http://localhost:8080/login');
  }
});

server.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

server.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL]) {
    const { longURL } = urlDatabase[shortURL];
    res.redirect(longURL);
  } else {
    res.redirect(400, 'http://localhost:8080/');
  }
});

server.listen(PORT, () => {
  console.log(`Example server listening on port ${PORT}!`);
});