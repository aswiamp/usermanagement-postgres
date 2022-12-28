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

const cannabisBusiness = (req, res, next) => {
    //create schema object
    const schema = joi.object({
        basic_details: {
            name: joi.string().min(3).max(30).trim().required(),
            dba: joi.string().min(3).max(30).trim().required(),
            fedtaxid: joi.number().required(),
            state_of_incorporation: joi
                .string()
                .valid(
                    "South Carolina",
                    "Wyoming",
                    "Illinois",
                    "California",
                    "Alabama",
                    "Alaska",
                    "Arizona",
                    "Arkansas",
                    "Colorado",
                    "Connecticut",
                    "Delaware",
                    "Georgia",
                    "Hawaii",
                    "Florida",
                    "American Samoa",
                    "District of Columbia",
                    "Federated States of Micronesia",
                    "Guam",
                    "Indiana",
                    "Iowa",
                    "Kentucky",
                    "Louisiana",
                    "Maine",
                    "Maryland",
                    "Massachusetts",
                    "Michigan",
                    "Minnesota",
                    "Mississippi",
                    "Missouri",
                    "Montana",
                    "New Mexico",
                    "New York",
                    "North Dakota",
                    "Ohio",
                    "Oklahoma",
                    "Oregon",
                    "Pennsylvania",
                    "Rhode Island",
                    "South Dakota",
                    "Tennessee",
                    "Utah",
                    "Vermont",
                    "Virginia",
                    "Washington",
                    "Idaho",
                    "Marshall Islands",
                    "Northern Mariana Islands",
                    "Kansas",
                    "Palau",
                    "Puerto Rico",
                    "Virgin Islands",
                    "Armed Forces - Americas",
                    "Armed Forces - Europe/Africa/Canada",
                    "Armed Forces - Pacific",
                    "Nebraska",
                    "North Carolina",
                    "West Virginia",
                    "Wisconsin",
                    "Nevada",
                    "New Hampshire",
                    "New Jersey",
                    "Texas",
                    "Alberta",
                    "British Columbia",
                    "Manitoba",
                    "New Brunswick",
                    "Newfoundland",
                    "Northwest Territories",
                    "Nova Scotia",
                    "Nunavut",
                    "Ontario",
                    "Prince Edward Island",
                    "Quebec",
                    "Saskatchewan",
                    "Yukon Territory"
                )
                .required(),
        },
        cannabis_related_details: {
            cannabis_business_type: joi
                .string()
                .valid(
                    "Retailer",
                    "Retailer Nonstorefront",
                    "Distributor",
                    "Distributor-Transport Only",
                    "Microbusiness",
                    "Event Organizer",
                    "Adult-Use Cannabis Cultivation License",
                    "Adult-Use Cannabis Cultivation Provisional License",
                    "Medicinal Cannabis Cultivation License",
                    "Medicinal Cannabis Cultivation Provisional License",
                    "Temporary Cannabis Cultivation License",
                    "Other",
                    "Adult and Medicinal",
                    "Adult Use",
                    "Medicinal",
                    "Testing Laboratory",
                    "Manufacturer",
                    "Cultivation",
                    "Vertically Integrated",
                    "Testing",
                    "Retail/Dispensary",
                    "Manufacturer/Processor",
                    "Owner/Investor",
                    "Wholesale/Distribution",
                    "Unknown",
                    "Delivery/Transporter",
                    "Research",
                    "Storage",
                    "Management Company",
                    "Social Use Club",
                    "Senior Manager",
                    "Corporate Officer"
                )
                .required(),
            cannabis_license_category: joi
                .string()
                .valid(
                    "Adult-Use",
                    "Medicinal",
                    "Adult-Use and Medicinal",
                    "Other",
                    "Vertically Integrated",
                    "Testing",
                    "Retail/Dispensary",
                    "Manufacturer/Processor",
                    "Cultivation",
                    "Delivery/Transporter",
                    "Wholesale/Distribution",
                    "Hemp",
                    "Owner/Investor",
                    "Illicit Establishment",
                    "CBD",
                    "Unknown",
                    "Caregiver",
                    "Event Organizer",
                    "Management Company",
                    "Social Use Club",
                    "Waste Disposal",
                    "Storage",
                    "Senior Manager",
                    "Both",
                    "Recreational",
                    "Medical",
                    "Medicalrr",
                    "Research"
                )
                .required(),
            license_number: joi.string().min(3).max(50).required(),
            cannabis_licensed_country: joi
                .string()
                .valid("United States of America")
                .required(),
            cannabis_licensed_state: joi.when("cannabis_licensed_country", {
                is: "United States of America",
                then: joi
                    .string()
                    .valid(
                        "South Carolina",
                        "Wyoming",
                        "Illinois",
                        "California",
                        "Alabama",
                        "Alaska",
                        "Arizona",
                        "Arkansas",
                        "Colorado",
                        "Connecticut",
                        "Delaware",
                        "Georgia",
                        "Hawaii",
                        "Florida",
                        "American Samoa",
                        "District of Columbia",
                        "Federated States of Micronesia",
                        "Guam",
                        "Indiana",
                        "Iowa",
                        "Kentucky",
                        "Louisiana",
                        "Maine",
                        "Maryland",
                        "Massachusetts",
                        "Michigan",
                        "Minnesota",
                        "Mississippi",
                        "Missouri",
                        "Montana",
                        "New Mexico",
                        "New York",
                        "North Dakota",
                        "Ohio",
                        "Oklahoma",
                        "Oregon",
                        "Pennsylvania",
                        "Rhode Island",
                        "South Dakota",
                        "Tennessee",
                        "Utah",
                        "Vermont",
                        "Virginia",
                        "Washington",
                        "Idaho",
                        "Marshall Islands",
                        "Northern Mariana Islands",
                        "Kansas",
                        "Palau",
                        "Puerto Rico",
                        "Virgin Islands",
                        "Armed Forces - Americas",
                        "Armed Forces - Europe/Africa/Canada",
                        "Armed Forces - Pacific",
                        "Nebraska",
                        "North Carolina",
                        "West Virginia",
                        "Wisconsin",
                        "Nevada",
                        "New Hampshire",
                        "New Jersey",
                        "Texas"
                    )
                    .required(),
            }),
        },
        contact_details: {
            legal_address: {
                zipcode: joi.string().trim().min(4).required(),
                street_no: joi.string().max(5).required(),
                street_name: joi
                    .string()
                    .trim()
                    .min(3)
                    .max(50)
                    .trim()
                    .required(),
                phone_number: joi.string().trim().max(12).trim().required(),
                phone_type: joi.string().required().valid("Mobile", "Landline"),
            },
            business_location: {
                isBusinessLocationSameAsLegalAddress: joi
                    .string()
                    .valid("Y", "N")
                    .required(),
                zipcode: joi.when("isBusinessLocationSameAsLegalAddress", {
                    is: "N",
                    then: joi.string().trim().max(8).required(),
                }),
                street_no: joi.when("isBusinessLocationSameAsLegalAddress", {
                    is: "N",
                    then: joi.string().max(5).required(),
                }),
                street_name: joi.when("isBusinessLocationSameAsLegalAddress", {
                    is: "N",
                    then: joi.string().trim().min(3).max(50).trim().required(),
                }),
            },
        },
        key_person_registration: {
            add_user: joi.string().valid("Y", "N").required(),
            user_type: joi.when("add_user", {
                is: "Y",
                then: joi
                    .string()
                    .valid(
                        "Beneficial owner",
                        "Investor",
                        "Controlling Managers & Operators"
                    )
                    .required(),
            }),
            name: joi.when("add_user", {
                is: "Y",
                then: joi.string().trim().min(3).max(50).trim().required(),
            }),
            email: joi.when("add_user", {
                is: "Y",
                then: joi.string().trim().email().required(),
            }),
            ownership_percentage: joi.when("user_type", {
                is: "Beneficial owner",
                then: joi.number().min(20).max(100).required(),
            }),
            investor_type: joi.when("user_type", {
                is: "Investor",
                then: joi
                    .string()
                    .valid(
                        "Angel/Individual",
                        "Fund",
                        "Friends and Family",
                        "Venture Capital/Institutional"
                    )
                    .required(),
            }),
            access_type: joi.when("add_user", {
                is: "Y",
                then: joi
                    .string()
                    .valid("Admin", "Advanced", "Limited", "No access")
                    .required(),
            }),
            set_as_contact_person: joi.when("add_user", {
                is: "Y",
                then: joi.string().valid("Y", "N").required(),
            }),
        },
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
    cannabisBusiness,
};
