const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: { type: String, unqiue: true },
    login: { type: String, unqiue: true },
    password: { type: String },
    role: { type: String, enum: ["user", "admin"] },
  },
  { timestamps: true }
);

const userModel = model("user", userSchema);

module.exports = userModel;
