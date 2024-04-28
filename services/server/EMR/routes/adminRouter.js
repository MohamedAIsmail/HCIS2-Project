const express = require('express');
const router = express.Router();

const { protect, allowedTo } = require('../controllers/authController');

const {
    registerAdminValidator,
    getAdminValidator,
    updateAdminValidator,
    deleteAdminValidator,
    changeAdminPasswordValidator,
} = require('../utils/validators/adminValidator');

const {
    registerAdmin,
    getAdmin,
    getAdmins,
    updateAdmin,
    deleteAdmin,
    deleteAll,
    updateAdminPassword,
} = require('../controllers/adminController');

// router.use(protect);

// router.use(allowedTo('admin'));

router.route('/')
    .get(getAdmins)
    .post(registerAdminValidator, registerAdmin)
    .delete(deleteAll)

router.route('/:id')
    .get(getAdminValidator, getAdmin)
    .put(updateAdminValidator, updateAdmin)
    .delete(deleteAdminValidator, deleteAdmin)

router.put('/changePassword/:id', changeAdminPasswordValidator, updateAdminPassword);

module.exports = router;