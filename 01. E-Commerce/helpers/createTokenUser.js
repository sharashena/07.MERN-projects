const createTokenUser = user => ({
  id: user.id,
  username: user.username,
  role: user.role,
});

module.exports = createTokenUser;
