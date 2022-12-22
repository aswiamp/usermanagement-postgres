const express = require("express");
const {
    getCountryList,
    getZipcodeList,
    getphoneTypeList,
    getlicenseTypeList,
    getregionTypeList,
    getinvestorTypeList,
    getentityTypeList,
    getuserassociationList,
    getlicenseTypedesignList,
} = require("../controller/businessController");
const router = express.Router();

router.get("/getallCountries", getCountryList);
router.get("/getallzipcode", getZipcodeList);
router.get("/getallphonetype", getphoneTypeList);
router.get("/getalllicensetype", getlicenseTypeList);
router.get("/getalllicensetypedesign", getlicenseTypedesignList);
router.get("/getallregion", getregionTypeList);
router.get("/getallinvestortype", getinvestorTypeList);
router.get("/getallentitytype", getentityTypeList);
router.get("/getalluserassociation", getuserassociationList);

module.exports = router;
