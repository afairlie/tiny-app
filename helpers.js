const users = require('./data/users');

const getUserByEmail = function(email, database) {
  for (let user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  }
  return undefined;
};

// DEPRECATED
const retrieveIDBy = (key, property) => {
  for (let user in users) {
    if (users[user][key] === property) {
      return users[user].id;
    }
  }
  return undefined;
}

module.exports = { getUserByEmail };