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
const uRedirect = require('./routes/uRedirect');
const urlsRouter = require('./routes/urls');

// ROUTING MODULES
server.use('/u', uRedirect);
server.use('/urls', urlsRouter);

// HELPER FUNCTIONS
const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
}

const checkIDBy = (key, property) => {
  for (let user in users) {
    if (users[user][key] === property) {
      return users[user].id;
    }
  }
  return undefined;
}

// ROUTING
server.get('/', (req, res) => {
  res.redirect('/urls');
});

server.get('/login', (req, res) => {
  const { user_id } = req.cookies;
  const user = users[user_id];
  let templateVars = { user };

  res.render('login', templateVars);
})

server.post('/login', (req, res) => {
  // UPDATE THIS FOR NEW LOGIN FLOW
  const {email, password} = req.body;
  const id = checkIDBy('email', email);
  const confirmPassword = checkIDBy('password', password);

  if (id && confirmPassword) {
    res.cookie('user_id', id);
    res.redirect('/urls');
  } else {
    res.redirect(403, '/login');
  }
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
  const emailExists = checkIDBy('email', email);

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

server.listen(PORT, () => {
  console.log(`Example server listening on port ${PORT}!`);
});