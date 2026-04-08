const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const isLoggedIn = require("../middleware/isLoggedIn.js");
const isOwner = require("../middleware/isOwner.js");
const { index, renderNewForm, showListing, createListing, renderEditForm, updateListing, deleteListing } = require("../controllers/listing.js");
const { validateListing } = require("../middleware/validateListing.js");
const upload = require("../middleware/multer");

router.get("/", validateListing, wrapAsync(index));

router.post("/", isLoggedIn, upload.single("image"), wrapAsync(createListing));

router.get("/new", isLoggedIn, renderNewForm);

router.get("/:id", wrapAsync(showListing));

router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(updateListing));

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(deleteListing));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm));

module.exports = router;