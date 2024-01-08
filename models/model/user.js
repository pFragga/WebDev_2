class User {
  constructor(username, password) {
    this.userName = username;
    this.userPassword = password;
    this.favorites = [];
  }
}

module.exports = User;