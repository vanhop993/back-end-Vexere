const mongoose = require("mongoose");
const Company = require("../models/company");
const fs = require("fs");
const Trip = require("../models/trip");
const convertCode = require("../slug");
const Place = require("../models/place");
const Bus = require("../models/bus");
const IntroCompany = require("../models/introCompany");

const postNewCompany = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    for (let key in req.body) {
      req.body[key] = JSON.parse(req.body[key]);
    }
    let { name, addressOffice, hotline, routes } = req.body;
    const files = req.files;
    const code = convertCode(name);
    const foundedCompany = await Company.findOne({ code }).session(session);
    if (foundedCompany && foundedCompany.status === true) {
      files.forEach((file) => fs.unlinkSync(file.path));
      return res.status(401).send({ message: "Công ty đã tồn tại." });
    }
    let newCompany;
    if (!foundedCompany) {
      for (let route of routes) {
        const foundedRoute = await Place.find().or([{ idPrivate: route.from.id, status: true },{idPrivate: route.to.id, status: true}]);
        if (foundedRoute.length !== 2){
          files.forEach((file) => fs.unlinkSync(file.path));
          return res
            .status(401)
            .send({ massage: "Địa điểm không tồn tại!!" });
        }
      }
      const arrayImages = files.map((img) => img.path);
      newCompany = await Company.create([{
        name,
        addressOffice,
        hotline,
        code,
        images: arrayImages,
        routes,
      }],{session:session})[0];
    } else {
      foundedCompany.status = true;
      newCompany = foundedCompany;
    }
    const result = await newCompany.save();
    const foundedBusOfCompany = await Bus.find({company:foundedCompany._id});
    foundedBusOfCompany.forEach(async bus=>{
      bus.status = true;
      await bus.save();
    });
    await session.commitTransaction();
    session.endSession;
    res.status(200).send(result);
  } catch (err) {
    await session.abortTransaction();
    session.endSession;
    console.log(err);
    files.forEach((file) => fs.unlinkSync(file.path));
    res.status(500).send({ message: "You are not authorized" });
  }
};

const postNewCompanyIntro = async (req, res) => {
  const { company, title, intro } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundedText = await IntroCompany.findOne({company});
    if(foundedText) return res.status(401).send({ massage: "Bài giới thiệu về công ty đã tồn tại!!" });
    const foundedCompany = await Company.findOne({
      _id: company,
      status: true,
    }).session(session);
    if (!foundedCompany || !foundedCompany.status)
      return res.status(401).send({ massage: "Công ty không tồn tại!!" });
    const newText = await IntroCompany.create(
      [{
        company,
        title,
        content: intro,
      }],
      { session: session }
    );
    foundedCompany.introdution = newText[0]._id;
    await foundedCompany.save();
    await session.commitTransaction();
    session.endSession;
    res.status(200).send({message:"Lưu thành công!!"});
  } catch (err) {
    await session.abortTransaction();
    session.endSession;
    console.log(err);
    res.status(500).send({ message: "You are not authorized" });
  }
};

const getAllCompany = async (req, res) => {
  try {
    const foundedCompany = await Company.find({ status: true }).populate(
      "routes introdution ",
      "departureProvice arrivalProvice code title markdown convertHtml"
    ).populate({path:("comment"),select:"content rating",populate:{path:"user",select:"name username"}});
    res.status(200).send(foundedCompany);
  } catch (err) {
    res.status(500).send({ message: "You are not authorized" });
  }
};

const getCompany = async (req, res) => {
  const { code } = req.query;
  try {
    const foundedCompany = await Company.findOne({
      code,
      status: true,
    }).populate(
      "comment routes introdution",
      "content rating departureProvice arrivalProvice code title markdown convertHtml"
    ).populate({path:"comment",populate:{path:"user",select:"name username"}});
    if (!foundedCompany)
      return res.status(401).send({ message: "Công ty không tồn tại!!" });
    res.status(200).send(foundedCompany);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "You are not authorized" });
  }
};

const deleteCompany = async (req, res) => {
  const { id } = req.query;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundedCompany = await Company.findOne({ _id:id, status: true }).session(session);
    if (!foundedCompany)
      return res.status(401).send({ message: "Công ty không tồn tại!!" });
    const foundedTripOfCompany = await Trip.findOne({company:id,status:true});
    if(foundedTripOfCompany)
      return res.status(401).send({message:"Không thể xóa, công ty còn chuyến xe đang hoạt động!!"});
    foundedCompany.status = false;
    await foundedCompany.save();
    const foundedBusOfCompany = await Bus.find({company:id,status:true});
    foundedBusOfCompany.forEach(async bus=>{
      bus.status = false;
      await bus.save();
    });
    await session.commitTransaction();
    session.endSession;
    res.status(200).send({ message: "Xóa thông tin thành công!!!" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession;
    res.status(500).send({ message: "You are not authorized" });
  }
};

const putCompany = async (req, res) => {
  let { name, addressOffice, hotline, code } = req.body;
  hotline = JSON.parse(hotline);
  const { files } = req;
  addressOffice = JSON.parse(addressOffice);
  try {
    let foundedCompany = await Company.findOne({ code, status: true });
    if (!foundedCompany) {
      files.forEach((file) => fs.unlinkSync(file.path));
      return res.status(401).send({ message: "Công ty không tồn tại!!" });
    }
    files.forEach((img) => foundedCompany.images.push(img.path));
    foundedCompany.name = name;
    foundedCompany.addressOffice = addressOffice;
    foundedCompany.hotline = hotline;
    await foundedCompany.save();
    res.status(200).send({ message: "Update thông tin thành công!!" });
  } catch (err) {
    files.forEach((file) => fs.unlinkSync(file.path));
    res.status(500).send({ message: "You are not authorized" });
  }
};

module.exports = {
  postNewCompany,
  getAllCompany,
  getCompany,
  deleteCompany,
  putCompany,
  postNewCompanyIntro,
};
