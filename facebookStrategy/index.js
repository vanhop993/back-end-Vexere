const User = require("../models/user");
const passportFacebookStratery = require("passport-facebook-token");
const passport = require("passport");

//facebook login
passport.use(
    "facebookToken",
    new passportFacebookStratery(
      {
        clientID: "422970552116996",
        clientSecret: "b1909f971e05e6677e684cecbad61e1b",
        callbackURL: "http://www.example.com/auth/google/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        const name = profile.displayName;
        const userEmail = profile.emails[0].value;
        const userAvartar = profile.photos[0].value;
        const gender = profile.gender;
        const provider = profile.provider;
        const foundedUser = await User.findOne({ email: userEmail, provider });
        let user = foundedUser;
        if (!foundedUser) {
          const newUser = new User({
            provider,
            name,
            email: userEmail,
            gender,
            role: "user",
            avatar: userAvartar,
            verify: "active",
          });
          user = await newUser.save();
        }
        done(null, user);
      }
    )
  );