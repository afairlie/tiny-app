const express = require('express');
const server = express();
const PORT = 8080; // default port 8080

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
}

server.get('/', (req, res) => {
  res.send('Hello!');
})

server.listen(PORT, () => {
  console.log(`Example server listening on port ${PORT}!`)
})