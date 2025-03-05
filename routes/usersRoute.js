const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  deleteUser,
} = require("../controllers/usersController");
const { authPermission } = require("../middlewares/authMiddleware");

router.get("/", [authPermission("admin")], getAllUsers);
router.get("/currentUser", showCurrentUser);
router.patch("/updateUserPassword", updateUserPassword);
router
  .route("/:id")
  .get(authPermission("admin"), getSingleUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
