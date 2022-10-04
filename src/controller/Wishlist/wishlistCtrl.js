"use strict";
const WishListService = require("../../service/WishListService");
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
var mongoose = require('mongoose');


async function addWishList(req, res) {
    let query = req.body;
    logger.debug("add addWishList Ctrl", query);

    try {
        let response;
        //delete
        if (query.delete) {
            if (req.user._id) {
                query.user_id = req.user._id;
            }
            response = await WishListService.deleteWishList(query);
        }
        else {
            //save
            if (req.user._id) {
                query.user_id = req.user._id;
            }
            query.status = 1;
            query.createdtime = new Date().getTime();
            response = await WishListService.addWishList(query);
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

}


async function getWishList(req, res) {
    let query = req.body;
    logger.info("getWishList ctrl", query);

    try {
        if (req.user._id) {
            query.user_id = req.user._id;
        }
        let response = await WishListService.getWishList(query);
        res.status(200).json({
            error_code: 0,
            message: process.env.SUCCESS,
            data: response.data
        });
    } catch (error) {
        logger.info(error, "error");
        res.status(200).json(
            {
                error_code: 11,
                message: error.message,
                data: error
            }
        )
    }
}

module.exports = {
    addWishList, getWishList
}