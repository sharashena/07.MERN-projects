const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "please provide a username"],
      trim: true,
      minLength: [3, "username can't be less than 3 characters"],
      maxLength: [25, "username can't be more than 25 characters"],
    },
    email: {
      type: String,
      required: [true, "please provide an email"],
      validate: {
        validator: validator.isEmail,
        message: "please provide valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "please provide a username"],
      minLength: [4, "password can't be less than 4 characters"],
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "user"],
        message: "{VALUE} isn't valid role",
      },
      default: "user",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpirationDate: Date,
    passwordToken: String,
    passwordTokenExpirationDate: Date,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

UserSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  const genSalt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, genSalt);
  next();
});

UserSchema.methods.comparePasswords = async function (clientPassword) {
  return await bcrypt.compare(clientPassword, this.password);
};

UserSchema.pre("deleteOne", { document: true }, async function (next) {
  await mongoose.model("Token").deleteMany({ user: this._id });
  next();
});

module.exports = mongoose.model("User", UserSchema);
