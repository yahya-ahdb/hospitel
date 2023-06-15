const JWT = require("jsonwebtoken")

exports.verifyUser = async(req , res, next)=>{
    try {
        const token = req.headers["authorization"].split(" ")[1];
        JWT.verify(token , process.env.SEC_JWT,(err,decode)=>{
            if(err){
                return res.status(200).send({ seccuss: false , message: "Auth Fialed" })
            }else{
                req.body.userId = decode.id;
                next()
            }
        })
        
    } catch (error) {
        res.status(401).send( { seccuss :false , message : error } )
    }
}