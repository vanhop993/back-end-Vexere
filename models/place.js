const mongoose = require("mongoose");

const placeSchema = mongoose.Schema(
  {
    type:{
      type:String,required:true
    },
    idPrivate:{
      type:String,
      required:true
    },
    name:{
      type:String,
      trim:true,
      required:true
    },
    code:{
      type:String,
      required:true,
      unique:true
    },
    status:{
      type:Boolean,
      default:true
    }
  },
  {
    timestamps: true,
  }
);

const Place = mongoose.model("Place",placeSchema);
module.exports = Place