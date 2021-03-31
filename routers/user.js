const express = require("express");
const {
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
  checkAdmin,
} = require("../controllers/user");
const router = express.Router();
const passport = require("passport");
const auth = require("../helpers/authorization");
require("../facebookStrategy");
require("../googleStratery");
router.use(passport.initialize());
router.use(passport.session());
const {upload} = require("../multer");

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

router.post("/signup", postSignUp);
router.get("/verify", postVerifyAccount);
router.post("/signin", postSignIn);
router.post("/facebook/signin",passport.authenticate("facebookToken", { session: false }),postLoginFacebookGoogle);
router.post('/auth/google/token', passport.authenticate('google', { session: false }),postLoginFacebookGoogle)
// router.get('/auth/google',passport.authenticate('google', { scope: ["profile","email"] }));
// router.get('/auth/google/callback',passport.authenticate('google' ,{ failureRedirect: '/login',session: false }),postLoginFacebookGoogle);
router.post("/logout", auth(), postLogout);
router.post("/forgetpassword",postForgetPassword);
router.post("/resetpassword",postResetPass);
router.get("/profile",auth(),getProfile);
router.put("/profile",auth(),upload.single("avatar"),putProfile);
router.put("/profile/avatar",auth(),upload.single("avatar"),putProfileAvatar);
router.post("/admin",auth(["admin"]),checkAdmin);

module.exports = router;
