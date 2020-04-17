const users = require('./data/users');

const getUserByEmail = function(email, database) {
  for (let user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  }
  return undefined;
};

const fetchUserByCookie = (req, userDatabase) => {
  const { user_id } = req.session;
  return userObj = userDatabase[user_id];
}

module.exports = { getUserByEmail, fetchUserByCookie };