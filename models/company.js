const mongoose = require("mongoose");

const addressOfficeSchema = mongoose.Schema({
  provice: {
    type: String,
    trim: true,
  },
  address: {
    type: [String],
    trim: true,
  },
});

const routeInfoSchema = mongoose.Schema({
  from:{
    id:{type:String,required:true},
    name:{type:String,required:true}
  },
  to:{
    id:{type:String,required:true},
    name:{type:String,required:true}
  }
});

const tripFareSchema = mongoose.Schema({
  tripName:{type:String,required:true},
  toState:{type:mongoose.Schema.Types.ObjectId,ref:"ProviceCity",required:true},
  fromState:{type:mongoose.Schema.Types.ObjectId,ref:"ProviceCity",required:true},
  toDistrict:{type:mongoose.Schema.Types.ObjectId,ref:"District",required:true},
  fromDistrict:{type:mongoose.Schema.Types.ObjectId,ref:"District",required:true},
  busType:{type:String,required:true},
  fare: {type:Number, required:true},
})

const companySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    addressOffice: {
      type: [addressOfficeSchema],
      required: true,
    },
    hotline: {
      type: [String],
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    introdution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IntroCompany",
      default:null
    },
    routes: [{type:routeInfoSchema}],
    comment: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "CommentCompany" }],
      default:null,
    },
    overall: {
      type: Number,
      default: 0,
    },
    overallCount:{
      type:Number,
      default:0,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    fare:{
      type:[tripFareSchema],
      default:[],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model("Company", companySchema);
module.exports = Company;
