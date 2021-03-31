const mongoose = require("mongoose");
const CommentStation = require("../models/commentStation");
const Station = require("../models/station");

const postNewCommentStation = async (req, res) => {
  const { station, rating, content } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundedStation = await Station.findOne({
      _id: station,
      status: true,
    }).session(session);
    if (!foundedStation)
      return res.status(401).send({ massage: "Bến xe không tồn tại!!" });
    const result = await CommentStation.create(
      [
        {
          user: req.user._id,
          station,
          rating,
          content,
        },
      ],
      {
        session: session,
      }
    );
    foundedStation.comment.push(result[0]._id);
    foundedStation.totalPoint =
      (foundedStation.totalPoint * (foundedStation.comment.length - 1) +
        result[0].rating.totalPoint) /
        foundedStation.comment.length;
    await foundedStation.save();
    await session.commitTransaction();
    session.endSession;
    res.status(200).send(result[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession;
    console.log(err);
    res.status(500).send({ massage: "You are not authorized" });
  }
};

module.exports = { postNewCommentStation };
