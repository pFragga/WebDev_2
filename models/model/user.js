class User {
  constructor(username, password) {
    this.userName = username;
    this.userPassword = password;
  }

  // Add a method to check if the provided password matches the stored password
  isValidPassword(password) {
    return this.userPassword === password;
  }
}

module.exports = User;
