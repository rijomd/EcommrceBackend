const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
const jwt = require('jsonwebtoken');
const multer = require('multer');
const multerS3 = require('multer-s3');
var aws = require('aws-sdk');
const shortid = require('shortid');
var mongoose = require('mongoose');

const renewToken = async (req, res, next) => {
    let refresh_token = req.body.refresh_token;
    if (!refresh_token) {
        res.status(401).json({
            error_code: 11,
            message: "Access Denied",
            data: {}
        });
    }
    else {
        jwt.verify(token, process.env.REFRESH_TOKEN, (err, res) => {
            if (!err) {
                logger.info(res, "res");
                let access_token = jwt.sign(res, process.env.ACCESS_TOKEN, { expiresIn: "30s" });
                res.status(200).json({
                    error_code: 11,
                    data: { access_token }
                });
            }
        });
    }
}

const autherization = async (req, res, next) => {

    const contype = req.headers['content-type'];
    console.log("content type .....................", contype);
    if (contype) {
        let token = req.headers.authorization;
        console.log(" token .....................", token);

        jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
            if (err) {
                console.log(" ...........failed..........", err);
                res.status(401).json({
                    error_code: 11,
                    message: process.env.AUTHENTICATION_FAILED,
                    data: {}
                });
            } else {
                req.user = decoded
                if (req.user.id) {
                    req.user._id = mongoose.Types.ObjectId(req.user.id);
                } else if (req.user._id) {
                    req.user._id = mongoose.Types.ObjectId(req.user._id);
                }
                logger.info("***********logineduser**********")
                next();
            }
        });
    }
    else {
        console.log("***********error*************");
        res.redirect('/login?message=' + process.env.AUTHENTICATION_FAILED);
    }
}

const adminMiddilware = async (req, res, next) => {
    if (req.user.role !== 1) {
        res.status(401).json({
            error_code: 11,
            message: "Access Denied",
            data: {}
        });
    }
    next();
}

let accessKeyId = process.env.ACCESS_KEYID;
let secretAccessKey = process.env.SECRET_KEYACESS;

const s3 = new aws.S3({
    accessKeyId,
    secretAccessKey,
});


const multerUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET_NAME,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            logger.info(file.originalname, "name");
            cb(null, shortid.generate() + "-" + file.originalname);
        }
        // metadata: function (req, file, cb) {
        //     cb(null, { fieldName: file.fieldname });
        //   },
        //   key: function (req, file, cb) {
        //     cb(null, shortid.generate() + "-" + file.originalname);
        //   },
    })
});

module.exports = {
    autherization, adminMiddilware, multerUpload, renewToken
}
