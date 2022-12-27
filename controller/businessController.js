const { StatusCodes } = require("http-status-codes");
const db = require("../models");
const bp_user_association = require("../models/bp_user_association");
//const address = require("../models/address");
const User = db.user;
const Business = db.Business;
const Country = db.Country;
const Zipcode = db.Zipcode;
const PhoneType = db.Phonetype;
const LicenseType = db.Licensetype;
const LicenseTypedesign = db.Licensetypedesign;
const Region = db.Region;
const InvestorType = db.Investortype;
const EntityType = db.Entitytype;
const Address = db.Address;
const UserAssociation = db.UserAssociation;
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

//register cannabiss business
const registerCannabis = async (req, res) => {
    const user = await User.findOne({ where: { email: req.user.email } });
    const basicDetailsdata = {
        name: req.body.basic_details.name,
        dba: req.body.basic_details.dba,
        fedtaxid: req.body.basic_details.fedtaxid,
        createdBy: user.fullName,
        updatedBy: user.fullName,
        is_createdby_stdc: "Y",
    };
    const basicDetails = await Business.create(basicDetailsdata);
    const license = await LicenseType.findOne({
        where: { name: req.body.cannabis_related_details.license_type },
    });
    const license_state = await Region.findOne({
        where: { name: req.body.cannabis_related_details.licensed_state },
    });
    const license_data = {
        is_active: "Y",
        createdBy: basicDetailsdata.createdBy,
        updatedBy: basicDetailsdata.updatedBy,
        business_id: basicDetailsdata.business_id,
        license_no: req.body.cannabis_related_details.license_no,
        license_type_id: license.id,
        license_type: req.body.cannabis_related_details.license_type,
        license_state_region_id: license_state.id,
    };
    const cannabis_details = await db.Business_License.create(license_data);

    const zipcode = await Zipcode.findOne({
        where: { zipcode: req.body.contact_details.legal_address.zipcode },
    });

    const address1 = `${basicDetailsdata.name},${req.body.contact_details.legal_address.street_no} ${req.body.contact_details.legal_address.street_name},${zipcode.city},${zipcode.county},${zipcode.zipcode}`;
    const addressdata = {
        is_active: "Y",
        createdBy: user.fullName,
        updatedBy: user.fullName,
        zipcodes_id: zipcode.id,
        street_no: req.body.contact_details.legal_address.street_no,
        address1: address1,
    };
    const addressDetails = await Address.create(addressdata);

    const phone_type = await PhoneType.findOne({
        where: { name: req.body.contact_details.legal_address.phone_type },
    });
    await db.Business_Phone.create({
        is_active: "Y",
        createdBy: user.fullName,
        updatedBy: user.fullName,
        phone: req.body.contact_details.legal_address.phone_number,
        phone_type_id: phone_type.id,
        business_id: basicDetailsdata.business_id,
    });
    if (
        req.body.contact_details.business_location
            .isBusinessLocationSameAsLegalAddress === "N"
    ) {
        const zipcodeData = await Zipcode.findOne({
            where: {
                zipcode: req.body.contact_details.business_location.zipcode,
            },
        });
        const address_ = `${basicDetailsdata.name},${
            req.body.contact_details.business_location.street_no
        } ${
            req.body.contact_details.business_location.street_name
        },${await zipcodeData.city},${await zipcodeData.county},${await zipcodeData.zipcode}`;

        await Address.update(
            {
                address2: address_,
            },
            {
                where: { address_id: addressDetails.address_id },
            }
        );
    }
    await Address.update(
        {
            address2: addressDetails.address1,
        },
        {
            where: { address_id: addressDetails.address_id },
        }
    );

    await UserAssociation.create({
        is_active: "Y",
        createdBy: user.fullName,
        updatedBy: user.fullname,
        description: "Controlling Managers & Operators",
        ownership_percent: 0,
        user_assoc_role: "Admin",
        UserId: user.id,
        business_id: basicDetailsdata.business_id,
        is_contact_person: "Y",
    });

    if (req.body.key_person_registration.add_user === "Y") {
        const user_assoc = await UserAssociation.findOne({
            where: { name: req.body.key_person_registration.user_type },
        });

        if (req.body.key_person_registration.user_type === "Beneficial owner") {
            await db.Business_User_Assoc.create({
                is_active: "Y",
                createdBy: user.fullName,
                updatedBy: user.fullName,
                description: "Beneficial owner",
                ownership_percent:
                    req.body.key_person_registration.ownership_percentage,
                user_assoc_role: req.body.key_person_registration.access_type,
                UserId: user.id,
                business_id: basicDetailsdata.business_id,
                user_assoc_id: user_assoc.id,
                is_contact_person:
                    req.body.key_person_registration.set_as_contact_person,
            });
        }

        if (
            req.body.key_person_registration.user_type ===
            "Controlling Managers & Operators"
        ) {
            await db.Business_User_Assoc.create({
                is_active: "Y",
                createdBy: user.fullName,
                updatedBy: user.fullName,
                description: "Controlling Managers & Operators",
                ownership_percent: 0,
                user_assoc_role: req.body.key_person_registration.access_type,
                UserId: user.id,
                business_id: basicDetailsdata.business_id,
                user_assoc_id: user_assoc.id,
                is_contact_person:
                    req.body.key_person_registration.set_as_contact_person,
            });
        }

        if (req.body.key_person_registration.user_type === "Investor") {
            // eslint-disable-next-line no-unused-vars
            const investorType = await UserAssociation.findOne({
                where: { name: req.body.key_person_registration.investor_type },
            });
            await db.Business_User_Assoc.create({
                is_active: "Y",
                createdBy: user.fullName,
                updatedBy: user.fullName,
                description: "Investor",
                ownership_percent: 0,
                user_assoc_role: req.body.key_person_registration.access_type,
                UserId: user.id,
                business_id: basicDetailsdata.business_id,
                user_assoc_id: user_assoc.id,
                is_contact_person:
                    req.body.key_person_registration.set_as_contact_person,
            });
        }
    }

    res.status(StatusCodes.OK).json(basicDetails, cannabis_details);
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
    registerCannabis,
};
