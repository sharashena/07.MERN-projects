const asyncWrapper = require("../middlewares/asyncWrapper");
const { NotFound, BadRequest } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const checkPermission = require("../helpers/checkPermission");
const commentsValidations = require("../validations/commentsValidations/commentsValidations");
const Comment = require("../models/Comment");
const Product = require("../models/Product");

const createComment = asyncWrapper(async (req, res) => {
  req.body.user = req.user.id;
  const { product: productId, rating } = req.body;

  const errors = commentsValidations(req.body);

  if (Object.keys(errors).length > 0) {
    throw new BadRequest(JSON.stringify(errors));
  }

  if (rating < 0.5) {
    throw new BadRequest("rating must be between 0,5 to 5");
  } else if (rating > 5) {
    throw new BadRequest("rating must be between 0,5 to 5");
  }

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new NotFound(`product not found with id: ${productId}`);
  }

  const lastComment = await Comment.findOne({
    user: req.user.id,
    product: productId,
  }).sort({ createdAt: -1 });

  if (lastComment) {
    const timeDiff = (Date.now() - lastComment.createdAt) / 1000 / 60;

    if (timeDiff < 5) {
      return res
        .status(StatusCodes.TOO_MANY_REQUESTS)
        .json({ errors: { msg: "you can only comment per 5 minutes" } });
    }
  }

  await Comment.create({ product: productId, ...req.body });

  res.status(StatusCodes.CREATED).json({ msg: "comment succesfully created" });
});

const getAllComments = asyncWrapper(async (req, res) => {
  const comments = await Comment.find({})
    .sort({ createdAt: 1 })
    .populate("user", "username");

  if (!comments) {
    throw new NotFound("product has no comments yet");
  }

  res
    .status(StatusCodes.CREATED)
    .json({ numOfComments: comments.length, result: comments });
});

const getSingleComment = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findOne({ _id: id })
    .populate("user", "username")
    .populate("product", "name");

  if (!comment) {
    throw new BadRequest(`comment not found with id: ${id}`);
  }

  res.status(StatusCodes.CREATED).json({ result: comment });
});

const updateComment = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { comment: comm, rating } = req.body;

  const errors = commentsValidations(req.body);

  if (Object.keys(errors).length > 0) {
    throw new BadRequest(JSON.stringify(errors));
  }

  const comment = await Comment.findOne({ _id: id });
  if (!comment) {
    throw new BadRequest(`comment not found with id: ${id}`);
  }

  checkPermission(req.user, comment.user);

  const lastComment = await Comment.findOne({
    user: req.user.id,
    _id: id,
  }).sort({ updatedAt: -1 });

  if (lastComment) {
    const timeDiff = (Date.now() - lastComment.updatedAt) / 1000 / 60;

    if (timeDiff < 3) {
      return res
        .status(StatusCodes.TOO_MANY_REQUESTS)
        .json({ errors: { msg: "you can only update comment per 3 minutes" } });
    }
  }

  comment.comment = comm;
  comment.rating = rating;

  await comment.save();

  res.status(StatusCodes.CREATED).json({ msg: "comment successfully updated" });
});

const deleteComment = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findOne({ _id: id });

  if (!comment) {
    throw new BadRequest(`comment not found with id: ${id}`);
  }

  checkPermission(req.user, comment.user);

  await comment.deleteOne();

  res.status(StatusCodes.CREATED).json({ msg: "comment successfully deleted" });
});

module.exports = {
  createComment,
  getAllComments,
  getSingleComment,
  updateComment,
  deleteComment,
};
