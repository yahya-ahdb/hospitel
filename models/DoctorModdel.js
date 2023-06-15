const mongoose = require("mongoose")

const doctorSchema = new mongoose.Schema({
    userId:{
        type :String
    },
    firstName :{
        type :String,
        required : [true , 'First name is required']
    },
    lastName :{
        type :String,
        required : [true , 'Last name is required']
    },
    phone :{
        type :String ,
        required :[true , 'Phone is required']
    },
    email :{
        type :String ,
        required :[true , 'Email is required']
    },
    website :{
        type :String ,
    },
    address :{
        type :String ,
        required :[true , 'Address is required']
    },
    specialization :{
        type :String ,
        required :[true , 'Specialization is required']
    },
    expreience :{
        type :String ,
        required :[true , 'Expreience is required']
    },
    feesPerCunsaltation :{
        type :Number ,
        required :[true , 'fee is required']
    },
    status :{
        type:String,
        default : "pending"
    },
    timings :{
        type:Object,
        required :[true , 'wrok timing is required']
    }
}, {timestamps :true})


module.exports = mongoose.model("Doctors" ,doctorSchema)