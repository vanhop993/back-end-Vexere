const mongoose = require("mongoose");
const Bus = require("../models/bus");
const Company = require("../models/company");
const Station = require("../models/station");
const Trip = require("../models/trip");
const Utility = require("../models/utility");
const { Seat } = require("../models/seat");
const Ticket = require("../models/ticket");
const ProviceCity = require("../models/proviceCity");
const Place = require("../models/place");

const postNewTRip = async (req, res) => {
  let {
    company,
    fromState,
    toState,
    pickUpPoint,
    dropOffPoint,
    startedDate,
    departurePlace,
    arrivalPlace,
    departureTime,
    arrivalTime,
    image,
    utilites,
    bus,
    prize,
  } = req.body;
  startedDate = startedDate + " 00:00:00";
  try {
    const foundedCompany = await Company.findOne({
      _id: company,
      status: true,
    });
    if (!foundedCompany)
      return res.status(401).send({ message: "Công ty không tồn tại!!" });
    const foundedBus = await Bus.findOne({ _id: bus, company, status: true });
    if (!foundedBus)
      return res.status(401).send({ message: "Xe không tồn tại!!" });
    const foundedState = await Place.find().or([
      { _id: fromState, status: true },
      { _id: toState, status: true },
    ]);
    if (foundedState.length !== 2)
      return res.status(401).send({ message: "TỉnhThành phố không tồn tại!!" });
    const foundedStation = await Place.find().or([
      { _id: departurePlace, status: true },
      { _id: arrivalPlace, status: true },
    ]);
    if (foundedStation.length !== 2)
      return res
        .status(401)
        .send({ message: "Điểm khởi hành hoặc điểm kết thúc không tồn tại!!" });
    const foundedTrip = await Trip.findOne({ bus, departureTime });
    if (foundedTrip)
      return res
        .status(401)
        .send({
          massage: `Xe đã có chuyến xuất phát lúc ${
            departureTime.split(" ")[1]
          } ngày ${departureTime.split(" ")[0]}`,
        });
    for (let item of utilites) {
      const foundedUtility = await Utility.findOne({ _id: item, status: true });
      if (!foundedUtility) {
        return res.status(401).send({ message: "Tiện ích không tồn tại!!" });
      }
    }
    const arrSeats = foundedBus.seats.map((objFloor) => {
      return {
        floor: objFloor.floor,
        listSeats: objFloor.listSeats.map((arrRowSeats) => {
          return arrRowSeats.map((seat) => {
            if (seat) {
              return new Seat({
                name: seat.name,
              });
            } else return null;
          });
        }),
      };
    });
    const newTrip = await new Trip({
      company,
      fromState,
      toState,
      pickUpPoint,
      dropOffPoint,
      startedDate,
      departurePlace,
      arrivalPlace,
      departureTime,
      arrivalTime,
      image,
      utilites,
      bus,
      seats: arrSeats,
      prize,
    }).save();
    res.status(200).send(newTrip);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "You are not authorized" });
  }
};

const postBooking = async (req, res) => {
  const { trip_Id, arrSeats_Id } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundedTrip = await Trip.findOne({
      _id: trip_Id,
      status: true,
    }).session(session);
    if (!foundedTrip)
      return res.status(200).send({ message: "Chuyến đi không tồn tại!!" });
    let arrFoundedSeats = [];
    let arrSeatsIsBooking = [];
    foundedTrip.seats = foundedTrip.seats.map((arrFloor) => {
      return {
        floor: arrFloor.floor,
        listSeats: arrFloor.listSeats.map((arrSeat) => {
          return arrSeat.map((seat) => {
            if (seat) {
              for (let seatId of arrSeats_Id) {
                if (seatId == seat._id) {
                  arrFoundedSeats.push(seat);
                  if (!seat.statusBooking) {
                    seat.user = req.user._id;
                    seat.statusBooking = true;
                  } else {
                    arrSeatsIsBooking.push(seat);
                  }
                }
              }
            }
            return seat;
          });
        }),
      };
    });
    if (arrFoundedSeats.length < arrSeats_Id.length)
      return res.status(401).send({ message: "Ghế không tồn tại!!" });
    if (arrSeatsIsBooking.length > 0) {
      let mes = "";
      arrSeatsIsBooking.forEach((seat, index) => {
        let test = index < arrSeatsIsBooking.length - 1 ? "," : "";
        mes = mes + `${seat.name}` + test;
      });
      return res.status(401).send({ message: `Ghế ${mes} đã bị đặt!!` });
    }
    await foundedTrip.save();
    await Ticket.create(
      [
        {
          user: req.user._id,
          trip: foundedTrip._id,
          seats: arrFoundedSeats,
        },
      ],
      { session: session }
    );
    await session.commitTransaction();
    session.endSession;
    res.status(200).send({ message: "Đặt vé thành công!!" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession;
    console.log(err);
    res.status(500).send({ message: "You are not authorized" });
  }
};

const getTrip = async (req, res) => {
  let { departurePlace, arrivalPlace, startedDate } = req.query;
  startedDate = startedDate + " 00:00:00";
  try {
    const foundedTrip = await Trip.find({
      fromState: departurePlace,
      toState: arrivalPlace,
      startedDate,
      status: true,
    })
      .or([
        {
          fromState: departurePlace,
          toState: arrivalPlace,
          startedDate,
          status: true,
        },
        {
          departurePlace,
          arrivalPlace,
          startedDate,
          status: true,
        },
        {
          fromState: departurePlace,
          arrivalPlace,
          startedDate,
          status: true,
        },
        {
          departurePlace,
          toState: arrivalPlace,
          startedDate,
          status: true,
        }
      ])
      .populate(
        "company departurePlace arrivalPlace bus utilites",
        "name licensePlate typeBus provice"
      );
    res.status(200).send(foundedTrip);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "You are not authorized" });
  }
};

const getTripByCompany = async (req, res) => {
  const { code } = req.query;
  try {
    const foundedCompany = await Company.findOne({ code, status: true });
    if (!foundedCompany)
      return res.status(200).send({ message: "Công ty không tôn tại!!!" });
    const foundedTrip = await Trip.find().populate(
      "company departurePlace arrivalPlace utilites",
      "name code "
    );
    const result = foundedTrip.filter((trip) => code === trip.company.code);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "You are not authorized" });
  }
};

module.exports = { postNewTRip, getTrip, getTripByCompany, postBooking };
