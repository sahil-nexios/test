require("dotenv").config({ path: "./config/.env" });
const express = require("express");
app = express();
const PORT = process.env.PORT || 5000;

const userRouter = require("./app/router/userRouter");
// require("./config/connection");





app.use(express.json())
app.use(userRouter);

app.all("*", (req, res) => {
  res.send("URL not found")
})
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
