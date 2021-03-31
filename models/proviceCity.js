const mongoose = require("mongoose");

const proviceCitySchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim:true },
    status: { type: Boolean, default: true },
    code:{type:String,required:true,unique:true},
    // district: {
    //   type: [{ type: mongoose.Schema.Types.ObjectId, ref: "District" }],
    //   default: [],
    // },
    // station: {
    //   type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Station" }],
    //   default: [],
    // },
  },
  {
    timestamps: true,
  }
);

const ProviceCity = mongoose.model("ProviceCity",proviceCitySchema);
module.exports = ProviceCity;