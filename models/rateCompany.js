const mongoose = require("mongoose");

const rateCompanySchema = mongoose.Schema({
    utilitiesPoint:{
        type:Number,
        required:true,
    },
    serviceQuality:{
        type:Number,
        required:true,
    },
    employeePoint:{
        type:Number,
        required:true,
    },
    safetyPoint:{
        type:Number,
        required:true,
    },
    totalPoint:{
        type:Number,
        required:true,
    },
    status:{
        type:Boolean,
        default:true,
    }
},{
    timestamps:true,
});

const RateCompany = mongoose.model("RateCompany",rateCompanySchema);

module.exports = {rateCompanySchema,RateCompany};