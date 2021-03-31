const mongoose = require("mongoose");

const floorSeatsSchema = mongoose.Schema({
    floor:{
        type:String,
        required:true,
    },
    listSeats:[[{name:String}]]
})


const busSchema = mongoose.Schema({
    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required:true,
    },
    licensePlate:{
        type:String,
        required:true,
        unique:true,
    },
    typeBus:{
        type:String,
        required:true,
    },
    images:{
        type:[String],
        default:[],
    },
    seats:{
        type:[floorSeatsSchema],
        required:true
    },
    status:{
        type:Boolean,
        default:true,
    }
},{
    timestamps: true, 
});
const Bus = mongoose.model('Bus',busSchema);
module.exports = Bus
