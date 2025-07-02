const jwt = require("jsonwebtoken");

exports.tokenMiddleware = (req, res, next) => {
  if (!req["headers"]["authorization"]) {
    return res.status(401).json("error");
  }
  const [bearer, token] = req["headers"]["authorization"]?.split(" ");

  if (!token || bearer !== "Bearer") {
    return res.status(401).json("error");
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      res.status(401).json({ message: "unauthozation" });
    }
    req.decoded = decoded;
    next();
  });
};
