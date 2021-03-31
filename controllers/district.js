const mongoose = require("mongoose");
const District = require("../models/district");
const Place = require("../models/place");
const ProviceCity = require("../models/proviceCity");
const convertCode = require("../slug");

const postNewDistrict = async (req, res) => {
  const { proviceCity, name } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const code = convertCode(name);
    const foundedProviceCity = await ProviceCity.findOne({
      _id: proviceCity,
      status: true,
    }).session(session);
    if (!foundedProviceCity)
      return res.status(401).send({ message: "Tỉnh/Thành phố không tồn tại." });
    const foundedDistrict = await District.findOne({
        code
    });
    let result = [];
    if (foundedDistrict){
      if(foundedDistrict.status) return res.status(401).send({ message: "Quận huyện đã tồn tại." });
      foundedDistrict.status = true;
      const foundedPlace = await Place.findOne({idPrivate:foundedDistrict._id});
      foundedPlace.status = true;
      await foundedPlace.save();
      result = await foundedDistrict.save();
    }else{
        result = await District.create(
            [
              {
                proviceCity,
                name,
                code,
              },
            ],
            {
              session: session,
            }
          );
          await Place.create([
            {
              type:"district",
              idPrivate:result[0]._id,
              name:result[0].name,
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

module.exports = { postNewDistrict };
