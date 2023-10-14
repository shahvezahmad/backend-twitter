const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//sign in

const signIn = async (req, res) => {
  const userLogin = req.body;
  User.findOne({ username: userLogin.username }).then((dbUser) => {
    if (!dbUser) {
      return res.json({
        status: "error",
        error: "Invalid login",
      });
    }
    bcrypt.compare(userLogin.password, dbUser.password).then((isCorrect) => {
      if (isCorrect) {
        const payload = {
          id: dbUser._id,
          username: dbUser.username,
        };
        const token = jwt.sign(payload, "newSecretKey", { expiresIn: 86400 });
        return res.json({ status: "ok", user: token });
      } else {
        return res.json({ status: "error", user: false });
      }
    });
  });
}
  
const signUp = async (req, res) => {
  const user = req.body;
  const takenUsername = await User.findOne({ username: user.username });

  if (takenUsername) {
    return res.json({ status: "error", error: "username already taken" });
  } else {
    user.password = await bcrypt.hash(req.body.password, 10);

    const dbUser = new User({
      username: user.username.toLowerCase(),
      password: user.password,
      avatar: "initial-avatar.png",
    });

    dbUser.save();
    return res.json({ status: "ok" });
  }
};
  
module.exports = {
    signIn,
    signUp
}