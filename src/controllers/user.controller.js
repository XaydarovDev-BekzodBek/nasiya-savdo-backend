const userModel = require("../models/user.model");

exports.getProfile = async (req, res) => {
  try {
    return res.status(200).json({user:req.user,success:true,message:"user found"})
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
