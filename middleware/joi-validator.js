const CustomAPIError = require("../errors/custom-error");
const joi = require("joi");

const userReg = (req, res, next) => {
    //create schema object
    const schema = joi.object({
        firstName: joi
            .string()
            .regex(/^[A-Z]+$/)
            .uppercase()
            .required(),
        lastName: joi
            .string()
            .regex(/^[A-Z]+$/)
            .uppercase()
            .required(),
        email: joi.string().required().email(),
        password: joi.string().required().min(4).max(25),
        phone: joi
            .string()
            .length(10)
            .regex(/^[0-9]{10}$/)
            .required(),
        image: joi.string(),
        address: joi.object({
            city: joi.string().required(),
            state: joi.string().required(),
            country: joi.string().required(),
        }),
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
const inviteSchema = (req, res, next) => {
    //create schema object
    const schema = joi.object({
        name: joi.string().required().min(2).max(30),
        email: joi.string().required().email(),
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
        id: joi.number().required().min(1).max(100),
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
const querySchema = (req, res, next) => {
    //create schema object
    const schema = joi.object({
        page: joi.number().min(0).max(100).default(0),
        size: joi.number().min(1).max(750).default(2),
        search: joi.string(),
        sortKey: joi.string().valid("firstName", "email", "lastName", "phone"),
        sortOrder: joi.string().valid("ASC", "DESC"),
    });
    //schema options
    const options = {
        abortEarly: false, //include all errors
    };
    //validate request body
    const { error, value } = schema.validate(req.query, options);
    if (error) {
        throw new CustomAPIError(`validation error:${error.message}`);
    } else {
        req.body = value;
        next();
    }
};
const updateSchema = (req, res, next) => {
    //create schema object
    const schema = joi.object({
        firstName: joi
            .string()
            .regex(/^[A-Z]+$/)
            .uppercase()
            .optional(),
        lastName: joi
            .string()
            .regex(/^[A-Z]+$/)
            .uppercase()
            .optional(),
        phone: joi
            .string()
            .length(10)
            .regex(/^[0-9]{10}$/)
            .optional(),
        image: joi.string(),
        address: joi.object({
            city: joi.string().required(),
            state: joi.string().required(),
            country: joi.string().required(),
        }),
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
const loginSchema = (req, res, next) => {
    //create schema object
    const schema = joi.object({
        email: joi.string().required().email(),
        password: joi.string().required().min(4).max(25),
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
//
const resetSchema = (req, res, next) => {
    //create schema object
    const schema = joi.object({
        email: joi.string().required().email(),
        password: joi.string().required().min(4).max(25).alphanum(),
        newPassword: joi.string().required().min(4).max(25).alphanum(),
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
module.exports = {
    userReg,
    inviteSchema,
    paramsSchema,
    querySchema,
    updateSchema,
    loginSchema,
    resetSchema,
};
