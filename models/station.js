const mongoose = require("mongoose");

const stationSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    proviceCity:{type:mongoose.Schema.Types.ObjectId,ref:"ProviceCity"},
    hotline:{
        type:[String],
    },
    comment:{
        type:[{type:mongoose.Schema.Types.ObjectId,ref:"CommentStation",}],
        default:null,
    },
    totalPoint:{
        type:Number,
        default:0
    }
    ,
    code:{
        type:String,
        required:true,
        unique:true,
    },
    introdution:{
        type:String,
    },
    status:{
        type:Boolean,
        default:true,
    }
},{
    timestamps: true,
});

const Station = mongoose.model("Station",stationSchema);
module.exports = Station;