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

  getUserBySessionId(uuid) {
    return this.usersArr.find((user) => user.sessionId === uuid);
  }

  getUser(username, password) {
    return this.usersArr.find((user) => user.userName === username && user.userPassword === password);
  }

  setActive(username, password, sessionId) {
    const user = this.getUser(username, password);
    user['sessionId'] = sessionId;
  }

  isActive(username, password) {
    const user = this.getUser(username, password);
    return user.sessionId != null;
  }
}

module.exports = UsersDAO;
