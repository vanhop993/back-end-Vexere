const mongoose = require("mongoose");

const utilitySchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    code:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    status:{
        type:Boolean,
        default:true,
    },
},{
    timestamps: true, 
});

const Utility = mongoose.model("Utility",utilitySchema);
module.exports = Utility;