// SERVER
const express = require('express');
const server = express();
const PORT = 8080; // default port 8080

// MODULES & MIDDLEWARE
const morgan = require('morgan')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

server.set('view engine', 'ejs');
server.use(bodyParser.urlencoded({extended: true}));
server.use(cookieParser());
server.use(morgan('tiny'));

// LOCAL MODULES
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

const fetchUserByCookie = (req) => {
  const { user_id } = req.cookies;
  return userObj = users[user_id];
}

const retrieveIDBy = (key, property) => {
  for (let user in users) {
    if (users[user][key] === property) {
      return users[user].id;
    }
  }
  return undefined;
}

// ROUTING
server.get('/', (req, res) => {
  const user = fetchUserByCookie(req);
  const templateVars = { user };

  res.render('landing', templateVars);
});

server.get('/register', (req, res) => {
  const user = fetchUserByCookie(req);
  let templateVars = { user };

  res.render('register', templateVars);
})


server.post('/register', (req, res) => {
  const id = generateRandomString();
  const {email, password} = req.body;
  const emailExists = retrieveIDBy('email', email);
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (!email || !password) {
    res.redirect(401, '/register');
  } else if (emailExists) {
    res.redirect(401, '/register');
  } else {
    users[id] = {id, email, password: hashedPassword};

    res.cookie('user_id', id);
    res.redirect('/urls');
  }
})

server.get('/login', (req, res) => {
  const user = fetchUserByCookie(req);
  let templateVars = { user };

  res.render('login', templateVars);
})

server.post('/login', (req, res) => {
  const {email, password} = req.body;
  // REFACTOR: convoluted.
  const id = retrieveIDBy('email', email);
  const hashedPassword = users[id].password;
  ;

  if (id && bcrypt.compareSync(password, hashedPassword)) {
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

server.listen(PORT, () => {
  console.log(`Example server listening on port ${PORT}!`);
});