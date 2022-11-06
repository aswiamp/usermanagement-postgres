const jwt = require("../utills/jwt");
const bcrypt = require("../utills/bcrypt");
const db = require("../models");
const User = db.user;
const Invite = db.invite;
const { StatusCodes } = require("http-status-codes");
const UnauthorizedError = require("../errors/unauthorized");
const UnauthenticatedError = require("../errors/unauthenticated");
const BadRequestError = require("../errors/badRequestError");
const {decode} = require("jsonwebtoken");

//user registration
const Register = async (req, res) => {
    const token = req.params.token;
        //verify token
        await jwt.verifyToken(token);
        //decod token
        const decoded=decode(token);
       // const { email } =decoded.email;
        const inviteUser=await Invite.findOne({where:{email:decoded.email}});

    if (!inviteUser) {
        throw new UnauthenticatedError("User not found");
    }
    if (inviteUser.action !== true) {
        throw new UnauthorizedError("cannot access");
    }
    if (inviteUser.Status === "completed") {
        throw new BadRequestError("User already registered");
    }
    req.body.password = await bcrypt.hashPassword(req.body.password);
    const userdata = await User.create({firstName:req.body.firstName,lastName:req.body.lastName,address:req.body.address,email:decoded.email,phone:req.body.phone,password:req.body.password});
    await Invite.update({Status:"completed"},
    {where:{email:decoded.email}}
    );
    res.status(StatusCodes.OK).json({
        email: userdata.email,
        firstName: userdata.firstName,
        lastName: userdata.lastName,
        message: "registered successfully",
    });
};
module.exports = { Register };
