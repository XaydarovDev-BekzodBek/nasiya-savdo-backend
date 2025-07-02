const { validateMiddleware } = require("../middlewares/validation.middleware");
const { Login } = require("../controllers/auth.controller");
const { Router } = require("express");
const { AuthSchema } = require("../validations/auth.validation");

const router = Router();

router.post("/login", validateMiddleware(AuthSchema), Login);

module.exports = router