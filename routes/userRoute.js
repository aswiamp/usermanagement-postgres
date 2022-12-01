const express = require("express");
const router = express.Router();

const {
    Register,
    update,
    login,
    resetPassword,
} = require("../controller/userController");
const validationMiddleware = require("../middleware/joi-validator");
router.post("/register/:token", validationMiddleware.userReg, Register);
router.patch("/update/:id", validationMiddleware.updateSchema, update);
router.post("/login", login);
router.post("/resetpassword/:token", resetPassword);

module.exports = router;
