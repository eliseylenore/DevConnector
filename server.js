const express = require("express");
const mongoose = require("mongoose");
const app = express();
const user = require("./routes/api/users");
const profile = require("./routes/api/profile");
const passport = require("passport");

const bodyparser = require("body-parser");
const posts = require("./routes/api/posts");

// Body parser middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//Db config
const db = require("./config/keys").mongoURI;
//Connect to mongodb
mongoose
  .connect(db)
  .then(() => console.log("mongo db connected"))
  .catch(() => console.log(err));

//Passport middleware
app.use(passport.initialize());
require("./config/passport")(passport);

//First route
app.get("/", (req, res) => {
  res.send("Hlo");
});

//Use routes
app.use("/api/users", user);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = 5555;
app.listen(port, () => console.log(`Server running on port ${port}`));
