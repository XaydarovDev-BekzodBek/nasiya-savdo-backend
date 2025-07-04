const { hash } = require("argon2");
const userModel = require("../models/user.model");

exports.getProfile = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ user: req.user, success: true, message: "user found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.user._id,
      { ...req.body, password: await hash(req.body.password) },
      {
        new: true,
      }
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, messgae: "user not found" });
    return res.status(200).json({ success: true, message: "user updated" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
