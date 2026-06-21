import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    unique: true
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    set: (age) => {
      return `${age} years`;
    }
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Others"],
    required: true
  },
  phone: {
    type: String,
    required: true,
    minlength: 10,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: {
    getters: true
  }
});

const User = mongoose.model("User", userSchema);

export default User;


