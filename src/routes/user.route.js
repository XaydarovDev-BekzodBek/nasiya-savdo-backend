const { Router } = require("express");
const router = Router();

const { getProfile, updateUser } = require("../controllers/user.controller");
const { tokenMiddleware } = require("../middlewares/token.middleware");
const { isUserMiddleware } = require("../middlewares/isuser.middleware");
const { validateMiddleware } = require("../middlewares/validation.middleware");
const { userSchema } = require("../validations/user.validation");

router.get("/profile", tokenMiddleware, isUserMiddleware, getProfile);
router.put(
  "/profile",
  validateMiddleware(userSchema),
  tokenMiddleware,
  isUserMiddleware,
  updateUser
);

module.exports = router;
