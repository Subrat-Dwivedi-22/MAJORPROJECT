const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const passport = require("passport");
const saveRedirectUrl = require("../middleware/saveRedirectUrl");
const { signup, login, logout, signupForm, loginForm } = require("../controllers/user.js");

router.get("/signup", signupForm);

router.post(
  "/signup",
  wrapAsync(signup),
);

router.get("/login", loginForm);


//passport resets sessions so we have to save them in locals
router.post(
  "/login", saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(login),
);

router.get("/logout", logout);

module.exports = router;
