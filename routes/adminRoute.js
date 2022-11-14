const express = require("express");
const router = express.Router();
const validationMiddleware = require("../middleware/joi-validator");
const {
    sendInvite,
    resendInvite,
    cancelUser,
    getUserList,
} = require("../controller/adminController");

router.post("/invite", validationMiddleware.inviteSchema, sendInvite);
router.get("/resend/:id", validationMiddleware.paramsSchema, resendInvite);
router.get("/cancel/:id", validationMiddleware.paramsSchema, cancelUser);
router.get("/userslist", validationMiddleware.querySchema, getUserList);
module.exports = router;
