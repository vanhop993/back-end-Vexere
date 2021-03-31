const mongoose = require("mongoose");

const introCompanySchema = mongoose.Schema({
    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required:true,
    },
    title:{
        type:String,
        default:"",
    },
    content:{
        type:String,
        default:"",
    }
},
{
    timestamps: true,
})

const IntroCompany = mongoose.model("IntroCompany",introCompanySchema);
module.exports = IntroCompany;