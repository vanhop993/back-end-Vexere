const  mongoose  = require("mongoose");
const District = require("../models/district");
const Place = require("../models/place");
const ProviceCity = require("../models/proviceCity");
const Station = require("../models/station");
const convertCode = require("../slug");

const postNewProviceCity = async (req, res) => {
  const { name } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const code = convertCode(name);
    const foundedProviceCity = await ProviceCity.findOne({ code }).session(
      session
    );
    let result = [];
    if (foundedProviceCity) {
      if (foundedProviceCity.status)
        return res.status(401).send({ message: "Tỉnh/Thành phố đã tồn tại." });
      foundedProviceCity.status = true;
      // foundedProviceCity.district.forEach(async (district) => {
      //   const foundedDistrict = await District.findOne({ _id: district });
      //   foundedDistrict.status = true;
      //   await foundedDistrict.save();
      // });
      // foundedProviceCity.station.forEach(async (station) => {
      //   const foundedStation = await Station.findOne({ _id: station });
      //   foundedStation.status = true;
      //   await foundedStation.save();
      // });
      const foundedPlace = await Place.findOne({idPrivate:foundedProviceCity._id});
      foundedPlace.status = true;
      await foundedPlace.save();
      result = [await foundedProviceCity.save()];
    } else {
      result = await ProviceCity.create(
        [
          {
            name,
            code,
          },
        ],
        { session: session }
      );
      await Place.create([
        {
          type:"proviceCity",
          idPrivate:result[0]._id,
          name,
          code,
        }
      ],
      { session: session })
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

const getAllProviceCity = async(req,res) => {
  try{
    const foundedProviceCity = await ProviceCity.find({status:true});
    res.status(200).send(foundedProviceCity);
  }catch(err){
    console.log(err);
    res.status(500).send({ message: "You are not authorized" });
  }
}

module.exports = {postNewProviceCity,getAllProviceCity};
