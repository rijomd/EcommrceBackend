"use strict";
const OfferItemService = require("../../service/offerItemSerice");
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";

async function addOfferItem(req, res) {
    let query = req.body;
    logger.debug("add addOfferItem Ctrl", query);

    if (query.parent_id == "") {
        delete query.parent_id;
    }
    try {
        let response;
        if (query.delete) {
            response = await OfferItemService.deleteOfferItem(query);
        }
        else if (query._id) {
            query.updatedtime = new Date().getTime();
            response = await OfferItemService.updateOfferItem(query);
        }
        else {
            query.status = 1;
            query.createdtime = new Date().getTime();
            response = await OfferItemService.addOfferItem(query);
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


async function getOfferItemList(req, res) {
    let query = req.body;
    logger.info("getOfferItemList ctrl", query);
    try {
        let response = await OfferItemService.getOfferItemList(query);
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
    addOfferItem, getOfferItemList
}