const express = require("express");
const router = express.Router();
const {
  createComment,
  getAllComments,
  getSingleComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentsController");
const { authPermission } = require("../middlewares/authMiddleware");

router.route("/").post(createComment).get(getAllComments);
router
  .route("/:id")
  .get(authPermission("admin"), getSingleComment)
  .patch(updateComment)
  .delete(deleteComment);

module.exports = router;
