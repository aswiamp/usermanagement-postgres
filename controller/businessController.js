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
const BadRequestError = require("../errors/badRequestError");
const { Op } = require("sequelize");
//const Stage_Status = db.Stage_Status;
const paginate = require("../utills/paginate");
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
const registerBusiness = async (req, res) => {
    const user = await User.findOne({ where: { email: req.user.email } });
    const state = await Region.findOne({
        where: { bt_region_id: req.body.basic_details.state_of_incorporation },
    });
    if (!state) {
        throw new BadRequestError("enter a valid id");
    }
    const basicDetails = await Business.create({
        name: req.body.basic_details.name,
        dba: req.body.basic_details.dba,
        fedtaxid: req.body.basic_details.fedtaxid,
        createdby: user.fullName,
        updatedby: user.fullName,
        is_createdby_stdc: "Y",
        is_cannabis_business: req.body.is_cannabis_business,
        state_id: state.id,
    });
    if (req.body.is_cannabis_business === "Y") {
        const license = await LicenseType.findOne({
            where: {
                bp_license_type_id:
                    req.body.cannabis_related_details.cannabis_business_type,
            },
        });
        if (!license) {
            throw new BadRequestError("enter a valid id");
        }
        const licenseType = await LicenseTypedesign.findOne({
            where: {
                bp_license_type_desig_id:
                    req.body.cannabis_related_details.cannabis_license_category,
            },
        });
        if (!licenseType) {
            throw new BadRequestError("enter a valid id");
        }
        const country = await Country.findOne({
            where: {
                bt_country_id:
                    req.body.cannabis_related_details.cannabis_licensed_country,
            },
        });
        if (!country) {
            throw new BadRequestError("enter a valid id");
        }
        const license_state = await Region.findOne({
            where: {
                bt_region_id:
                    req.body.cannabis_related_details.cannabis_licensed_state,
            },
        });
        if (!license_state) {
            throw new BadRequestError("enter a valid id");
        }
        await License.create({
            is_active: "Y",
            createdBy: basicDetails.createdby,
            updatedBy: basicDetails.updatedby,
            business_id: basicDetails.business_id,
            license_no: req.body.cannabis_related_details.license_number,
            license_type_id: license.id,
            license_type: license.name,
            cannabis_license_id: licenseType.id,
            country_id: country.id,
            license_state_region_id: license_state.id,
        });
    }
    const zipcode = await Zipcode.findOne({
        where: { zipcode: req.body.contact_details.legal_address.zipcode },
    });
    if (!zipcode) {
        throw new BadRequestError("enter a valid zipcode");
    }

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
        where: {
            bt_phone_type_id: req.body.contact_details.legal_address.phone_type,
        },
    });
    if (!phone_type) {
        throw new BadRequestError("enter a valid id");
    }

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
        if (!zipcode) {
            throw new BadRequestError("enter a valid id");
        }
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
        req.body.key_person_registration.user.map(async (data) => {
            const user_assoc = await UserAssociationType.findOne({
                where: { bp_user_association_id: data.user_type },
            });
            if (!user_assoc) {
                throw new BadRequestError("enter a valid id");
            }
            if (data.user_type === "7cf77242-181c-45a2-94a5-2728974e8805") {
                await UserAssociation.create({
                    is_active: "Y",
                    createdBy: user.fullName,
                    updatedBy: user.fullName,
                    name: data.name,
                    email: data.email,
                    description: "Beneficial owner",
                    ownership_percent: data.ownership_percentage,
                    user_assoc_role: data.access_type,
                    UserId: user.id,
                    business_id: basicDetails.business_id,
                    user_assoc_id: user_assoc.id,
                    is_contact_person: data.set_as_contact_person,
                });
            }

            if (data.user_type === "ca51143d-9486-478b-a1cd-8051d682b7e0") {
                await UserAssociation.create({
                    is_active: "Y",
                    createdBy: user.fullName,
                    updatedBy: user.fullName,
                    name: data.name,
                    email: data.email,
                    description: "Controlling Managers & Operators",
                    ownership_percent: 0,
                    user_assoc_role: data.access_type,
                    UserId: user.id,
                    business_id: basicDetails.business_id,
                    user_assoc_id: user_assoc.id,
                    is_contact_person: data.set_as_contact_person,
                });
            }

            if (data.user_type === "f63eda23-26fc-4594-b398-813c82f3e33b") {
                // eslint-disable-next-line no-unused-vars
                const investorType = await InvestorType.findOne({
                    where: { bp_investor_type_id: data.investor_type },
                });
                if (!investorType) {
                    throw new BadRequestError("enter a valid id");
                }
                await UserAssociation.create({
                    is_active: "Y",
                    createdBy: user.fullName,
                    updatedBy: user.fullName,
                    name: data.name,
                    email: data.email,
                    description: "Investor",
                    ownership_percent: 0,
                    user_assoc_role: data.access_type,
                    UserId: user.id,
                    business_id: basicDetails.business_id,
                    investor_type_id: investorType.id,
                    user_assoc_id: user_assoc.id,
                    is_contact_person: data.set_as_contact_person,
                });
            }
        });
    }
    await db.Stage_Status.create({
        createdBy: user.fullName,
        updatedBy: user.fullName,
        stage: "Membership",
        status: "pending",
        business_id: basicDetails.business_id,
    });

    res.status(StatusCodes.CREATED).json({
        id: basicDetails.business_id,
        business_name: basicDetails.name,
        address: addressDetails.address1,
    });
};

//get all business
const getAllBusiness = async (req, res) => {
    const { page, size, search, sortKey, sortOrder, filterby } = req.query;
    //searching
    // eslint-disable-next-line no-var
    var condition = search
        ? {
              [Op.or]: [
                  { dba: { [Op.like]: `%${search}%` } },
                  // eslint-disable-next-line no-undef
                  { name: { [Op.like]: `%${search}%` } },
              ],
          }
        : null;
    const { limit, offset } = paginate.getPagination(page, size);

    const business = await Business.findAndCountAll({
        attributes: [
            "business_id",
            "name",
            "dba",
            "createdAt",
            "is_approved",
            "is_approved_vendor",
            "is_cannabis_business",
            "is_createdby_stdc",
        ],

        where: condition,
        limit,
        offset,
        order: [[sortKey || "createdBy", sortOrder || "ASC"]],
        // eslint-disable-next-line no-dupe-keys
        attributes: [
            "business_id",
            "name",
            "dba",
            "createdAt",
            "is_approved",
            "is_approved_vendor",
            "is_cannabis_business",
            "is_createdby_stdc",
        ],
    });
    const response = paginate.getPagingData(business, page, limit);
    res.status(StatusCodes.OK).json(response);

    if (filterby === "Cannabis Business") {
        const business = await Business.findAndCountAll({
            attributes: [
                "business_id",
                "name",
                "dba",
                "createdAt",
                "is_approved",
                "is_approved_vendor",
                "is_cannabis_business",
                "is_createdby_stdc",
            ],
            where: condition,
            limit,
            offset,
            order: [[sortKey || "createdBy", sortOrder || "ASC"]],
            // eslint-disable-next-line no-dupe-keys
            attributes: [
                "business_id",
                "name",
                "dba",
                "createdAt",
                "is_approved",
                "is_approved_vendor",
                "is_cannabis_business",
                "is_createdby_stdc",
            ],
        });
        const response = paginate.getPagingData(business, page, limit);
        res.status(StatusCodes.OK).json(response);
    }
    if (filterby === "Non-Cannabis Business") {
        const business = await Business.findAndCountAll({
            attributes: [
                "business_id",
                "name",
                "dba",
                "bp_group_shortcode",
                "createdAt",
                "is_approved",
                "is_approved_vendor",
                "is_cannabis_business",
                "is_createdby_stdc",
            ],
            where: condition,
            limit,
            offset,
            order: [[sortKey || "createdBy", sortOrder || "ASC"]],
            // eslint-disable-next-line no-dupe-keys
            attributes: [
                "business_id",
                "name",
                "dba",
                "createdAt",
                "is_approved",
                "is_approved_vendor",
                "is_cannabis_business",
                "is_createdby_stdc",
            ],
        });
        const response = paginate.getPagingData(business, page, limit);
        res.status(StatusCodes.OK).json(response);
    }

    if (filterby === "Approved Vendor") {
        const business = await Business.findAndCountAll({
            attributes: [
                "business_id",
                "name",
                "dba",
                "bp_group_shortcode",
                "createdAt",
                "is_approved",
                "is_approved_vendor",
                "is_cannabis_business",
                "is_createdby_stdc",
            ],
            where: condition,
            limit,
            offset,
            order: [[sortKey || "createdBy", sortOrder || "ASC"]],
            // eslint-disable-next-line no-dupe-keys
            attributes: [
                "business_id",
                "name",
                "dba",
                "createdAt",
                "is_approved",
                "is_approved_vendor",
                "is_cannabis_business",
                "is_createdby_stdc",
            ],
        });
        const response = paginate.getPagingData(business, page, limit);
        res.status(StatusCodes.OK).json(response);
    }
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
    registerBusiness,
    getAllBusiness,
};
