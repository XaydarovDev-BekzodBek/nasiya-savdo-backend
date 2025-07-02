const jwt = require("jsonwebtoken")

exports.createToken = async (id) => {
  const data = { id };

  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "31d" });
};
