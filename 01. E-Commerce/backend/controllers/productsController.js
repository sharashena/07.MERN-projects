const Product = require("../models/Product");
const asyncWrapper = require("../middlewares/asyncWrapper");
const { StatusCodes } = require("http-status-codes");
const checkPermission = require("../helpers/checkPermission");
const { NotFound, BadRequest } = require("../errors");
const cloudinary = require("cloudinary").v2;
const fs = require("fs").promises;
const path = require("path");
const { v4: uuid } = require("uuid");
const productsValidations = require("../validations/productValidations");

const createProduct = asyncWrapper(async (req, res) => {
  req.body.user = req.user.id;
  const errors = productsValidations(req.body);

  if (Object.keys(errors).length > 0) {
    throw new BadRequest(JSON.stringify(errors));
  }

  let images = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const oldFilePath = path.join(__dirname, "../uploads/", file.filename);

      file.path = file.path.replace(/\\/g, "/");
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "e-commerce",
        use_filename: true,
      });

      images.push({
        id: uuid(),
        name: file.originalname,
        width: result.width,
        height: result.height,
        size: result.bytes,
        src: result.secure_url,
      });

      try {
        fs.unlink(oldFilePath);
      } catch (error) {
        throw new BadRequest("failed to delete temporary files");
      }
    }
  }

  const colors = JSON.parse(req.body.colors.replace(/\\/g, ""));

  await Product.create({
    ...req.body,
    images: images.length > 0 ? images : undefined,
    colors,
  });

  res.status(StatusCodes.CREATED).json({ msg: "product successfully created" });
});

const getAllProducts = asyncWrapper(async (req, res) => {
  const products = await Product.find({})
    .populate("user", "username")
    .populate("comments", "comment rating")
    .select("-colors -stock")
    .sort({ name: 1 });

  if (!products) {
    throw new NotFound("Unfortunetly, there are no products");
  }

  res
    .status(StatusCodes.OK)
    .json({ numOfProducts: products.length, result: products });
});

const getSingleProduct = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id }).populate(
    "user",
    "username"
  );
  if (!product) {
    throw new NotFound("product not found");
  }
  res.status(StatusCodes.OK).json({ result: product });
});

const getFilteredProducts = asyncWrapper(async (req, res) => {
  const { featured, shipping, search, category, company, sort, price } =
    req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (shipping) {
    queryObject.shipping = shipping === "true" ? true : false;
  }
  if (category !== "all" && category !== undefined) {
    queryObject.category = category;
  }
  if (company !== "all" && company !== undefined) {
    queryObject.company = company;
  }
  if (search) {
    queryObject.name = { $regex: `^${search}`, $options: "i" };
  }
  if (price) {
    queryObject.price = { $lte: price };
  }

  let result = Product.find(queryObject)
    .populate("user", "username")
    .select("-colors -stock");

  if (sort) {
    if (sort === "a-z") {
      result = result.sort({ name: 1 });
    } else if (sort === "z-a") {
      result = result.sort({ name: -1 });
    } else if (sort === "price highest") {
      result = result.sort({ price: -1 });
    } else if (sort === "price lowest") {
      result = result.sort({ price: 1 });
    }
  } else {
    result = result.sort("createdAt");
  }

  const products = await result;
  res
    .status(StatusCodes.OK)
    .json({ numOfProducts: products.length, result: products });
});

const getCurrentUserProducts = asyncWrapper(async (req, res) => {
  const products = await Product.find({ user: req.user.id })
    .populate("user", "username")
    .select("-users -createdAt -updatedAt")
    .sort({ name: 1 });

  if (!products) {
    throw new NotFound("There is no product added, yet");
  }

  res
    .status(StatusCodes.OK)
    .json({ numOfProducts: products.length, result: products });
});

const updateProduct = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { existingImages } = req.body;

  let product = await Product.findOne({ _id: id });
  checkPermission(req.user, product.user);

  if (!product) {
    throw new NotFound("product not found");
  }

  let updatedImages =
    existingImages.length > 0 ? JSON.parse(existingImages) : [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const newImgUrl = path.join(__dirname, `../uploads/${file.filename}`);

      file.path = file.path.replace(/\\/g, "/");

      const result = await cloudinary.uploader.upload(file.path, {
        folder: "e-commerce",
        use_filename: true,
      });

      updatedImages.push({
        id: uuid(),
        name: file.originalname,
        width: result.width,
        height: result.height,
        size: result.bytes,
        src: result.secure_url,
      });

      try {
        fs.unlink(newImgUrl);
      } catch (error) {
        throw new BadRequest("failed to delete temporary files");
      }
    }
  }

  const updateData = { ...req.body };

  updateData.images =
    updatedImages.length > 0 ? updatedImages : [{ src: "/assets/default.jpg" }];

  product = await Product.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ msg: "product successfully updated" });
});

const deleteProduct = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id });
  checkPermission(req.user, product.user);

  if (!product) {
    throw new NotFound("product not found");
  }

  await product.deleteOne();

  res.status(StatusCodes.OK).json({ msg: "product successfully deleted" });
});

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  getFilteredProducts,
  getCurrentUserProducts,
  updateProduct,
  deleteProduct,
};
