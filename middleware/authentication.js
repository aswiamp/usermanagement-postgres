const jwt = require("../utills/jwt");
const UnauthenticatedError = require("../errors/unauthenticated");

const auth = async (req, res, next) => {
    // check header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        throw new UnauthenticatedError("Authentication invalid");
    }

    const token = await authHeader.split(" ")[1];
    const payload = await jwt.verifyToken(token, process.env.JWT_SECRET);
    console.log(payload);
    if (!payload.username || !payload.password) {
        throw new UnauthenticatedError("Authentication invalid");
    }
    req.user = {
        username: payload.username,
        password: payload.password,
    };
    console.log(process.env.PASS);
    if (
        req.user.username !== process.env.USERNAME_ADMIN ||
        req.user.password !== process.env.PASSWORD_ADMIN
    ) {
        throw new UnauthenticatedError("user credentials not matched");
    }
    next();
};

module.exports = auth;
