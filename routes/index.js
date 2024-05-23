const express =require("express")
const router = express.Router()
const usersRoutes = require("./user")

router.use("/",usersRoutes)

module.exports=router