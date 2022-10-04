"use strict";
const productvarientService = require("../../service/productVarientService");
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";

async function varientList(req, res) {
    let query = req.body;
    logger.info("varientList ctrl", query);

    try {
        let response = await productvarientService.getvarientList(query);
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

async function varientsAdd(req, res) {
    let query = req.body;
    logger.info("varientsAdd ctrl", query);
    let response;
    try {
        if (query.delete) {
            response = await productvarientService.deleteVarient(query);
        }
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
    varientList, varientsAdd
}