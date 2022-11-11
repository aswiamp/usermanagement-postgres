const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");

const { Register } = require("../controller/userController");
const validationMiddleware= require("../middleware/joi-validator");
router.use("/register/:token",fileUpload({useTempFiles:false}));
router.post("/register/:token", validationMiddleware.userReg,Register);

module.exports = router;
