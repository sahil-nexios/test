require("dotenv").config({ path: ".env" });
const express = require("express");
app = express();
const PORT = process.env.PORT || 5000;
const passport = require('passport')
const userRouter = require("./app/router/userRouter");
var cors = require('cors')

require("./config/connection");
require('./config/passport');
app.use(passport.initialize());
app.use(cors())

app.use(express.json())
app.use('/upload', express.static('upload'))
app.use(userRouter);

app.all("*", (req, res) => {
  res.send("URL not found")
})
app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
});
