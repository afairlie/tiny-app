const express = require('express');
const server = express();
const PORT = 8080; // default port 8080

server.set('view engine', 'ejs');

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

server.get('/', (req, res) => {
  res.send('Hello!');
});

server.get('/urls', (req, res) => {
  let templateVars = {urls: urlDatabase};
  res.render('urls_index', templateVars);
});

server.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

server.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

server.listen(PORT, () => {
  console.log(`Example server listening on port ${PORT}!`);
});