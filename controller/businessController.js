const { StatusCodes } = require("http-status-codes");
const db = require("../models");
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
const UserAssociationType = db.Userassociation;
const UserAssociation = db.UserAssociation;
const License = db.License;
const Phone = db.Phone;
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
    const data = await UserAssociationType.findAll({
        attributes: ["bp_user_association_id", "name"],
    });
    res.status(StatusCodes.OK).json(data);
};

//register cannabiss business
const registerCannabis = async (req, res) => {
    const user = await User.findOne({ where: { email: req.user.email } });

    const state = await Region.findOne({
        where: { name: req.body.basic_details.state_of_incorporation },
    });
    const basicDetails = await Business.create({
        name: req.body.basic_details.name,
        dba: req.body.basic_details.dba,
        fedtaxid: req.body.basic_details.fedtaxid,
        createdby: user.fullName,
        updatedby: user.fullName,
        is_createdby_stdc: "Y",
        state_id: state.id,
    });
    const license = await LicenseType.findOne({
        where: {
            name: req.body.cannabis_related_details.cannabis_business_type,
        },
    });
    const licenseType = await LicenseTypedesign.findOne({
        where: {
            name: req.body.cannabis_related_details.cannabis_license_category,
        },
    });
    const country = await Country.findOne({
        where: {
            name: req.body.cannabis_related_details.cannabis_licensed_country,
        },
    });
    const license_state = await Region.findOne({
        where: {
            name: req.body.cannabis_related_details.cannabis_licensed_state,
        },
    });
    const cannabis_details = await License.create({
        is_active: "Y",
        createdBy: basicDetails.createdby,
        updatedBy: basicDetails.updatedby,
        business_id: basicDetails.business_id,
        license_no: req.body.cannabis_related_details.license_number,
        license_type_id: license.id,
        license_type: req.body.cannabis_related_details.cannabis_business_type,
        cannabis_license_id: licenseType.id,
        country_id: country.id,
        license_state_region_id: license_state.id,
    });

    const zipcode = await Zipcode.findOne({
        where: { zipcode: req.body.contact_details.legal_address.zipcode },
    });

    const address1 = `${basicDetails.name},${req.body.contact_details.legal_address.street_no} ${req.body.contact_details.legal_address.street_name},${zipcode.city},${zipcode.county},${zipcode.zipcode}`;
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
    await Phone.create({
        is_active: "Y",
        createdBy: user.fullName,
        updatedBy: user.fullName,
        phone: req.body.contact_details.legal_address.phone_number,
        phone_type_id: phone_type.id,
        business_id: basicDetails.business_id,
    });
    if (
        req.body.contact_details.business_location
            .isBusinessLocationSameAsLegalAddress === "Y"
    ) {
        await Address.update(
            {
                address2: addressDetails.address1,
            },
            {
                where: { address_id: addressDetails.address_id },
            }
        );
    } else {
        const zipcodeData = await Zipcode.findOne({
            where: {
                zipcode: req.body.contact_details.business_location.zipcode,
            },
        });
        const address_ = `${basicDetails.name},${
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

    //keyregistration
    const user_association = await UserAssociationType.findOne({
        where: { name: "Controlling Managers & Operators" },
    });

    await UserAssociation.create({
        is_active: "Y",
        createdBy: user.fullName,
        updatedBy: user.fullName,
        name: user.fullName,
        email: user.email,
        description: "Controlling Managers & Operators",
        user_assoc_id: user_association.id,
        ownership_percent: 0,
        user_assoc_role: "Admin",
        UserId: user.id,
        business_id: basicDetails.business_id,
        is_contact_person: "Y",
    });
    if (req.body.key_person_registration.add_user === "Y") {
        const user_assoc = await UserAssociationType.findOne({
            where: { name: req.body.key_person_registration.user_type },
        });

        if (req.body.key_person_registration.user_type === "Beneficial owner") {
            await UserAssociation.create({
                is_active: "Y",
                createdBy: user.fullName,
                updatedBy: user.fullName,
                name: req.body.key_person_registration.name,
                email: req.body.key_person_registration.email,
                description: "Beneficial owner",
                ownership_percent:
                    req.body.key_person_registration.ownership_percentage,
                user_assoc_role: req.body.key_person_registration.access_type,
                UserId: user.id,
                business_id: basicDetails.business_id,
                user_assoc_id: user_assoc.id,
                is_contact_person:
                    req.body.key_person_registration.set_as_contact_person,
            });
        }

        if (
            req.body.key_person_registration.user_type ===
            "Controlling Managers & Operators"
        ) {
            await UserAssociation.create({
                is_active: "Y",
                createdBy: user.fullName,
                updatedBy: user.fullName,
                name: req.body.key_person_registration.name,
                email: req.body.key_person_registration.email,
                description: "Controlling Managers & Operators",
                ownership_percent: 0,
                user_assoc_role: req.body.key_person_registration.access_type,
                UserId: user.id,
                business_id: basicDetails.business_id,
                user_assoc_id: user_assoc.id,
                is_contact_person:
                    req.body.key_person_registration.set_as_contact_person,
            });
        }

        if (req.body.key_person_registration.user_type === "Investor") {
            // eslint-disable-next-line no-unused-vars
            const investorType = await InvestorType.findOne({
                where: { name: req.body.key_person_registration.investor_type },
            });
            await UserAssociation.create({
                is_active: "Y",
                createdBy: user.fullName,
                updatedBy: user.fullName,
                name: req.body.key_person_registration.name,
                email: req.body.key_person_registration.email,
                description: "Investor",
                ownership_percent: 0,
                user_assoc_role: req.body.key_person_registration.access_type,
                UserId: user.id,
                business_id: basicDetails.business_id,
                investor_type_id: investorType.id,
                user_assoc_id: user_assoc.id,
                is_contact_person:
                    req.body.key_person_registration.set_as_contact_person,
            });
        }
    }

    res.status(StatusCodes.CREATED).json({
        id: basicDetails.business_id,
        business_name: basicDetails.name,
        business_type: cannabis_details.license_type,
        address: addressDetails.address1,
    });
};

//register non-cannabiss business
const registernonCannabis = async (req, res) => {
    const user = await User.findOne({ where: { email: req.user.email } });

    const state = await Region.findOne({
        where: { name: req.body.basic_details.state_of_incorporation },
    });
    const basicDetails = await Business.create({
        name: req.body.basic_details.name,
        dba: req.body.basic_details.dba,
        fedtaxid: req.body.basic_details.fedtaxid,
        createdby: user.fullName,
        updatedby: user.fullName,
        is_cannabis_business: "N",
        is_createdby_stdc: "Y",
        state_id: state.id,
    });
    //contact details
    const zipcode = await Zipcode.findOne({
        where: { zipcode: req.body.contact_details.legal_address.zipcode },
    });

    const address1 = `${basicDetails.name},${req.body.contact_details.legal_address.street_no} ${req.body.contact_details.legal_address.street_name},${zipcode.city},${zipcode.county},${zipcode.zipcode}`;
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
    await Phone.create({
        is_active: "Y",
        createdBy: user.fullName,
        updatedBy: user.fullName,
        phone: req.body.contact_details.legal_address.phone_number,
        phone_type_id: phone_type.id,
        business_id: basicDetails.business_id,
    });
    if (
        req.body.contact_details.business_location
            .isBusinessLocationSameAsLegalAddress === "Y"
    ) {
        await Address.update(
            {
                address2: addressDetails.address1,
            },
            {
                where: { address_id: addressDetails.address_id },
            }
        );
    } else {
        const zipcodeData = await Zipcode.findOne({
            where: {
                zipcode: req.body.contact_details.business_location.zipcode,
            },
        });
        const address_ = `${basicDetails.name},${
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

    //keyregistration
    const user_association = await UserAssociationType.findOne({
        where: { name: "Controlling Managers & Operators" },
    });

    await UserAssociation.create({
        is_active: "Y",
        createdBy: user.fullName,
        updatedBy: user.fullName,
        name: user.fullName,
        email: user.email,
        description: "Controlling Managers & Operators",
        user_assoc_id: user_association.id,
        ownership_percent: 0,
        user_assoc_role: "Admin",
        UserId: user.id,
        business_id: basicDetails.business_id,
        is_contact_person: "Y",
    });
    if (req.body.key_person_registration.add_user === "Y") {
        const user_assoc = await UserAssociationType.findOne({
            where: { name: req.body.key_person_registration.user_type },
        });

        if (req.body.key_person_registration.user_type === "Beneficial owner") {
            await UserAssociation.create({
                is_active: "Y",
                createdBy: user.fullName,
                updatedBy: user.fullName,
                name: req.body.key_person_registration.name,
                email: req.body.key_person_registration.email,
                description: "Beneficial owner",
                ownership_percent:
                    req.body.key_person_registration.ownership_percentage,
                user_assoc_role: req.body.key_person_registration.access_type,
                UserId: user.id,
                business_id: basicDetails.business_id,
                user_assoc_id: user_assoc.id,
                is_contact_person:
                    req.body.key_person_registration.set_as_contact_person,
            });
        }

        if (
            req.body.key_person_registration.user_type ===
            "Controlling Managers & Operators"
        ) {
            await UserAssociation.create({
                is_active: "Y",
                createdBy: user.fullName,
                updatedBy: user.fullName,
                name: req.body.key_person_registration.name,
                email: req.body.key_person_registration.email,
                description: "Controlling Managers & Operators",
                ownership_percent: 0,
                user_assoc_role: req.body.key_person_registration.access_type,
                UserId: user.id,
                business_id: basicDetails.business_id,
                user_assoc_id: user_assoc.id,
                is_contact_person:
                    req.body.key_person_registration.set_as_contact_person,
            });
        }

        if (req.body.key_person_registration.user_type === "Investor") {
            // eslint-disable-next-line no-unused-vars
            const investorType = await InvestorType.findOne({
                where: { name: req.body.key_person_registration.investor_type },
            });
            await UserAssociation.create({
                is_active: "Y",
                createdBy: user.fullName,
                updatedBy: user.fullName,
                name: req.body.key_person_registration.name,
                email: req.body.key_person_registration.email,
                description: "Investor",
                ownership_percent: 0,
                user_assoc_role: req.body.key_person_registration.access_type,
                UserId: user.id,
                business_id: basicDetails.business_id,
                investor_type_id: investorType.id,
                user_assoc_id: user_assoc.id,
                is_contact_person:
                    req.body.key_person_registration.set_as_contact_person,
            });
        }
    }

    res.status(StatusCodes.CREATED).json({
        id: basicDetails.business_id,
        business_name: basicDetails.name,
        address: addressDetails.address1,
    });
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
    registernonCannabis,
};
