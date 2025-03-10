const asyncWrapper = require("../middlewares/asyncWrapper");
const { NotFound, BadRequest } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const checkPermission = require("../helpers/checkPermission");
const Order = require("../models/Order");
const Product = require("../models/Product");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createOrder = asyncWrapper(async (req, res) => {
  req.body.user = req.user.id;

  const {
    orderItems,
    paymentMethod,
    subtotal,
    tax,
    shippingFee,
    totalPrice,
    user,
  } = req.body;

  if (!orderItems && orderItems.length === 0) {
    throw new NotFound("no order items");
  }
  if (!paymentMethod || !subtotal || !tax || !shippingFee || !totalPrice) {
    throw new BadRequest("please provide all values");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalPrice * 100,
    currency: "gel",
  });

  const order = await Order.create({
    orderItems,
    paymentMethod,
    subtotal,
    tax,
    shippingFee,
    user,
  });

  res
    .status(StatusCodes.OK)
    .json({ clientSecret: paymentIntent.client_secret, orderId: order._id });
});

const confirmPayment = asyncWrapper(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    throw new NotFound("order not found");
  }

  if (order.isPaid) {
    throw new BadRequest("order is already paid");
  }

  for (const item of order.orderItems) {
    const product = await Product.findOne({ _id: item.product });

    if (!product) {
      throw new NotFound("product not found");
    }
    if (product.stock < item.amount) {
      throw new BadRequest("Out of stock");
    }

    product.stock -= item.amount;
    await product.save();
  }

  order.isPaid = true;
  order.paidAt = new Date();
  await order.save();

  res.status(StatusCodes.OK).json({ msg: "payment successfull" });
});

const getAllOrders = asyncWrapper(async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "get all orders" });
});

const getSingleOrder = asyncWrapper(async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "get single order" });
});

const currentUserOrders = asyncWrapper(async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "current user orders" });
});

module.exports = {
  createOrder,
  confirmPayment,
  getAllOrders,
  getSingleOrder,
  currentUserOrders,
};
