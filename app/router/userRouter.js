const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { upload } = require('../middleware/upload');
const { authUser } = require('../middleware/auth');

router.post("/signup", userController.signup);
router.post("/login", userController.login);


router.post('/Add_Blog', authUser, upload, userController.add_blog);
router.get('/ViewAll_Blog', authUser, userController.viewAll_blog);
router.get('/View_Blog/:id', authUser, userController.View_Blog);
router.post('/Update_Blog/:id', authUser, upload, userController.Update_Blog);
router.get('/Delete_Blog/:id', authUser, userController.Delete_Blog);


router.post('/Search_Blog', userController.Search_Blog);



module.exports = router;
