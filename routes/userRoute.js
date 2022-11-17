const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");

const { Register, update } = require("../controller/userController");
const validationMiddleware = require("../middleware/joi-validator");
router.use("/register/:token", fileUpload({ useTempFiles: false }));
router.post("/register/:token", validationMiddleware.userReg, Register);
router.use("/update/:id", fileUpload({ useTempFiles: false }));
router.patch("/update/:id", validationMiddleware.updateSchema, update);

module.exports = router;
