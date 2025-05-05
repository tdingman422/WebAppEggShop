const express = require('express');
const controller = require('../controllers/eggController');
const { upload } = require('../middleware/fileUpload');
const {isLoggedIn, isSeller} = require('../middleware/auth');
const {validateId, validateEgg, validateResult} = require('../middleware/validator');
const offerRoutes = require('./offerRoutes');

const router = express.Router();

router.get("/", controller.index);

router.get("/new", isLoggedIn, controller.new);

router.get("/search", controller.search);

router.post("/", isLoggedIn, upload, validateEgg, validateResult, controller.create);

router.get("/:id", validateId, controller.show);

router.get("/:id/edit", validateId, isLoggedIn, isSeller, controller.edit);

router.put("/:id", validateId, isLoggedIn, isSeller, upload, validateEgg, validateResult, controller.update);

router.delete("/:id", validateId, isLoggedIn, isSeller, controller.delete);

router.use("/:id/offers", validateId, offerRoutes);

module.exports = router;