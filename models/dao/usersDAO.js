class UsersDAO {
  getAll() {
    return usersArr;
  }

  isRegistered(username) {
    return usersArr.includes(username);
  }
}
