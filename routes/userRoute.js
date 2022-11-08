const express = require("express");
const router = express.Router();

const { Register } = require("../controller/userController");
const validationMiddleware= require("../middleware/joi-validator");

router.post("/register/:token", validationMiddleware.userReg,Register);

module.exports = router;
