const mongoose = require("mongoose");
const { rateStationSchema } = require("./rateStation");

const commentStationSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    station:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Station",
        required:true,
    },
    rating:{
        type:rateStationSchema,
        required:true,
    },
    content:{
        type:String,
    },
    status:{
        type:Boolean,
        default:true,
    }
},{
    timestamps:true,
});

const CommentStation = mongoose.model("CommentStation",commentStationSchema);
module.exports = CommentStation;