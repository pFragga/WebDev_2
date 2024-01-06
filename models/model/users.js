const User = require('./user');
var usersArr = [];
usersArr[0] = new User('exampleUser', 'examplePassword'); // Add a user for testing
for (let i = 1; i < 5; i++) {
  usersArr[i] = new User('user' + i, 'pass' + i);
}
module.exports = usersArr;