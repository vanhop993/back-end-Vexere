const User = require("../models/user");
const sendEmail = require("../sendMail");
const randomstring = require("randomstring");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSignature = config.get("jwtSignature");
const url = require("url");
const fs = require("fs");

const postSignUp = async (req, res) => {
  const { name, username, password, email, gender, phone } = req.body;
  try {
    // validate
    if (!name || !username || !password || !email || !phone || !gender)
      return res
        .status(401)
        .send({ message: "Vui lòng điền đầy đủ thông tin!!" });
    if (password.length < 6)
      return res.status(401).send({ message: "Password có ít nhất 8 ký tự" });
    if (password.length > 16)
      return res
        .status(401)
        .send({ message: "Password có nhiều nhất 16 ký tự" });
    // kiểm tra xem tài khoản đã tồn tại hay chưa
    const foundedUser = await User.findOne().or([
      { username },
      { email, provider: "" },
    ]);
    if (foundedUser)
      return res.status(400).send({ message: "Tài khoản đã tồn tại." });
    const secretToken = randomstring.generate() + Date.now();
    const newUser = new User({
      name,
      username,
      password,
      email,
      gender,
      phone,
      role: "user",
      secretToken,
    });
    const result = await newUser.save();
    const contentMail = {
      html: `
            <p>Vui lòng click vào link bên dưới để kích hoạt tài khoản: ${username}</p>
            <a href='http://localhost:3000/verify?secretToken=${secretToken}'>http://localhost:3000/verify</a>
            `,
      subject: "Đăng ký tài khoản VexereCuoiKhoa",
    };
    await sendEmail(email, contentMail);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "You are not authorized" });
  }
};

const postVerifyAccount = async (req, res) => {
  const { secretToken } = req.query;
  try {
    const founderUser = await User.findOne({ secretToken });
    founderUser.verify = "active";
    founderUser.secretToken = "";
    founderUser.save();
    res.status(200).send({ message: "Active tài khoản thành công!!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "You are not authorized" });
  }
};

const postSignIn = async (req, res) => {
  const { username, password } = req.body;
  try {
    const foundedUser = await User.findOne({ username });
    if (!foundedUser)
      return res
        .status(401)
        .send({ message: "Tài khoản hoặc mật khẩu ko đúng!!" });
    if (foundedUser.verify === "notActive")
      return res.status(401).send({ message: "Vui lòng xác nhận email!!" });
    const isMatchPassword =await bcryptjs.compare(password, foundedUser.password);
    if (!isMatchPassword)
      return res
        .status(401)
        .send({ message: "Tài khoản hoặc mật khẩu ko đúng!!" });
    const token = await jwt.sign(
      {
        _id: foundedUser._id,
      },
      jwtSignature,
      { expiresIn: "15m" }
    );
    foundedUser.tokens.push(token);
    await foundedUser.save();
    res.send(token);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "You are not authorized" });
  }
};

const postLoginFacebookGoogle = async (req, res) => {
  try {
    const token = await jwt.sign({ _id: req.user._id }, jwtSignature, {
      expiresIn: "15m",
    });
    req.user.tokens.push(token);
    await req.user.save();
    res.status(200).send(token);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "You are not authorized" });
  }
};

const postLogout = async (req, res) => {
  try {
    const index = req.user.tokens.findIndex((token) => token === req.token);
    req.user.tokens.splice(index, 1);
    await req.user.save();
    res.status(200).send({ message: "Đăng xuất thành công!!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "You are not authorized" });
  }
};

const postForgetPassword = async (req, res) => {
  const { email } = req.query;
  try {
    const foundedUser = await User.findOne({ provider: "", email });
    if (!foundedUser)
      return res.status(401).send({ message: "Email ko tồn tại" });
    const secretToken = randomstring.generate() + Date.now();
    foundedUser.secretToken = secretToken;
    const contentEmai = {
      html: `<h3>Đây là mã reset mật khẩu của ban:</h3>
          <p>mã reset passworrd:${secretToken}</p>`,
      subject: "Reset mật khẩu VexereCuoiKhoa",
    };
    await foundedUser.save();
    await sendEmail(email, contentEmai);
    res.status(200).send({ message: "Vui lòng check email!!" });
  } catch (err) {
    res.status(500).send({ message: "You are not authorized" });
  }
};

const postResetPass = async (req, res) => {
  const { email, password, secretToken } = req.body;
  try {
    const foundedUser = await User.findOne({ provider: "", email });
    if (!foundedUser)
      return res.status(401).send({ message: "Email không tồn tại!!" });
    if (foundedUser.secretToken !== secretToken)
      return res.status(401).send({ message: "Mã xác nhận ko đúng!!" });
    foundedUser.password = password;
    foundedUser.secretToken = "";
    await foundedUser.save();
    res.status(200).send({ message: "Thay đổi password thành công!!!" });
  } catch (err) {
    res.status(500).send({ message: "You are not authorized" });
  }
};

const getProfile = async (req, res) => {
  try {
    req.user.avatar = config.url + req.user.avatar;
    const result = req.user.toJSON();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ message: "You are not authorized" });
  }
};

const putProfile = async (req, res) => {
  const { path } = req.file;
  const { name, email, phone, gender } = req.body;
  const { user } = req;
  try {
    if (req.file) {
      user.avatar = path;
    }
    user.name = name;
    user.email = email;
    user.phone = phone;
    user.gender = gender;
    const result = await user.save();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ message: "You are not authorized" });
  }
};

const putProfileAvatar = async (req, res) => {
  const { path } = req.file;
  const { user } = req;
  try {
    user.avatar = path;
    await user.save();
    res.status(200).send({ message: "upload avatar thành công!!" });
  } catch (err) {
    fs.unlinkSync(path);
    res.status(500).send({ message: "You are not authorized" });
  }
};

const checkAdmin = async (req,res) => {
  try{
    res.status(200).send({message:"You are admin"});
  }catch(err){
    res.status(500).send({ message: "You are not authorized" });
  }
}

module.exports = {
  postSignUp,
  postVerifyAccount,
  postSignIn,
  postLogout,
  postLoginFacebookGoogle,
  postForgetPassword,
  postResetPass,
  getProfile,
  putProfile,
  putProfileAvatar,
  checkAdmin
};
