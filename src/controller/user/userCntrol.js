"use strict";
const userService = require("../../service/userService");
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');


async function userSignUp(req, res) {
    let query = req.body;
    logger.debug("add userSignUp Ctrl", query);

    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(200).json({
            error_code: 11,
            message: "Please Fill required fields",
            data: err
        });
    }
    //save
    query.status = 1;
    query.role = query.role;
    if (query.role === 1) {
        query.activation_status =1;
    }

    query.createdtime = new Date().getTime();
    try {
        let response = await userService.userSign(query);
        if (response && response.data) {
            let user = {
                _id: response.data._id,
                name: response.data.name,
                phone: response.data.phone,
                role: response.data.role,
            };
            let token = jwt.sign(user, process.env.JWT_KEY, { expiresIn: "30d" });
            // let access_token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "30s" });
            // let refresh_token = jwt.sign(user, process.env.REFRESH_TOKEN, { expiresIn: "30d" });

            res.status(200).json({
                error_code: 0,
                message: process.env.SUCCESS,
                data: {
                    // access_token: access_token,
                    // refresh_token: refresh_token,
                    token: token,
                    user: user,
                    auth: true,
                }
            });
        }

    } catch (err) {
        logger.info(err)
        res.status(200).json({
            error_code: 11,
            message: err.message,
            data: err
        });
    }

}


async function userLogin(req, res) {
    let query = req.body;
    logger.debug("add login Ctrl", query);

    try {
        let response = await userService.loginUser(query);
        if (response && response.data) {
            let user = {
                _id: response.data._id,
                name: response.data.name,
                phone: response.data.phone,
                role: response.data.role,
                priceDetails_cart: response.data.priceDetails_cart,
            }
            let token = jwt.sign(user, process.env.JWT_KEY, { expiresIn: "30d" });
            // let access_token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "30s" });
            // let refresh_token = jwt.sign(user, process.env.REFRESH_TOKEN, { expiresIn: "30d" });
            res.status(200).json({
                error_code: 0,
                message: process.env.SUCCESS,
                data: {
                    token: token,
                    user: user,
                    auth: true,
                }
            });
        }

    } catch (err) {
        logger.info(err)
        res.status(200).json({
            error_code: 11,
            message: err.message,
            data: err
        });
    }

}


async function activate(req, res) {
    console.log("activateuser");
    let query = {
        name: "admin",
        email: "admin@flip.com",
        phone: 1234567890,
        password: "flip@123",
        role: process.env.ROLE_ADMIN,
        status: 1,
        activation_status: 1,
        createdtime: new Date().getTime(),
        updatedtime: new Date().getTime(),
    };

    try {
        let response = await userService.userSign(query);
        if (response && response.data) {
            res.status(200).json({
                error_code: 0,
                message: process.env.SUCCESS,
                data: {
                    user: response.data,
                }
            });
        }
    } catch (err) {
        logger.info(err, "error")
        res.status(200).json({
            error_code: 11,
            message: err.message,
            data: err
        });
    }


}


async function userList(req, res) {
    let query = {};
    try {
        query = req.body;
        logger.info("enter userList ctrl", query);
        // if (req.user.role !== ROLE.ADMIN) {
        //     query.user_id = req.user._id.toString();
        // }
        let response = await userService.userList(query);
        res.status(200).json({
            error_code: 0,
            message: process.env.SUCCESS,
            data: response.data
        });

    } catch (err) {
        res.status(200).json({
            error_code: 11,
            message: process.env.ERROR,
            data: err
        });
    }

}


async function addUser(req, res) {
    let query = req.body;
    let response;
    // update
    // if (query._id) {
    // if (req.user.role !== ROLE.ADMIN) {
    //     query.user_id = req.user._id.toString();
    // }
    try {
        logger.debug("  Enter add/update user Ctrl", query);

        if (query.delete) {
            response = await userService.deleteUser(query);
        }
        else if (query._id) {
            query.updatedtime = new Date().getTime();
            response = await userService.saveOrUdpateUser(query);
        }
        else {
            query.createdtime = new Date().getTime();
            query.activation_status = 1;
            query.block_status = 0;
            response = await userService.saveOrUdpateUser(query);
        }
        res.status(200).json({
            error_code: 0,
            message: process.env.SUCCESS,
            data: response.data
        });
    } catch (err) {
        logger.info(err)
        res.status(200).json({
            error_code: 11,
            message: err.message,
            data: err
        });
    }
    // }
    // else {
    //     try {
    //         let response = await userService.addUser(query);
    //         res.status(200).json({
    //             error_code: 0,
    //             message: process.env.SUCCESS,
    //             data: response.data
    //         });
    //     } catch (err) {
    //         logger.info(err)
    //         res.status(200).json({
    //             error_code: 11,
    //             message: err.message,
    //             data: err
    //         });
    //     }

    // }
}




module.exports = {
    userSignUp, userLogin, activate, addUser, userList,
};