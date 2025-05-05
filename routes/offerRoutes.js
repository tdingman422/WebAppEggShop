const express = require('express');
const controller = require('../controllers/offerController');
const { upload } = require('../middleware/fileUpload');
const {isLoggedIn, isNotSeller, isSeller} = require('../middleware/auth');
const {validateOfferId, validateOffer, validateResult} = require('../middleware/validator');

const router = express.Router({mergeParams: true});

router.post("/new", isLoggedIn, isNotSeller, validateOffer, validateResult, controller.create);

router.get("/", isLoggedIn, isSeller, controller.show);

router.put("/:offerId", validateOfferId, isLoggedIn, isSeller, controller.accept);

module.exports = router;