const mongoose = require("mongoose");
const { seatSchema } = require("./seat");

const pickDropSchema = mongoose.Schema({
  time:{type:String,required:true},
  place:{type:String,required:true}
})

const tripSchema = mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    fromState: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      requred: true,
    },
    toState:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      requred: true,
    },
    departurePlace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      requred: true,
    },
    arrivalPlace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      requred: true,
    },
    pickUpPoint:{
      type:[pickDropSchema],
      required:true
    },
    dropOffPoint:{
      type:[pickDropSchema],
      required:true
    },
    startedDate:{
      type: Date,
      required: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: Date,
      requred: true,
    },
    image: {
      type: String,
    },
    utilites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Utility",
      },
    ],
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },
    seats: {
      type: [
        {
          floor: String,
          listSeats: [[seatSchema]],
        },
      ],
      required: true,
    },
    prize: {
      type: Number,
      required: true,
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

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;
