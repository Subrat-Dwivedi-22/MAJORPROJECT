require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const initDB = require("./init/index");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js");

if (!process.env.MONGO_URL) {
  throw new Error("MONGO_URL is not defined");
}

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not defined");
}

const mongoURL = process.env.MONGO_URL;

const PORT = process.env.PORT || 8080;

let isReady = false;

// Start server immediately

// Connect to Mongo separately
async function connectDB() {
  while (true) {
    try {
      await mongoose.connect(mongoURL);
      console.log("Mongo connected");

      await initDB();

      isReady = true; // ✅ IMPORTANT
      break;
    } catch (err) {
      console.log("Mongo not ready, retrying in 5s...");
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.send("app is working");
});



app.get("/health", (req, res) => {
  if (isReady) {
    return res.status(200).send("OK");
  }
  return res.status(503).send("NOT READY");
});
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

