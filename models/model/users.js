const User = require('./user');
var usersArr = [];
usersArr[0] = new User('exampleUser0', 'examplePassword0'); 
usersArr[1] = new User('exampleUser1', 'examplePassword1'); 
usersArr[2] = new User('exampleUser2', 'examplePassword2'); 
usersArr[3] = new User('exampleUser3', 'examplePassword3'); 
module.exports = usersArr;