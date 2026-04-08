const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const isLoggedIn = require("../middleware/isLoggedIn.js");
const isReviewAuthor = require("../middleware/isReviewAuthor.js");
const { createReview, deleteReview } = require("../controllers/review.js");
const validateReview = require("../middleware/validateReview.js");




router.post("/", isLoggedIn, validateReview ,wrapAsync(createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor,wrapAsync(deleteReview));

module.exports = router;