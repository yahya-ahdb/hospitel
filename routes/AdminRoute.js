const express = require("express")
const { verifyUser } = require("../middlewares/authMiddlewares")
const { getAllUsersController, getAllDoctorController, ChangeController } = require("../controllers/AdminCont")

const router = express.Router()


router.get("/getAllUser", verifyUser ,getAllUsersController )

router.get("/getAllDoctor", verifyUser ,getAllDoctorController )

router.post("/changeAccuntStatus", verifyUser ,ChangeController )

module.exports = router