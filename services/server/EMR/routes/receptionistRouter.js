const express = require('express');
const router = express.Router();

const {
    createReceptionist,
} = require('../controllers/receptionistController');

router.route('/').post(createReceptionist);

module.exports = router;