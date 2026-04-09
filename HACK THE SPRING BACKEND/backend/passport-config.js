const localStrat = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function init(passport) {
  const authenticateUser = async (email, pwd, done) => {
    const user = getUserFromEmail(email);
    if (user == null) {
      return done(null, false, { messgae: "no user with that email" });
    }
    try {
      if (await bcrypt.compare(pwd, user.pwd)) {
        return done(null, user);
      } else {
        return done(null, false, { messgae: "no password" });
      }
    } catch (error) {
      return done(error);
    }
  };

  passport.use(new localStrat({ usernameField: "email" }), authenticateUser());
  passport.serializeUser((user, done) => {});
  passport.deserializeUser((id, done) => {});
}

module.exports = init;
