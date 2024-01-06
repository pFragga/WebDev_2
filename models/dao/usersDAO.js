// usersDAO.js
const User = require('../model/user');
const usersArr = require('../model/users');

class UsersDAO {
  constructor() {
    this.usersArr = usersArr;
  }

  getAll() {
    return this.usersArr;
  }

  isRegistered(username, password) {
    return this.usersArr.some(user => user.userName === username && user.userPassword === password);
  }
}

module.exports = UsersDAO;
