const Users = require("../models/UsersModel");
const Doctors = require("../models/DoctorModdel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UsersModel = require("../models/UsersModel");
const Appointmants = require("../models/ApppoitmanModle");
const moment = require("moment")

exports.Register = async (req, res) => {
  try {
    const existuser = await Users.findOne({ email: req.body.email });
    if (existuser) {
      return res
        .status(200)
        .send({ message: "User Already Exist", success: false });
    }
    var slat = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, slat);
    const user = new Users({ ...req.body, password: hash });
    await user.save();
    res.status(201).json({ user, success: true });
  } catch (Err) {
    res.status(500).json(Err.message);
  }
};

exports.Login = async (req, res) => {
  try {
    const userFound = await Users.findOne({ email: req.body.email });
    if (!userFound)
      return res
        .status(200)
        .send({ message: "User n't found", success: false });
    const IsMatch = await bcrypt.compare(req.body.password, userFound.password);
    if (!IsMatch)
      return res
        .status(200)
        .send({ message: "The email or password invlid", success: false });

    const token = jwt.sign({ id: userFound._id }, process.env.SEC_JWT, {
      expiresIn: "1d",
    });
    res.status(200).json({ user: userFound, token, success: true });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.authController = async (req, res) => {
  try {
    const user = await Users.findOne({ _id: req.body.userId });
    if (!user) {
      return res
        .status(200)
        .send({ messgae: "user not found", seccuss: false });
    } else {
      res.status(200).json({
        seccuss: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isDoctor: user.isDoctor,
          seennotification: user.seennotification,
          notification: user.notification,
        },
      });
    }
  } catch (error) {
    res.status(401).send({ seccuss: false, message: "Auth error", error });
  }
};

exports.applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await Doctors({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await Users.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastNmae} Has Applied For A Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        OnclickPath: "/admin/doctors",
      },
    });

    await Users.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Doctor Account Applied Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error while Applying for doctor ",
    });
  }
};

exports.getAllNotificationController = async (req, res) => {
  try {
    const user = await Users.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const udpateUser = await user.save();
    res.status(200).send({
      success: true,
      messgae: "all notifiaction marked as read",
      data: udpateUser,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      messgae: "Error in notifiaction",
    });
  }
};

exports.deletetAllNotificationController = async (req, res) => {
  try {
    const user = await Users.findOne({ _id: req.body.userId });
    user.seennotification = [];
    user.notification = [];
    const updateuser = await user.save();
    updateuser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notififcation Deleted successfully",
      data: updateuser,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "unable to delete all notification",
    });
  }
};

exports.getAllDoctorsController = async (req, res) => {
  try {
    const doctor = await Doctors.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctor Lists Fetched Successfully",
      data: doctor,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      messgae: "Error Fetching data",
    });
  }
};

exports.BookAppointmantsController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date , 'DD-MM-YYYY').toISOString()
    req.body.time = moment(req.body.time , 'HH:mm').toISOString()
    req.body.status = "pending";
    const newAppointmant = new Appointmants({ ...req.body });
    await newAppointmant.save();
    const user = await Users.findOne({ _id: req.body.doctorInfo.userId });
    user.notification.push({
      type: "New-appointmant-request",
      message: "A new appointmant request from " + req.body.userInfo.name,
      onClickPath: "/user/appointmants",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointmants Book Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      messgae: "Error Fetching data",
    });
  }
};

exports.BookingAvailbityController = async (req, res) => {
  try {
    const { doctorId  } = req.body
    const date = moment(req.body.date , "DD-MM-YYYY").toISOString()
    const fromTime = moment(req.body.time , "HH:mm").subtract(1 , "hours").toISOString()
    const toTime = moment(req.body.time , "HH:mm").add(1 , "hours").toISOString()

    const appointmants = await Appointmants.find({ doctorId , date , time :{
      $gte : fromTime , $lte : toTime 
    }})
    if(appointmants.length > 0){
      return res.status(200).send({
        success  :true ,
        message : "Appointmants not availibale al this time"
      })
    }else{
      return res.status(200).send({
        success  :true ,
        message : "Appointmants booked successfully"
      })
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      messgae: "Error is Booking",
    });
  }
};
exports.UserAppointmantController = async (req, res) => {
  try {
    const  appointmants = await Appointmants.find({ userId :  req.body.userId })
    res.status(200).send({
      success : true ,
      message : "Users appointmants fetching successfully",
      data : appointmants
    })

  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      messgae: "Error is user appointmant",
    });
  }
};
