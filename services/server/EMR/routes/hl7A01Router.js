const express = require("express");
const router = express.Router();

const {
    handleA01Message,
} = require("../controllers/hl7A01Controller");

router.post('/', handleA01Message);

module.exports = router;
