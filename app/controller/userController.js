const HTTP = require("../../constants/resCode");
const userModel = require("../model/userModel");
const bcrypt = require('bcrypt');


// const signup = async (req, res) => {
//     try {
//         const { name, email, password } = req.body
//         if (!name || !email || !password) return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.BAD_REQUEST, message: "All Fields Are Required !" })
//         if (!email.includes("@")) return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.BAD_REQUEST, message: "Please Enter Valid Email !" })
//         const bpass = await bcrypt.hash(password, 10)

//         new userModel({ ...req.body, password: bpass }).save()
//         return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "User Registerd Succesfully !" })

//     } catch (error) {
//         console.log("🚀 ~ signup ~ error:", error)
//         return res.status(HTTP.SUCCESS).send({ code: HTTP.INTERNAL_SERVER_ERROR, status: false, message: "Something Went Wrong !", });
//     }
// };




module.exports = {
    // signup,
};
