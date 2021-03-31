const mongoose = require("mongoose");
const Place = require("../models/place");
const ProviceCity = require("../models/proviceCity");
const Station = require("../models/station");
const convertCode = require("../slug");

const postNewStation = async (req, res) => {
  const {
    proviceCity,
    name,
    address,
    provice,
    hotline,
    introdution,
  } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const code = convertCode(`${name}`);
    const foundedProviceCity = await ProviceCity.findOne({
      _id: proviceCity,
      status: true,
    }).session(session);
    if (!foundedProviceCity)
      return res
        .status(401)
        .send({ message: "Tỉnh/thành phố không tồn tại!!" });
    const foundedStation = await Station.findOne({ code });
    if (foundedStation && foundedStation.status === true)
      return res.status(401).send({ message: "Bến xe đã tồn tại!!" });
    let result;
    if (!foundedStation) {
      result = await Station.create(
        [
          {
            name,
            address,
            proviceCity,
            hotline,
            code,
            introdution,
          },
        ],
        { session: session }
      );
      await Place.create(
        [
          {
            type: "station",
            idPrivate: result[0]._id,
            name,
            code,
          },
        ],
        { session: session }
      );
    } else {
      foundedStation.status = true;
      result = [await foundedStation.save()];
      const foundedPlace = await Place.findOne({ idPlace: foundedStation._id });
      foundedPlace.status = true;
      await foundedPlace.save();
    }
    await session.commitTransaction();
    session.endSession;
    res.status(200).send(result[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession;
    console.log(err);
    res.status(500).send({ message: "You are not authorized" });
  }
};

const getAllStation = async (req, res) => {
  try {
    const foundedStation = await Station.find({ status: true });
    res.status(200).send(foundedStation);
  } catch (err) {
    res.status(500).send({ message: "You are not authorized" });
  }
};

const getStation = async (req, res) => {
  const { code } = req.query;
  try {
    const foundedStation = await Station.findOne({ code, status: true });
    if (!foundedStation)
      return res.status(401).send({ message: "Bến xe không tồn tại!!" });
    res.status(200).send(foundedStation);
  } catch (err) {
    res.status(500).send({ message: "You are not authorized" });
  }
};

module.exports = { postNewStation, getStation, getAllStation };
