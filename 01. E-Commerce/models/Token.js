const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    refreshToken: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    isValid: { type: Boolean, default: true },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

TokenSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

TokenSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("Token", TokenSchema);
