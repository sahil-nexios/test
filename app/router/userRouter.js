const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");


// router.post("/signup",userController.signup)
router.get("/get", (req, res) => {
    res.send("API success !")
})




module.exports = router;
