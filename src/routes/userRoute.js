const express = require('express');
const user = require('../controllers/userController')

const router = express.Router();

router.route('/').get(user.getUser);
router.route('/create').get(user.createUser);
router.route('/login').post(user.loginUser);

module.exports = router;