const { Router } = require("express");
const router = Router();

const {
  destroy,
  create,
  findAll,
  findOne,
  update,
  paidProduct,
  updatePurchase,
} = require("../controllers/nasiya.controller");
const { validateMiddleware } = require("../middlewares/validation.middleware");
const { nasiyaSchema, nasiyaPurchaseSchema } = require("../validations/nasiya.validation");
const { tokenMiddleware } = require("../middlewares/token.middleware");
const { isAdmin } = require("../middlewares/isuser.middleware");

// usta
router.post(
  "/create/usta",
  validateMiddleware(nasiyaSchema),
  tokenMiddleware,
  isAdmin,
  create("usta")
);
router.get("/get/usta", tokenMiddleware, isAdmin, findAll("usta"));
router.get("/get/usta/:id", tokenMiddleware, isAdmin, findOne("usta"));
router.put(
  "/update/usta/:id/:purchaseId",
  validateMiddleware(nasiyaPurchaseSchema),
  tokenMiddleware,
  isAdmin,
  updatePurchase("usta")
);
router.put(
  "/update/usta/:id",
  validateMiddleware(nasiyaSchema),
  tokenMiddleware,
  isAdmin,
  update("usta")
);
router.delete("/delete/usta/:id", tokenMiddleware, isAdmin, destroy("usta"));

// klient
router.post(
  "/create/klient",
  validateMiddleware(nasiyaSchema),
  tokenMiddleware,
  isAdmin,
  create("klient")
);
router.get("/get/klient", tokenMiddleware, isAdmin, findAll("klient"));
router.get("/get/klient/:id", tokenMiddleware, isAdmin, findOne("klient"));
router.put(
  "/update/klient/:id",
  validateMiddleware(nasiyaSchema),
  tokenMiddleware,
  isAdmin,
  update("klient")
);
router.delete("/delete/klient/:id", tokenMiddleware, isAdmin, destroy("usta"));

module.exports = router;
