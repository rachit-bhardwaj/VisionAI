const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    age: {
    type: Number,
    required: [true, "Age is required"],
    min: 18,
  },
  gender: {
    type: String,
    enum: ["male", "female", "others"],
    lowercase: true,
    required: true
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    minlength: 10,
    maxlength: 10,
    unique: true
  },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getResetPasswordToken = function () {

  const resetToken = crypto
    .randomBytes(20)
    .toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire =
    Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);