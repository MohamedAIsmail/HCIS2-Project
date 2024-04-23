const express = require('express');

const { protect, allowedTo } = require('../controllers/authController');

const {
    registerAdmin,
    getAdmin,
    getAdmins,
    updateAdmin,
    deleteAdmin,
    deleteAll,
    updateAdminPassword,
} = require('../controllers/adminController');

const router = express.Router();

// router.use(protect);

// router.use(allowedTo('admin'));

router.route('/')
    .get(getAdmins)
    .post(registerAdmin)
    .delete(deleteAll)

router.route('/:id')
    .get(getAdmin)
    .put(updateAdmin)
    .delete(deleteAdmin)

router.put('/changePassword/:id', updateAdminPassword);

module.exports = router;