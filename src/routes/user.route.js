const {Router}=  require("express")
const router = Router()

const {getProfile} = require("../controllers/user.controller")
const { tokenMiddleware } = require("../middlewares/token.middleware")
const { isUserMiddleware } = require("../middlewares/isuser.middleware")

router.get("/profile",tokenMiddleware,isUserMiddleware,getProfile)


module.exports = router