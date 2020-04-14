const express = require('express');
const bodyParser = require("body-parser");
const server = express();
const PORT = 8080; // default port 8080

server.set('view engine', 'ejs');
server.use(bodyParser.urlencoded({extended: true}));

function generateRandomString() {
return Math.random().toString(36).substring(2, 8);
}

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

server.get('/', (req, res) => {
  res.redirect('/urls');
});

server.get('/urls', (req, res) => {
  let templateVars = {urls: urlDatabase};
  res.render('urls_index', templateVars);
});

server.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

server.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;

  res.redirect(`urls/${shortURL}`);
});

server.get('/urls/:shortURL', (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };

  res.render('urls_show', templateVars);
});

server.post('/urls/:shortURL', (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = req.body.longURL
  urlDatabase[shortURL] = longURL;
  res.redirect('/urls/')
})

server.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

server.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
})

server.listen(PORT, () => {
  console.log(`Example server listening on port ${PORT}!`);
});