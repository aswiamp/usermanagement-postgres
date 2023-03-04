const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const rateLimit = require("express-rate-limit");

const {
    Register,
    update,
    login,
    resetPassword,
    GenerateOTP,
    VerifyOTP,
    ValidateOTP,
    DisableOTP,
    recovery_verify,
} = require("../controller/userController");
const { passwordStrengthCheck } = require("../middleware/passwordStrength");
const validationMiddleware = require("../middleware/joi-validator");
const limiter = rateLimit({
    max: 25,
    windowMs: 5 * 60 * 1000,
});
router.use(limiter);
router.post(
    "/register/:token",
    validationMiddleware.userReg,
    passwordStrengthCheck,
    Register
);
router.post("/login", validationMiddleware.loginSchema, login);
router.post("/otp/validate/:id", ValidateOTP);
router.use(authenticate);
router.post("/otp/generate/:id", GenerateOTP);
router.post("/otp/verify/:id", VerifyOTP);

router.post("/otp/disable/:id", DisableOTP);
router.post("/otp/recoververify/:id", recovery_verify);
router.patch("/update/:id", validationMiddleware.updateSchema, update);
router.post(
    "/resetpassword/:token",
    validationMiddleware.resetSchema,
    resetPassword
);

module.exports = router;
