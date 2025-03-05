const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: {
      type: String,
      required: [true, "please provide product name"],
      maxLength: [25, "product name can't be more than 25 characters"],
      minLength: [3, "product name can't be less than 3 characters"],
    },
    company: {
      type: String,
      required: [true, "please provide product company"],
      enum: {
        values: ["marcos", "liddy", "ikea", "caressa"],
        message: "{VALUE} isn't valid value",
      },
    },
    category: {
      type: String,
      required: [true, "please provide product category"],
      enum: ["living room", "kitchen", "bedroom", "dining", "office", "kids"],
    },
    price: {
      type: Number,
      required: [true, "please provide product price"],
    },
    colors: {
      type: [String],
      required: [true, "please provide product color"],
    },
    images: {
      type: [Object],
      default: [{ src: "/assets/default.jpg" }],
    },
    description: {
      type: String,
      maxLength: [500, "product description can't be more than 500 characters"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    shipping: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      required: [true, "please provide product stock"],
    },
    rating: {
      type: Number,
      default: 0,
    },
    numOfComments: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toObject: { virtuals: true } }
);

ProductsSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

ProductsSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

ProductsSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

ProductsSchema.pre("deleteOne", { document: true }, function () {
  return mongoose.model("Comment").deleteMany({ product: this._id });
});

module.exports = mongoose.model("Product", ProductsSchema);
