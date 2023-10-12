const express = require("express");
const router = express.Router();

//import controllers
const {signIn, signUp} = require("../Controllers/authController");


//create mapping

router.post("/", signIn);
router.post("/signup", signUp)



module.exports = router;