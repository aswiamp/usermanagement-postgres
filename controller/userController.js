const jwt = require("../utills/jwt");
const bcrypt = require("../utills/bcrypt");
const db = require("../models");
const User = db.user;
const Invite = db.invite;
const Details = db.userdetails;
const { StatusCodes } = require("http-status-codes");
const UnauthorizedError = require("../errors/unauthorized");
const UnauthenticatedError = require("../errors/unauthenticated");
const BadRequestError = require("../errors/badRequestError");
const {decode} = require("jsonwebtoken");
const bucket = require("../utills/s3bucket");
const CustomAPIError = require("../errors/custom-error");

//user registration
const Register = async (req, res) => {
    const token = req.params.token;
        //verify token
        await jwt.verifyToken(token);
        //decod token
        const decoded=decode(token);
        //const { email } =decoded.email;
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
    //image upload
    if(req.files) {
        const userImage = req.files.image;
        var key = decoded.email.substring(0,decoded.email. lastIndexOf('@'));
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
    
    const userdata = await User.create({firstName:req.body.firstName,lastName:req.body.lastName,address:req.body.address,email:req.body.email,phone:req.body.phone,password:req.body.password,image:req.body.image});
    
    //updated registerdetails
    await Details.update({registeredAt:userdata.createdAt,registerStatus:"completed"},{where:{email:decoded.email}});
    await Invite.update({status:"completed"},
    {where:{email:decoded.email}}
    );

    res.status(StatusCodes.OK).json({
        email: userdata.email,
        firstName: userdata.firstName,
        lastName: userdata.lastName,
        image:userdata.image,
        message: "registered successfully",
    });
};
//update user details
const update = async(req,res)=>
{
    
    const user = await User.findByPk( req.params.id);
    if (!user) {
        throw new CustomAPIError("no user with this id");
    }
    await User.update(req.body, { where: { id: req.params.id} });
    res.status(StatusCodes.CREATED).json({
        message: "updated successfully",
        updated_user: { email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            image:user.image,
            },
    });
};
module.exports = { Register,update };
