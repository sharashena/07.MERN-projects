const { Forbidden } = require("../errors");

const checkPermission = (user, currentUserId) => {
  if (user.role === "admin") return;
  if (user.id === currentUserId.toString()) return;
  throw new Forbidden("request is forbidden to this route");
};

module.exports = checkPermission;
