const express = require("express")
const { Login, Register, authController, applyDoctorController, getAllNotificationController, deletetAllNotificationController, getAllDoctorsController, BookAppointmantsController, BookingAvailbityController, UserAppointmantController } = require("../controllers/UsersCont")
const { verifyUser } = require("../middlewares/authMiddlewares")

const router = express.Router()


router.post("/login", Login )

router.post("/register", Register )

router.post("/getuserdata", verifyUser , authController )

router.post("/apply-doctor", verifyUser , applyDoctorController )

router.post("/get-all-notification", verifyUser , getAllNotificationController )

router.post("/delete-all-notification", verifyUser , deletetAllNotificationController )

router.get("/getAllDoctors" , verifyUser , getAllDoctorsController)

router.post("/book-appointmant" , verifyUser , BookAppointmantsController)

router.post("/booking-avaibility" , verifyUser , BookingAvailbityController)

router.get("/user-appointmant" , verifyUser , UserAppointmantController)


module.exports = router