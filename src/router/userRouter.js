var express = require('express')
var router = express.Router(); //for routing or can use directly from express

const { body, validationResult } = require('express-validator');
const validationArray = [body('phone').isMobilePhone().withMessage("Not Available Number"), body('password').isLength({ min: 8 }).withMessage("Password Must be 8"),]

let userCtrl = require("../controller/user/userCntrol");
let authCtrl = require("../controller/user/autherCntrol");
router.get("/activate", userCtrl.activate);//for admin signup
router.get("/renewtoken", authCtrl.renewToken);//refresh token
router.post("/signup", validationArray, userCtrl.userSignUp);//user and seller registration
router.post("/login", userCtrl.userLogin);//all login
router.post("/addUser", authCtrl.autherization, userCtrl.addUser); //add && update from admin update profile
router.post("/userlist", authCtrl.autherization, userCtrl.userList);

router.get('/', (req, res) => {
    res.status(200).json({
        message: `hello iam fine`
    })
})


module.exports = router;
