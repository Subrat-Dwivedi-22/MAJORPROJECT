const express = require("express");
const Listing = require("../models/listing.js");
const cloudinary = require("../clouddconfig.js");

module.exports.index = async (req, res) => {
  const data = await Listing.find({});
  res.render("listing/index.ejs", { data });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listing/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const data = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!data) {
    req.flash("error", "Listing you requrested does not exist");
    res.redirect("/listings");
  } else res.render("listing/show.ejs", { data });
};

module.exports.createListing = async (req, res) => {
  const listing = new Listing(req.body.listing);
  const file = req.file;

  const b64 = Buffer.from(file.buffer).toString("base64");
  const dataURI = `data:${file.mimetype};base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataURI);
  console.log(result);
  listing.owner = req.user._id;
  listing.image.url = result.secure_url;
  listing.image.public_id=result.public_id;
  await listing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const data = await Listing.findById(id);
  if (!data) {
    req.flash("error", "Listing you requrested does not exist");
    res.redirect("/listings");
  } else res.render("listing/edit.ejs", { data });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let { listing } = req.body;
  await Listing.findByIdAndUpdate(
    id,
    { ...listing },
    { runValidators: true, returnDocument: "after" },
  );
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  const data = await Listing.findById(id);
  await cloudinary.uploader.destroy(data.image.public_id);
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
