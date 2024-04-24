const express = require("express");
const router = express.Router();

const {
    handleA04Message,
} = require("../controllers/hl7A04Controller");

router.post('/', handleA04Message);

module.exports = router;
