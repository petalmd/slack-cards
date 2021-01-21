module.exports = ( client ) => {
  return {
    getUserById: (userId)  => {
      return client.users.profile.get({
        user: userId,
      });
    }
  }
};
