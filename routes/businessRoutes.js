const express = require("express");
const {
    getCountryList,
    getZipcodeList,
    getphoneTypeList,
    getlicenseTypeList,
    getregionTypeList,
    getinvestorTypeList,
    getlicenseTypedesignList,
    registerCannabis,
} = require("../controller/businessController");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
router.use(authenticate);
router.get("/getalllicensetype", getlicenseTypedesignList);

router.get("/getallCountries", getCountryList);
router.get("/getallzipcode", getZipcodeList);
router.get("/getallphonetype", getphoneTypeList);
router.get("/getalllicensetype", getlicenseTypeList);
router.get("/getallregion", getregionTypeList);
router.get("/getallinvestortype", getinvestorTypeList);
router.post("/registercannabisbusiness", registerCannabis);
module.exports = router;
