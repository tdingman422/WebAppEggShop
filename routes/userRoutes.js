const express = require('express');
const controller = require('../controllers/userController');
const {isLoggedIn, isGuest} = require('../middleware/auth');
const { validateSignUp, validateResult, validateLogIn } = require('../middleware/validator');

const router = express.Router();

router.get("/login", isGuest, controller.loginPage);

router.get("/signup", isGuest, controller.signupPage);

router.get("/", isLoggedIn, controller.profile);

router.post("/", isGuest, validateSignUp, validateResult, controller.signup);

router.post("/login", isGuest, validateLogIn, validateResult, controller.login);

router.get("/logout", isLoggedIn, controller.logout);

module.exports = router;