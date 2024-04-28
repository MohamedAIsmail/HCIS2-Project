const express = require("express");
const router = express.Router();

const {
    adminLogout,
    login,
    forgetPassword,
    verifyPassResetCode,
    resetPassword,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyResetCode", verifyPassResetCode);
router.put("/resetPassword", resetPassword);
router.get("/adminLogout", adminLogout);

module.exports = router;
