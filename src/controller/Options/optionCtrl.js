"use strict";
const optionService = require("../../service/optionService");
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
var mongoose = require('mongoose');


async function addOptions(req, res) {
    let query = req.body;
    logger.debug("add addOptions Ctrl", query);

    try {
        let response;
        //delete
        if (query.delete) {
            // response = await optionService.deletecategory(query);
        }
        //update
        else if (query._id) {
            query.updatedtime = new Date().getTime();
            response = await optionService.updateOptions(query);
        }
        else {
            //save
            query.status = 1;
            query.createdtime = new Date().getTime();
            response = await optionService.addOptions(query);
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


async function getOptions(req, res) {
    let query = req.body;
    logger.info("getOptions ctrl", query);

    try {
        let response = await optionService.getOptions(query);
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
    addOptions, getOptions
}