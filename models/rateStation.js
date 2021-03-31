const mongoose = require("mongoose");

const rateStationSchema = mongoose.Schema({
    serviceQuality:{
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

const RateStation = mongoose.model("RateStation",rateStationSchema);

module.exports = {rateStationSchema,RateStation};