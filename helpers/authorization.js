const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/user");
const jwtSignature = config.get("jwtSignature");

const auth = (roles) => async(req,res,next) => {
    try{
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = await jwt.verify(token, jwtSignature);
        const allowRolers = roles || ["user","admin"];
        const foundedUser = await User.findOne({
            _id: decoded._id,
            tokens: token,
            role: { $in: allowRolers },
          });
        if (!foundedUser)return res.status(401).send({ message: "You are not authorized" });
        req.user = foundedUser;
        req.token = token; 
        next();
    }catch(err){
        console.log(err);
        res.status(500).send({message:"You are not authorized"})
    }
} 

module.exports = auth;