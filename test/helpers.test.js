const { assert } = require('chai');
const users = require('../data/users');
const { getUserByEmail } = require('../helpers');

describe('getUserByEmail', function() {
  it ('should return an object', () => {
    const user = getUserByEmail('stevethecat@gmail.com', users);
    assert.isObject(user);
  });
  it('should return a valid user in database', () => {
    const user = getUserByEmail('stevethecat@gmail.com', users);
    const expectedOutput = {
      id: 'na0weg', 
      email: 'stevethecat@gmail.com', 
      password: 'hashed password'
    };

    assert.deepEqual(user, expectedOutput);
  });
  it ('should return undefined if user not in database', () => {
    const user = getUserByEmail('hello123@gmail.com', users);
    assert.isUndefined(user);
  })
});