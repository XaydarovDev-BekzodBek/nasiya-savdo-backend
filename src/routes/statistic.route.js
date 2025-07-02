const { Router } = require("express");
const { tokenMiddleware } = require("../middlewares/token.middleware");
const { isAdmin } = require("../middlewares/isuser.middleware");

const router = Router();
const { statistic } = require("../controllers/statistic.controller");

router.get("/", tokenMiddleware, isAdmin, statistic);

module.exports = router;
