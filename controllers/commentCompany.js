const mongoose = require("mongoose");
const CommentCompany = require("../models/commentCompany");
const Company = require("../models/company");

const postNewCommentCompany = async (req, res) => {
  const {company, rating, content } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundedCompany = await Company.findOne({
      _id: company,
      status: true,
    }).session(session);
    if (!foundedCompany)
      return res.status(401).send({ massage: "Công ty không tồn tại!!" });
    const result = await CommentCompany.create(
      [
        {
          user:req.user._id,
          company,
          rating,
          content,
        },
      ],
      { session: session }
    );
    foundedCompany.comment.push(result[0]._id);
    foundedCompany.totalPoint =
      (foundedCompany.totalPoint * (foundedCompany.comment.length - 1) +
        result[0].rating.totalPoint) /
      foundedCompany.comment.length;
    await foundedCompany.save();
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

module.exports = { postNewCommentCompany };
