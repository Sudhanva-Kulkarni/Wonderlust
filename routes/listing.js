const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware");

const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");

const listingControllers = require("../controllers/listing");

const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

router.route("/")
//all listings
.get(wrapAsync(listingControllers.index))
//create new listing
.post(isLoggedIn, upload.single("listings[image]"), validateListing, wrapAsync(listingControllers.createNewListing));

//get new listings form
router.get("/new",isLoggedIn,listingControllers.renderNewForm);

//get edit form
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingControllers.renderEditForm));

router.route("/:id")
//edit listings
.put(isLoggedIn,isOwner, upload.single("listings[image]"), validateListing,wrapAsync(listingControllers.updateListing))
//delete listing
.delete(isLoggedIn,isOwner,wrapAsync(listingControllers.deleteListing))
//particular listings with id
.get(wrapAsync(listingControllers.showListing));

module.exports = router;