const jwt = require("../utills/jwt");
const bcrypt = require("../utills/bcrypt");
const db = require("../models");
const User = db.user;
const Invite = db.invite;
const Details = db.user_Details;
// eslint-disable-next-line no-unused-vars
const fs = require("fs");
// eslint-disable-next-line no-unused-vars
const path = require("path");
const { toDataURL } = require("qrcode");
const speakeasy = require("speakeasy");
const exifremove = require("exifremove");
const { StatusCodes } = require("http-status-codes");
const UnauthorizedError = require("../errors/unauthorized");
const UnauthenticatedError = require("../errors/unauthenticated");
const BadRequestError = require("../errors/badRequestError");
const { decode } = require("jsonwebtoken");
const bucket = require("../utills/s3bucket");
const CustomAPIError = require("../errors/custom-error");
//const { Op } = require("sequelize");
const moment = require("moment");
const Password = db.user_password;
const TooManyRequestException = require("../errors/tooManyRequestError");
const client = require("../utills/redis");
// eslint-disable-next-line no-unused-vars
const { log } = require("console");
const maxNumberOfFailedLogins = 5;
const timeWindowForFailedLogins = 60 * 60 * 1;

//user registration
const Register = async (req, res) => {
    const token = req.params.token;
    //verify token
    await jwt.verifyToken(token);
    //decod token
    // eslint-disable-next-line no-var
    var decoded = decode(token);
    //const { email } =decoded.email;

    const inviteUser = await Invite.findOne({
        where: { email: decoded.email },
    });

    if (!inviteUser) {
        throw new UnauthenticatedError("User not found");
    }
    if (inviteUser.action !== true) {
        throw new UnauthorizedError("cannot access");
    }
    if (inviteUser.status === "completed") {
        throw new BadRequestError("User already registered");
    }
    req.body.password = await bcrypt.hashPassword(req.body.password);
    //image upload
    if (req.files) {
        const userImage = req.files.image;
        const key = decoded.email.substring(0, decoded.email.lastIndexOf("@"));
        if (!userImage.mimetype.endsWith("jpeg")) {
            throw new BadRequestError("Please Upload jpeg Image");
        }
        const maxSize = 1024 * 1024;
        if (userImage.size > maxSize) {
            throw new BadRequestError("Please upload image smaller 1MB");
        }
        await bucket.upload(userImage, key);
        req.body.image = key;
    }

    const userdata = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        image: req.body.image,
        passwordExpiry: moment().add(5, "days").format(),
    });
    await db.twofactorAuthentication.create({ user_id: userdata.id });
    await Password.create({
        password: req.body.password,
        createdBy: userdata.fullName,
        userId: userdata.id,
    });

    //updated registerdetails
    await Details.update(
        {
            registeredAt: userdata.createdAt,
            registerStatus: "completed",
            registerId: userdata.id,
        },
        { where: { email: decoded.email } }
    );
    await Invite.update(
        { status: "completed" },
        { where: { email: decoded.email } }
    );

    res.status(StatusCodes.OK).json({
        email: userdata.email,
        firstName: userdata.firstName,
        lastName: userdata.lastName,
        image: userdata.image,
        message: "registered successfully",
    });
};
//update user details
const update = async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) {
        throw new CustomAPIError("no user with this id");
    }
    if (req.files) {
        const userImage = req.files.image;
        const key = user.email.substring(0, user.email.lastIndexOf("@"));
        if (!userImage.mimetype.endsWith("jpeg")) {
            throw new BadRequestError("Please Upload jpeg Image");
        }
        const maxSize = 1024 * 1024;
        if (userImage.size > maxSize) {
            throw new BadRequestError("Please upload image smaller 1MB");
        }

        const startPortion =
            userImage.data[0].toString(16) +
            userImage.data[1].toString(16) +
            userImage.data[2].toString(16);
        console.log(
            userImage.data,
            userImage.data[0],
            userImage.data[0].toString(16),
            startPortion
        );
        if (startPortion !== "ffd8ff") {
            throw new BadRequestError(" file is not a JPEG image.");
        }

        console.log(userImage);
        // const file_read = fs.readFileSync(userImage);
        const remove_exif = exifremove.remove(userImage.data);
        userImage.data = remove_exif;
        console.log(userImage);
        // const new_image = fs.writeFileSync(`${userImage.name}`, remove_exif);
        await bucket.upload(userImage, key);

        req.body.image = key;
    }
    //to update the user details
    await User.update(
        {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            image: req.body.image,
        },
        { where: { id: req.params.id } }
    );
    const userUpdate = await User.findByPk(req.params.id);
    res.status(StatusCodes.CREATED).json({
        message: "updated successfully",
        updated_user: {
            email: userUpdate.email,
            firstName: userUpdate.firstName,
            lastName: userUpdate.lastName,
            image: userUpdate.image,
        },
    });
};
//user login
const login = async (req, res) => {
    const { email, password } = req.body;
    //check user is not attempted too many login requests
    let attempts = await client.get(email);
    console.log(attempts);
    if (attempts > maxNumberOfFailedLogins) {
        throw new TooManyRequestException(
            "Too Many Attempts try it one hour later"
        );
    }

    if (!email || !password) {
        throw new BadRequestError("Please provide email and password");
    }
    const user = await User.findOne({ where: { email: email } });
    console.log(user.email);
    const invite = await Invite.findOne({ where: { email: email } });

    if (!user) {
        client.set(email, ++attempts, "ex", timeWindowForFailedLogins);
        throw new BadRequestError("Invalid Credentials");
    }
    //checking user action
    if (invite.action === false) {
        client.set(email, ++attempts, "ex", timeWindowForFailedLogins);
        throw new UnauthorizedError(
            "cannot access,user is restricted to log in "
        );
    }
    //checking if password expired
    if (
        moment(user.passwordExpiry).format("YYYY-MM-DD") ===
        moment().format("YYYY-MM-DD")
    ) {
        client.set(email, ++attempts, "ex", timeWindowForFailedLogins);
        throw new BadRequestError("password expired");
    }
    const user_passwords = await Password.findAll({
        where: { userId: user.id },
        order: [["createdAt", "DESC"]],
    });
    //password verify
    const passwords = user_passwords.map((pass) => pass.password);

    const passwordMatch = await bcrypt.verifyPassword(password, passwords[0]);
    if (!passwordMatch) {
        client.set(email, ++attempts, "ex", timeWindowForFailedLogins);
        throw new BadRequestError("password not match");
    }
    //succesfull login
    await client.del(email);
    const accessToken = jwt.generateAccessToken(req.body.email, user.id);
    //reset url
    const resetlink = `${req.protocol}://${req.get(
        "host"
    )}/api/v1/user/resetpassword/${accessToken}`;
    const authenticate = await db.twofactorAuthentication.findOne({
        user_id: user.id,
    });
    console.log(authenticate.user_id);
    console.log(authenticate.otp_enabled);
    if (authenticate.otp_enabled === false) {
        res.status(StatusCodes.OK).json({
            user: {
                name: user.name,
                userId: user.id,
                accessToken,
                resetlink,
                loginedAt: new Date(),
            },
        });
    } else {
        res.status(StatusCodes.OK).json({
            status: "two_factor_required",
            message:
                "Please provide a 2-factor authentication code to complete the login process.",
        });
    }
};
//password change
const resetPassword = async (req, res) => {
    const token = req.params.token;
    //verify token
    await jwt.verifyToken(token);

    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
        throw new UnauthenticatedError("User not found");
    }

    const user_passwords = await Password.findAll({
        where: { userId: user.id },
        order: [["createdAt", "DESC"]],
    });

    const passwords = user_passwords.map((pass) => pass.password);

    const passwordMatch = await bcrypt.verifyPassword(password, passwords[0]);
    if (!passwordMatch) {
        throw new BadRequestError("password not match");
    }
    const newPassword = await bcrypt.hashPassword(req.body.newPassword);
    const passwordMatchone = await bcrypt.verifyPassword(
        req.body.newPassword,
        passwords[0]
    );
    const passwordMatchtwo = await bcrypt.verifyPassword(
        req.body.newPassword,
        passwords[1]
    );
    const passwordMatchthree = await bcrypt.verifyPassword(
        req.body.newPassword,
        passwords[2]
    );

    if (!passwordMatchone && !passwordMatchtwo && !passwordMatchthree) {
        await Password.create({
            password: newPassword,
            createdBy: user.fullName,
            userId: user.id,
        });
        await User.update(
            { passwordExpiry: moment().add(5, "days").format() },
            { where: { email: user.email } }
        );
    } else {
        throw new BadRequestError("new password cannot be previous password");
    }

    res.status(StatusCodes.CREATED).json({
        message: "password reset successful",
    });
};

//Generate OTP

const GenerateOTP = async (req, res) => {
    const user = await db.twofactorAuthentication.findOne({
        user_id: req.params.id,
    });
    console.log(user);
    if (!user) {
        throw new CustomAPIError("no user with this id");
    }

    const { ascii, hex, base32, otpauth_url } = speakeasy.generateSecret({
        issuer: "admin",
        name: "surya admin",
        length: 15,
    });
    const qrcode = await toDataURL(otpauth_url);
    await db.twofactorAuthentication.update(
        {
            otp_ascii: ascii,
            otp_auth_url: otpauth_url,
            otp_base32: base32,
            otp_hex: hex,
        },
        { where: { user_id: req.params.id } }
    ),
        //   res.status(StatusCodes.OK).json({
        //     base32,
        //     otpauth_url,
        //   });
        res.send(`<img src="${qrcode}" />`);
};

//verify otp
const VerifyOTP = async (req, res) => {
    const authentication = await db.twofactorAuthentication.findOne({
        where: { user_id: req.params.id },
    });
    if (!authentication) {
        throw new CustomAPIError("Token is invalid or user doesn't exist");
    }
    const verified = speakeasy.totp.verify({
        secret: authentication.otp_base32,
        encoding: "base32",

        token: req.body.token,
    });
    if (!verified) {
        throw new BadRequestError("Token is invalid or user doesn't exist");
    }
    await db.twofactorAuthentication.update(
        {
            otp_verified: true,
            otp_enabled: true,
        },
        { where: { user_id: req.params.id } }
    );
    // res.status(StatusCodes.OK).json({"message":"two factor auth enabled"});
    //   const details=await User.findOne({where: { id: req.params.id }});
    //   res.status(StatusCodes.OK).json({
    //     otp_verified: details.otp_verified,
    //     otp_enabled: details.otp_enabled,
    //   });
    const secrets = [];
    for (let i = 0; i < 10; i++) {
        const secret = speakeasy.generateSecret({
            length: 10,
            symbols: false,
        }).base32;
        secrets.push(secret);
    }

    // Format the secrets as recovery codes with a hyphen delimiter
    const recoveryCodes = secrets.map((secret) => {
        return secret.slice(0, 5) + "-" + secret.slice(5, 10);
    });

    console.log(recoveryCodes);

    const updateRecovery = await db.twofactorAuthentication.update(
        { recoverycode: recoveryCodes },
        { where: { user_id: req.params.id } }
    );
    console.log(updateRecovery);
    console.log(authentication.recoverycode);

    // eslint-disable-next-line no-var
    // Set headers to force download of the file
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=recovery-codes.txt"
    );
    res.setHeader("Content-Type", "text/plain");

    // Create a readable stream from the recovery codes array
    const readable = require("stream").Readable.from(recoveryCodes.join("\n"));
    res.write("Download your recovery codes:\n\n");
    // Pipe the readable stream to the response stream
    readable.pipe(res);
};

//validate otp
const ValidateOTP = async (req, res) => {
    const authentication = await db.twofactorAuthentication.findOne({
        where: { user_id: req.params.id },
    });
    if (!authentication) {
        throw new CustomAPIError("Token is invalid or user doesn't exist");
    }
    if (authentication.otp_enabled !== true) {
        throw new BadRequestError("Two factor authentication is not enabled");
    }
    const validToken = speakeasy.totp.verify({
        secret: authentication.otp_base32,
        encoding: "base32",
        token: req.body.token,
        window: 1,
    });
    if (!validToken) {
        throw new BadRequestError("Token is invalid or user doesn't exist");
    }
    const user = await User.findOne({ id: req.params.id });
    const accessToken = jwt.generateAccessToken(user.email, user.id);
    res.status(StatusCodes.OK).json({
        message: "otp validated successfully",
        token: accessToken,
    });
    //   res.status(StatusCodes.OK).json({
    //     otp_valid: true,
};

//  Disable OTP
const DisableOTP = async (req, res) => {
    const user = await db.twofactorAuthentication.findOne({
        where: { user_id: req.params.id },
    });
    if (!user) {
        throw new CustomAPIError("no user with this id");
    }

    await db.twofactorAuthentication.update(
        { otp_enabled: false },
        { where: { user_id: req.params.id } }
    );
    res.status(StatusCodes.OK).json({
        message: "twofactor authentication disabled",
    });
};

//recoverycode verify
const recovery_verify = async (req, res) => {
    const authentication = await db.twofactorAuthentication.findOne({
        where: { user_id: req.params.id },
    });
    if (!authentication) {
        throw new CustomAPIError("Token is invalid or user doesn't exist");
    }
    if (authentication.otp_enabled !== true) {
        throw new BadRequestError("2fa is not enabled");
    }

    const token = req.body.token;
    console.log(authentication);
    const recovery_code = authentication.recoverycode;
    console.log(recovery_code);
    if (recovery_code.includes(token)) {
        const index = recovery_code.indexOf(token);
        recovery_code.splice(index, 1);
        // recovery_code.(req.body.token);
        await db.twofactorAuthentication.update(
            { recoverycode: recovery_code },
            { where: { user_id: req.params.id } }
        );
        const user = await User.findOne({ id: req.params.id });
        const accessToken = jwt.generateAccessToken(user.email, user.id);
        res.status(StatusCodes.OK).json({
            message: "recoverycode verified successfull",
            token: accessToken,
        });
    } else {
        throw new BadRequestError("recovery code is wrong or already used");
    }
};

module.exports = {
    Register,
    update,
    login,
    resetPassword,
    GenerateOTP,
    VerifyOTP,
    ValidateOTP,
    DisableOTP,
    recovery_verify,
};
