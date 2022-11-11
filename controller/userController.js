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
const bucket = require("../utills/s3bucket");

//user registration
const Register = async (req, res) => {
    const token = req.params.token;
        //verify token
        await jwt.verifyToken(token);
        //decod token
        const decoded=decode(token);
        const { email } =decoded.email;
        const inviteUser=await Invite.findOne({where:{email:decoded.email}});

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
    if(req.files) {
        const userImage = req.files.image;
        const key = decoded.email.substring(0,decoded.email. lastIndexOf('@'));
        if (!userImage.mimetype.endsWith("png")) {
            throw new BadRequestError("Please Upload png Image");
          }
          const maxSize = 1024 * 1024;
          if (userImage.size > maxSize) {
            throw new BadRequestError("Please upload image smaller 1MB");
          }
          await bucket.upload(userImage,key);
          req.body.image=key;
        }
    //if(req.body.email!==decoded.email){
        //throw new BadRequestError("please provide the correct email");
    //}
    const userdata = await User.create({firstName:req.body.firstName,lastName:req.body.lastName,address:req.body.address,email:req.body.email,phone:req.body.phone,password:req.body.password,image:req.body.image});
    await Invite.update({status:"completed"},
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
