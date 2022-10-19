"use strict";
const OfferService = require("../../service/offerService");
const categoryService = require("../../service/categoryService");
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";

async function addOffer(req, res) {
    let query = req.body;
    logger.debug("add addOffer Ctrl", query);

    if (query.parent_id == "") {
        delete query.parent_id;
    }
    try {
        let response;
        if (query.delete) {
            response = await OfferService.deleteOffer(query);
        }
        else if (query._id) {
            query.updatedtime = new Date().getTime();
            response = await OfferService.updateOffer(query);
        }
        else {
            query.status = 1;
            query.createdtime = new Date().getTime();
            response = await OfferService.addOffer(query);
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


async function getOfferList(req, res) {
    let query = req.body;
    logger.info("getOfferList ctrl", query);
    try {
        let response = await OfferService.getOfferList(query);
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
    addOffer, getOfferList
}