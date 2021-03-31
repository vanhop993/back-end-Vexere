const passport = require("passport");
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GoogleStrategy = require("passport-google-token").Strategy;
const User = require("../models/user");

//google login
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID:
        "628495028887-u19q9uhusaklnbnrrvs1r164p8lpabs3.apps.googleusercontent.com",
      clientSecret: "nzOpTIKE8JmJMtPFQsuq_OXA",
    },
    async (accessToken, refreshToken, profile, done) => {
      const name = profile.displayName;
      const email = profile._json.email;
      const avatar = profile._json.picture;
      const provider = profile.provider;
      const foundedUser = await User.findOne({ email, provider });
        let user = foundedUser;
        if (!foundedUser) {
          const newUser = new User({
            provider,
            name,
            email,
            gender:'',
            role: "user",
            avatar,
            verify: "active",
          });
          user = await newUser.save();
        }
       return done(null, user);
    }
  )
);