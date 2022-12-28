const express = require("express");
const validationMiddleware = require("../middleware/joi-validator");
const {
    getCountryList,
    getZipcodeList,
    getphoneTypeList,
    getlicenseTypeList,
    getregionTypeList,
    getinvestorTypeList,
    getlicenseTypedesignList,
    registerCannabis,
    registernonCannabis,
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
router.post(
    "/registercannabisbusiness",
    validationMiddleware.cannabisBusiness,
    registerCannabis
);
router.post("/registercannabisbusiness", registernonCannabis);
module.exports = router;
