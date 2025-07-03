const userModel = require("../models/user.model");
const { verify } = require("argon2");
const { createToken } = require("../utils/token");

exports.Login = async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await userModel.findOne({ login });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const isValidPassword = await verify(user.password, password);

    if (!isValidPassword) {
      return res
        .status(401)
        .json({ message: "Invalid Password", success: false });
    }

    const token = await createToken(user._id);
    return res.status(200).json({
      message: "login is successfully",
      success: true,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
