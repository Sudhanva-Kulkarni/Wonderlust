const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware");
const userControllers = require("../controllers/user");

router.route("/signup")
//render signup form
.get(userControllers.renderSignUpForm)
//signup
.post(wrapAsync(userControllers.signUp));

router.route("/login")
//render login form
.get(userControllers.renderLoginForm)
//login
.post(
    saveRedirectUrl,
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login",
    }),
    userControllers.login
);

//logout
router.get("/logout", userControllers.logout)

module.exports = router;