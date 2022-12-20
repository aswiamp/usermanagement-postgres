const express = require("express");
const {
    getCountryList,
    getZipcodeList,
    getphoneTypeList,
    getlicenseTypeList,
    getregionTypeList,
} = require("../controller/businessController");
const router = express.Router();

router.get("/getallCountries", getCountryList);
router.get("/getallzipcode", getZipcodeList);
router.get("/getallphonetype", getphoneTypeList);
router.get("/getalllicensetype", getlicenseTypeList);
router.get("/getallregion", getregionTypeList);
module.exports = router;
