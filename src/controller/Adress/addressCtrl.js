"use strict";
const AddressService = require("../../service/addressService");
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
var mongoose = require('mongoose');


async function addAddress(req, res) {
    let query = req.body;
    logger.debug("add addAddress Ctrl", query);

    if (req.user._id) {
        query.user_id = req.user._id;
    }
    try {
        let response;
        //delete
        if (query.delete) {
            response = await AddressService.deleteAddress(query);
        }
        else if (query._id) {
            response = await AddressService.updateAddress(query);
        }
        else {
            //save
            query.status = 1;
            query.createdtime = new Date().getTime();
            response = await AddressService.addAddress(query);
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


async function getAddress(req, res) {
    let query = req.body;
    logger.info("getAddress ctrl", query);

    try {
        if (req.user._id) {
            query.user_id = req.user._id;
        }
        let response = await AddressService.getAddress(query);
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
    addAddress, getAddress
}