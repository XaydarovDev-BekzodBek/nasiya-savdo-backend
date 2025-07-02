exports.validateMiddleware = (schema) => (req, res, next) => {
  const data = schema.safeParse(req.body);

  if (data.error) {
    res.status(400).json({ message: data.error.errors, success: false });
  } else {
    next();
  }
};
