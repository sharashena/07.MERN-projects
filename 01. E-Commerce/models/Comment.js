const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 0.5,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "please provide a comment"],
      maxLength: [300, "comment can't be more than 300 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CommentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

CommentSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

CommentSchema.statics.calculateAverage = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        rating: { $avg: "$rating" },
        numOfComments: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    const rating = result[0].rating;
    const numOfComments = result[0].numOfComments;

    await mongoose
      .model("Product")
      .findOneAndUpdate({ _id: productId }, { rating, numOfComments });
  } else {
    await mongoose
      .model("Product")
      .findOneAndUpdate({ id: productId }, { rating: 0, numOfComments: 0 });
  }
};

CommentSchema.post("save", async function () {
  await this.constructor.calculateAverage(this.product);
});

CommentSchema.post("deleteOne", { document: true }, async function () {
  await this.constructor.calculateAverage(this.product);
});

module.exports = mongoose.model("Comment", CommentSchema);
