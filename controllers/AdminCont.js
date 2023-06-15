const Users = require("../models/UsersModel")
const Doctors = require("../models/DoctorModdel")
const UsersModel = require("../models/UsersModel")
const DoctorModdel = require("../models/DoctorModdel")

exports.getAllUsersController = async(req,res)=>{
    try {
        const users = await Users.find()
        res.status(200).json({
            success : true ,
            message : "Users data",
            data : users
        })
    } catch (error) {
        res.status(500).send({
            success : false , 
            error ,
            message : "Error fetching data"
        })
    }
}

exports.getAllDoctorController = async(req,res)=>{
    try {
        const doctors = await Doctors.find()
        res.status(200).json({
            success : true ,
            message : "Doctors data",
            data : doctors
        })
    } catch (error) {
        res.status(500).send({
            success : false , 
            error ,
            message : "Error fetching data"
        })
    }
}

exports.ChangeController = async(req,res)=>{
    try {
        const { doctorId , status } = req.body
        const doctor = await DoctorModdel.findByIdAndUpdate(doctorId , { status })
        const user =await UsersModel.findOne({_id : doctor.userId})
        const notification = user.notification
        notification.push({
            type:"doctor-account-request-updated",
            message : "Your Doctor Account Request Has " +status ,
            onClickPath : "/notification"
        })
        user.isDoctor = status === "approved" ? true : false
        await user.save()
        res.status(201).json({
            success : true,
            message : "Account Status Update",
            data : doctor
        })
    } catch (error) {
        res.status(500).send({
            success : false , 
            error ,
            message : "Error in Account status"
        })
    }
}

