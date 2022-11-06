const express = require("express");
const router = express.Router();

const {sendInvite,resendInvite,cancelUser}= require("../controller/adminController");

router.post("/invite", sendInvite);
router.get("/resend/:id", resendInvite);
router.get('/cancel/:id',cancelUser);

module.exports = router;