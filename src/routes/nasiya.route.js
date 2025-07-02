const { Router } = require("express");
const router = Router();

const {
  destroy,
  create,
  findAll,
  findOne,
  update,
  paidProduct,
} = require("../controllers/nasiya.controller");
const { validateMiddleware } = require("../middlewares/validation.middleware");
const { nasiyaSchema } = require("../validations/nasiya.validation");
const { tokenMiddleware } = require("../middlewares/token.middleware");
const { isAdmin } = require("../middlewares/isuser.middleware");

// post
router.post(
  "/create/usta",
  validateMiddleware(nasiyaSchema),
  tokenMiddleware,
  isAdmin,
  create("usta")
);
router.post(
  "/create/klient",
  validateMiddleware(nasiyaSchema),
  tokenMiddleware,
  isAdmin,
  create("klient")
);

// get
router.get("/get/usta", tokenMiddleware, isAdmin, findAll("usta"));
router.get("/get/klient", tokenMiddleware, isAdmin, findAll("klient"));
// byid
router.get("/get/usta/:id", tokenMiddleware, isAdmin, findOne("usta"));
router.get("/get/klient/:id", tokenMiddleware, isAdmin, findOne("klient"));
// update
router.put("/update/usta/:id", tokenMiddleware, isAdmin, update("usta"));
router.put("/update/klient/:id", tokenMiddleware, isAdmin, update("klient"));
// delete
router.delete("/delete/usta/:id", tokenMiddleware, isAdmin, destroy("usta"));
router.delete("/delete/klient/:id", tokenMiddleware, isAdmin, destroy("usta"));

module.exports = router;
