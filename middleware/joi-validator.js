const CustomAPIError = require("../errors/custom-error");
const joi = require("joi");

const userReg = (req, res, next) => {
    //create schema object
    const schema = joi.object({
        firstName: joi.string().required().min(2).max(25),
        lastName:joi.string().required().min(2).max(25),
        email: joi.string().required(),
        password: joi.string().required().min(4).max(25),
        phone: joi.number().required(),
        address: joi.string().min(10),
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
module.exports = userReg;
