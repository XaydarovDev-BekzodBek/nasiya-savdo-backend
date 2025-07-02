const { Router } = require("express");

const router = Router();
const { paidProduct, paidPurchase, paidNasiya } = require("../controllers/paid.controller");
const { validateMiddleware } = require("../middlewares/validation.middleware");
const { PaidSchema } = require("../validations/paid.validation");
const { tokenMiddleware } = require("../middlewares/token.middleware");
const { isAdmin } = require("../middlewares/isuser.middleware");

router.post(
  "/:id",
  validateMiddleware(PaidSchema),
  tokenMiddleware,
  isAdmin,
  paidNasiya
);

router.post(
  "/:id/:purchaseId",
  validateMiddleware(PaidSchema),
  tokenMiddleware,
  isAdmin,
  paidPurchase
);

router.post(
  "/:id/:purchasesId/:productId",
  validateMiddleware(PaidSchema),
  tokenMiddleware,
  isAdmin,
  paidProduct
);

module.exports = router;
