const express = require("express");
const router = express.Router();
const urlDatabase = require('../data/urlDatabase');

router.get('/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];

  res.redirect(longURL);
});

module.exports = router;