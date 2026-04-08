const data = require("./data.js");
const Listing = require("../models/listing");
const User = require("../models/user");

const initDB = async () => {
    let admin = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (!admin) {
        console.log("Creating admin user...");

        const newUser = new User({
            email: process.env.ADMIN_EMAIL,
            username: process.env.ADMIN_NAME
        });

        admin = await User.register(newUser, process.env.ADMIN_PASSWORD);

        console.log("Admin created");
    } else {
        console.log("Admin already exists");
    }

    const count = await Listing.countDocuments();

    if (count === 0) {
        console.log("Seeding listings...");

        const updatedData = data.data.map((obj) => ({
            ...obj,
            owner: admin._id
        }));

        await Listing.insertMany(updatedData);

        console.log("Listings initialized");
    } else {
        console.log("Listings already exist");
    }
};

module.exports = initDB;