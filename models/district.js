const mongoose = require("mongoose");

const districtSchema = mongoose.Schema(
  {
    proviceCity:{type:mongoose.Schema.Types.ObjectId,ref:"ProviceCity",required:true},
    name: { type: String, required: true,trim:true },
    code:{type:String,required:true,unique:true},
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const District = mongoose.model("District",districtSchema);
module.exports = District;