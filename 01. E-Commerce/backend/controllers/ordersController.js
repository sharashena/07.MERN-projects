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
  const orders = await Order.find({});

  if (!orders) {
    throw new NotFound("There are no orders added yet");
  }

  res
    .status(StatusCodes.OK)
    .json({ numOfOrders: orders.length, result: orders });
});

const getSingleOrder = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findOne({ _id: id });

  if (!order) {
    throw new NotFound(`order not found with id: ${id}`);
  }

  res.status(StatusCodes.OK).json({ result });
});

const currentUserOrders = asyncWrapper(async (req, res) => {
  const orders = await Order.find({});
  checkPermission(req.user, orders.user);

  res
    .status(StatusCodes.OK)
    .json({ numOfOrders: orders.length, result: orders });
});

module.exports = {
  createOrder,
  confirmPayment,
  getAllOrders,
  getSingleOrder,
  currentUserOrders,
};
