const express = require("express")
const dotenv = require("dotenv")
const colors = require("colors")
const morgan = require("morgan")
const mongoose = require("mongoose")
const UserRoute = require("./routes/User")
const adminRoute = require("./routes/AdminRoute")
const DoctorRoute = require("./routes/DoctorRoute")
const cors = require('cors')
const path =require("path")

dotenv.config()

mongoose.connect(process.env.DataDB)
.then(()=>{
    console.log('DBdatabase connacted');
}).catch((err)=>{
    console.log("error in DB " +err);
});

const app =express()

app.use(express.json())
app.use(cors())
app.use(morgan("dev"))

app.use("/api/user", UserRoute)
app.use("/api/admin", adminRoute)
app.use("/api/doctor", DoctorRoute)

app.use(express.static(path.join(__dirname , "./build")))

app.get("*", function(req,res){
    res.sendFile(path.json(__dirname , './build/index.html'))
})

const PORT = process.env.PORT || 8000 ;
app.listen(PORT,(req,res)=>{
    console.log("App listen PORT = 8000");
})