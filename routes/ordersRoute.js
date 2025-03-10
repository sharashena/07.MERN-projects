const express = require("express");
const router = express.Router();
const { authPermission } = require("../middlewares/authMiddleware");

const {
  createOrder,
  confirmPayment,
  getAllOrders,
  getSingleOrder,
  currentUserOrders,
} = require("../controllers/ordersController");

router.route("/").post(createOrder).get(authPermission("admin"), getAllOrders);
router.get("/userOrders", currentUserOrders);
router.post("/confirm-payment", confirmPayment);
router.get("/:id", getSingleOrder);

module.exports = router;
