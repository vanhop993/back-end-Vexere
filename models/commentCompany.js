const mongoose = require("mongoose");
const { rateCompanySchema } = require("./rateCompany");

const commentCompanySchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required:true,
    },
    rating:{
        type:rateCompanySchema,
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

const CommentCompany = mongoose.model("CommentCompany",commentCompanySchema);
module.exports = CommentCompany;