const HTTP = require("../../constants/resCode");
const userModel = require("../model/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blogModel = require("../model/blogModel");
const fs = require('fs')
const moment = require('moment');


const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.BAD_REQUEST, message: "All Fields Are Required !" })
        if (!email.includes("@")) return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.BAD_REQUEST, message: "Please Enter Valid Email !" })
        const finuser = await userModel.findOne({ email: email })
        if (finuser) return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.BAD_REQUEST, message: "This Email Is Already Taken !" })

        const bpass = await bcrypt.hash(password, 10)
        new userModel({ ...req.body, password: bpass }).save()
        return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "User Registered Successfully !" })

    } catch (error) {
        console.log("🚀 ~ signup ~ error:", error)
        return res.status(HTTP.SUCCESS).send({ code: HTTP.INTERNAL_SERVER_ERROR, status: false, message: "Something Went Wrong !", });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.BAD_REQUEST, message: "All Fields Are Required !" })
        const finuser = await userModel.findOne({ email: email })
        if (!finuser) return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.BAD_REQUEST, message: "User Not Found !" })
        const pass = await bcrypt.compare(password, finuser.password)
        if (pass) {
            const token = jwt.sign({ _id: finuser._id }, process.env.JWT_SECRET)
            return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "Sign-in Successfully !", token })
        } else {
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.BAD_REQUEST, message: "Please Enter Valid Password !" })
        }
    } catch (error) {
        console.log("🚀 ~ login ~ error:", error)
        return res.status(HTTP.SUCCESS).send({ code: HTTP.INTERNAL_SERVER_ERROR, status: false, message: "Something Went Wrong !", });
    }
}


const add_blog = async (req, res) => {
    try {
        const { title, content, category } = req.body
        if (!title || !content || !category) return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.BAD_REQUEST, message: "All Fields Are Required !" })
        if (!req.file) return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.BAD_REQUEST, message: "Please Upload Image !" })
        const image = `upload/images/${req.file.filename}`
        new blogModel({ ...req.body, image: image, auther_id: req.user._id }).save()
        return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "Blog Added Successfully !" })

    } catch (error) {
        console.log("🚀 ~ constadd_blog= ~ error:", error)
        return res.status(HTTP.SUCCESS).send({ code: HTTP.INTERNAL_SERVER_ERROR, status: false, message: "Something Went Wrong !", });
    }
}


const viewAll_blog = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const totalItems = await blogModel.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);
        const skip = (page - 1) * limit;
        const findblog = await blogModel.find({ auther_id: req.user._id }, { createdAt: 0, updatedAt: 0, __v: 0 }).skip(skip).limit(limit)
        if (findblog.length <= 0) return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.NOT_FOUND, message: "Blog Not Found !" })
        const formattedBlogs = findblog.map(blog => {
            const formattedBlog = blog.toObject();
            formattedBlog.Publish_Date = moment(blog.createdAt).format('YYYY-MM-DD HH:mm:ss');
            formattedBlog.Update_Date = moment(blog.updatedAt).format('YYYY-MM-DD HH:mm:ss');
            return formattedBlog;
        });
        return res.status(HTTP.SUCCESS).send({
            status: true, code: HTTP.SUCCESS, message: "Blogs !", data: {
                totalItems,
                totalPages,
                currentPage: page,
                formattedBlogs
            }
        })
    } catch (error) {
        console.log("🚀 ~ constviewAll_blog= ~ error:", error)
        return res.status(HTTP.SUCCESS).send({ code: HTTP.INTERNAL_SERVER_ERROR, status: false, message: "Something Went Wrong !", });
    }
}

const View_Blog = async (req, res) => {
    try {
        const findblog = await blogModel.findById(req.params.id).select('-createdAt -updatedAt -__v');
        if (!findblog) return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.NOT_FOUND, message: "Blog Not Found !" })
        const blogObject = findblog.toObject();
        blogObject.Publish_Date = moment(findblog.createdAt).format('YYYY-MM-DD HH:mm:ss');
        blogObject.Update_Date = moment(findblog.updatedAt).format('YYYY-MM-DD HH:mm:ss');
        return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "Blogs !", data: blogObject })
    } catch (error) {
        console.log("🚀 ~ constviewAll_blog= ~ error:", error)
        return res.status(HTTP.SUCCESS).send({ code: HTTP.INTERNAL_SERVER_ERROR, status: false, message: "Something Went Wrong !", });
    }
}

const Update_Blog = async (req, res) => {
    try {
        const findblog = await blogModel.findById(req.params.id);
        if (!findblog) return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.NOT_FOUND, message: "Blog Not Found !" });
        if (!findblog.auther_id.equals(req.user._id)) return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.NOT_FOUND, message: "Invalid Credentials !" });
        let image;
        if (req.file) {
            fs.unlinkSync(findblog.image)
            image = `upload/images/${req.file.filename}`
        }
        await blogModel.findByIdAndUpdate(req.params.id, { $set: { ...req.body, image: image } })
        return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "Blog Update Succesfully !" })

    } catch (error) {
        console.log("🚀 ~ constUpdate_Blog= ~ error:", error)
        return res.status(HTTP.SUCCESS).send({ code: HTTP.INTERNAL_SERVER_ERROR, status: false, message: "Something Went Wrong !", });
    }
}


const Delete_Blog = async (req, res) => {
    try {
        const findblog = await blogModel.findById(req.params.id);
        if (!findblog) return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.NOT_FOUND, message: "Blog Not Found !" });
        if (!findblog.auther_id.equals(req.user._id)) return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.NOT_FOUND, message: "Invalid Credentials !" });
        fs.unlinkSync(findblog.image)
        await blogModel.findByIdAndDelete(req.params.id)
        return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "Blog Delete Succesfully !" })

    } catch (error) {
        console.log("🚀 ~ constDelete_Blog= ~ error:", error)
        return res.status(HTTP.SUCCESS).send({ code: HTTP.INTERNAL_SERVER_ERROR, status: false, message: "Something Went Wrong !", });
    }
}

const Search_Blog = async (req, res) => {
    try {
        const search = req.body.search
        const regex = new RegExp(search, 'i');
        const findblog = await blogModel.find({
            $or: [
                { title: regex },
                { content: regex },
                { category: regex }
            ]
        });
        if (findblog.length <= 0) return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.NOT_FOUND, message: "Blog Not Found !" })

        return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "Blog Detailes !", data: findblog })

    } catch (error) {
        console.log("🚀 ~ constSearch_Blog= ~ error:", error)
        return res.status(HTTP.SUCCESS).send({ code: HTTP.INTERNAL_SERVER_ERROR, status: false, message: "Something Went Wrong !", });
    }
}





module.exports = {
    signup,
    login,
    add_blog,
    viewAll_blog,
    View_Blog,
    Update_Blog,
    Delete_Blog,
    Search_Blog
};
