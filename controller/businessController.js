const { StatusCodes } = require("http-status-codes");
const db = require("../models");
const bp_user_association = require("../models/bp_user_association");
const Country = db.Country;
const Zipcode = db.Zipcode;
const PhoneType = db.Phonetype;
const LicenseType = db.Licensetype;
const LicenseTypedesign = db.Licensetypedesign;
const Region = db.Region;
const InvestorType = db.Investortype;
const EntityType = db.Entitytype;
const getCountryList = async (req, res) => {
    const data = await Country.findAll({
        attributes: ["bt_country_id", "name", "short_name"],
    });
    res.status(StatusCodes.OK).json(data);
};

//get zipcodes
const getZipcodeList = async (req, res) => {
    const data = await Zipcode.findAll({
        attributes: ["bt_zipcodes_id", "zipcode", "city", "county"],
    });
    res.status(StatusCodes.OK).json(data);
};

//get phonetype
const getphoneTypeList = async (req, res) => {
    const data = await PhoneType.findAll({
        attributes: ["bt_phone_type_id", "name"],
    });
    res.status(StatusCodes.OK).json(data);
};

//get licensetype
const getlicenseTypeList = async (req, res) => {
    const data = await LicenseType.findAll({
        attributes: ["bp_license_type_id", "name"],
    });
    res.status(StatusCodes.OK).json(data);
};

//get regions
const getregionTypeList = async (req, res) => {
    const data = await Region.findAll({
        attributes: ["bt_region_id", "name"],
    });
    res.status(StatusCodes.OK).json(data);
};

//get investortype
const getinvestorTypeList = async (req, res) => {
    const data = await InvestorType.findAll({
        attributes: ["bp_investor_type_id", "name"],
    });
    res.status(StatusCodes.OK).json(data);
};
//get licensetype design
const getlicenseTypedesignList = async (req, res) => {
    const data = await LicenseTypedesign.findAll({
        attributes: ["bp_license_type_desig", "name"],
    });
    res.status(StatusCodes.OK).json(data);
};

//get entity type
const getentityTypeList = async (req, res) => {
    const data = await EntityType.findAll({
        attributes: ["bp_entity_type_id", "name"],
    });
    res.status(StatusCodes.OK).json(data);
};

//get userassociation
const getuserassociationList = async (req, res) => {
    const data = await bp_user_association.findAll({
        attributes: ["bp_user_association_id", "name"],
    });
    res.status(StatusCodes.OK).json(data);
};

module.exports = {
    getCountryList,
    getZipcodeList,
    getphoneTypeList,
    getlicenseTypeList,
    getregionTypeList,
    getinvestorTypeList,
    getlicenseTypedesignList,
    getentityTypeList,
    getuserassociationList,
};
