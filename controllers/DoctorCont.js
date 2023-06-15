const  Appointmants  = require("../models/ApppoitmanModle");
const Doctors = require("../models/DoctorModdel");
const Users = require("../models/UsersModel")

exports.getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await Doctors.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Doctor data fetch success",
      data: doctor,
    });
  } catch (error) {
    res.status(500).send({
      sucess: false,
      error,
      message: "Error is fetching data",
    });
  }
};

exports.UpdateDoctorInfoController = async (req, res) => {
  try {
    const doctor = await Doctors.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Doctor data fetch success",
      data: doctor,
    });
  } catch (error) {
    res.status(500).send({
      sucess: false,
      error,
      message: "Error is update data",
    });
  }
};

exports.getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await Doctors.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "Doctor Appointments fetch successfully",
      data: doctor,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in single doctor info",
    });
  }
};

exports.DoctorAppointmantController = async (req, res) => {
  try {
    const doctor = await Doctors.findOne({ userId: req.body.userId });
    const appointment = await Appointmants.find({
      doctorId: doctor._id,
    });
    res.status(200).send({
      success: true,
      message: "Doctor Appointments fetch successfully",
      data: appointment,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Doc Appointments",
    });
  }
};

exports.UpdateStatusController = async (req, res) => {
  try {
    const { appointmentId , status } = req.body
    const appointmants = await Appointmants.findByIdAndUpdate( appointmentId , { status } )
    const user =await Users.findOne({ _id : appointmants.userId })
    const notification = user.notification
    notification.push({
      type : "status-updated",
      message : "Your appointments has been updated " + status,
      onClickPath : "/doctor-appointments",
    })
    console.log(status , appointmants);
    await user.save()

    res.status(200).send({
      success: true,
      message: "Appointments stutas Updated",
      data: appointmants,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Doc Appointments",
    });
  }
};
