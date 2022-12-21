const BadRequestError = require("../errors/badRequestError");
const { passwordStrength } = require("check-password-strength");
exports.passwordStrengthCheck = async (req, res, next) => {
    const password = req.body.password || req.body.newPassword;
    const result = passwordStrength(password);
    console.log(result);
    if (result.value !== "Strong") {
        throw new BadRequestError(
            "This is a Weak Password, Try another password."
        );
    }
    next();
};
