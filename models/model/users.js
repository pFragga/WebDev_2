const UserModel = require('./user');  // Import the User class from user.js

const usersArr = [];

// Populate usersArr with sample users
for (let i = 0; i < 5; i++) {
  usersArr[i] = new UserModel('user' + i, 'pass' + i);
}

module.exports = usersArr;