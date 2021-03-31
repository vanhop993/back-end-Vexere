const mongoose = require("mongoose");

const seatSchema = mongoose.Schema({
    name:{
        type:String,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null,
    },
    statusBooking:{
        type:Boolean,
        default:false
    },
},{
    timestamps: true, 
});
const Seat = mongoose.model("Seats",seatSchema);
module.exports = {Seat , seatSchema}