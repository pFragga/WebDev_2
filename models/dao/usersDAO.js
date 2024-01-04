const User = require('../model/user');  // Adjust the path based on your project structure

class UsersDAO {
  constructor() {
    this.usersArr = [];  // Assuming you're storing user instances here
  }

  getAll() {
    return this.usersArr;
  }

  // Add a method to check if the user with the given username and password exists
  authenticateUser(username, password) {
    const user = this.usersArr.find(u => u.userName === username);

    if (user && user.isValidPassword(password)) {
      return user;
    }

    return null;  // Authentication failed
  }

  // Add a method to check if a username is already registered
  isRegistered(username) {
    return this.usersArr.some(user => user.userName === username);
  }

  // Add a method to register a new user
  registerUser(username, password) {
    if (!this.isRegistered(username)) {
      const newUser = new User(username, password);
      this.usersArr.push(newUser);
      return true;  // Registration successful
    }

    return false;  // User already registered
  }
}

module.exports = UsersDAO;