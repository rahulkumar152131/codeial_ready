const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require("passport");

const forgotController = require("../controllers/forgot_controller");


router.get("/get-link-page", forgotController.getLinkPage);
router.get("/update-password-page", forgotController.getPasswordPage);


router.post( "/send-link", forgotController.sendLink);



router.post(`/set-password`, forgotController.setPassword);

module.exports = router;
