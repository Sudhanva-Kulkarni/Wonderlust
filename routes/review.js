const express = require("express");
const router = express.Router({mergeParams: true});

const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const { isLoggedIn, validateReview, isAuthor } = require("../middleware");

const reviewControllers = require("../controllers/review");

router.route("/")
//reviews
.get(isLoggedIn,wrapAsync(reviewControllers.getReviews))
//create reviews
.post(isLoggedIn,validateReview,wrapAsync(reviewControllers.createReview))

//delete reviews
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewControllers.deleteReview))

module.exports = router;