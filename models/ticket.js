const mongoose = require("mongoose");
const { seatSchema } = require("./seat");

const ticketSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    trip:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Trip",
        required:true,
    },
    seats:{
        type:[seatSchema],
        required:true,
    },
    status:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true,
});
const Ticket = mongoose.model("Ticket",ticketSchema);
module.exports = Ticket;