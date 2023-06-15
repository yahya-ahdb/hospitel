const express = require('express')
const { verifyUser } = require('../middlewares/authMiddlewares')
const { getDoctorInfoController, UpdateDoctorInfoController, getDoctorByIdController, DoctorAppointmantController, UpdateStatusController } = require('../controllers/DoctorCont')

const router = express.Router()

router.post("/getDoctorInfo" , verifyUser , getDoctorInfoController )

router.post("/updateDoctorInfo" , verifyUser , UpdateDoctorInfoController )

router.post("/getDoctorById" , verifyUser , getDoctorByIdController )

router.get("/doctor-appointmants" , verifyUser , DoctorAppointmantController)

router.post("/update-status" , verifyUser , UpdateStatusController)

module.exports = router