const CustomAPIError = require("../errors/custom-error");
const joi = require("joi");

const userReg = (req, res, next) => {
    //create schema object
    const schema = joi.object({
        firstName: joi.string().regex(/^[A-Z]+$/).uppercase().required(),
        lastName:joi.string().regex(/^[A-Z]+$/).uppercase().required(),
        email: joi.string().required().email(),
        password: joi.string().required().min(4).max(25).alphanum(),
        phone:joi.string().length(10).regex(/^[0-9]{10}$/).required(),
        address: joi.object({
            city:joi.string().required(),
            state:joi.string().required(),
            country:joi.string().required()
        }).required()
    });
    //schema options
    const options = {
        abortEarly: false, //include all errors
    };
    //validate request body
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        throw new CustomAPIError(`validation error:${error.message}`);
    } else {
        req.body = value;
        next();
    }
};
const inviteSchema= (req, res, next) => {
    //create schema object
    const schema = joi.object({
        name:joi.string().required().min(2).max(30),
        email:joi.string().required().email(),
        
    });
    //schema options
    const options = {
        abortEarly: false, //include all errors
    };
    //validate request body
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        throw new CustomAPIError(`validation error:${error.message}`);
    } else {
        req.body = value;
        next();
    }
};
const paramsSchema = (req, res, next) => {
    //create schema object
    const schema = joi.object({
        id:joi.number().required().min(1).max(100),
    });
    //schema options
    const options = {
        abortEarly: false, //include all errors
    };
    //validate request body
    const { error, value } = schema.validate(req.params, options);
    if (error) {
        throw new CustomAPIError(`validation error:${error.message}`);
    } else {
        req.body = value;
        next();
    }
};
module.exports = {userReg,inviteSchema,paramsSchema};
