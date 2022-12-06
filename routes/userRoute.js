const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const {
    Register,
    update,
    login,
    resetPassword,
} = require("../controller/userController");
const { passwordStrengthCheck } = require("../middleware/passwordStrength");
const validationMiddleware = require("../middleware/joi-validator");
router.post(
    "/register/:token",
    validationMiddleware.userReg,
    passwordStrengthCheck,
    Register
);
router.patch("/update/:id", validationMiddleware.updateSchema, update);
router.use(
    "/login",
    rateLimit({
        //limit each ip to 5 request per window
        max: 5,
        //5 minutes
        windowsMS: 1000 * 60 * 5,
    })
);
router.post("/login", validationMiddleware.loginSchema, login);
router.post(
    "/resetpassword/:token",
    validationMiddleware.resetSchema,
    resetPassword
);

module.exports = router;
