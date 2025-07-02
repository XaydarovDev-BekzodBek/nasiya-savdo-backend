const { findById } = require("../controllers/user.controller");
const userModel = require("../models/user.model");

exports.isUserMiddleware = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.decoded.id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error.message);
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.decoded.id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    if(user.role !== 'admin'){
      res.status(401).json({success:false,message:"Unauthorization"})
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error.message);
  }
};
