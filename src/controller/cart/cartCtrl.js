"use strict";
const CartService = require("../../service/cartService");
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
var mongoose = require('mongoose');


async function addCart(req, res) {
    let query = req.body;
    logger.debug("add addCart Ctrl", query);

    try {
        let response;
        if (req.user._id) {
            query.user_id = req.user._id;
        }
        //delete
        if (query.delete) {
            response = await CartService.deleteCart(query);
        }
        else if (query._id) {
            response = await CartService.updateCart(query);
        }
        else {
            //save
            query.status = 1;
            query.quantity = 1;
            query.createdtime = new Date().getTime();
            response = await CartService.addCart(query);
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


async function getCart(req, res) {
    let query = req.body;
    logger.info("getCart ctrl", query);

    try {
        if (req.user._id) {
            query.user_id = req.user._id;
        }
        let response = await CartService.getCart(query);
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
    addCart, getCart
}