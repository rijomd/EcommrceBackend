"use strict";
const MISC = require("./miscService.js");
const OfferItem = require("../model").OfferItem;
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
var mongoose = require('mongoose');

async function addOfferItem(querys) {
    let query = JSON.parse(JSON.stringify(querys));
    logger.debug("Enter Add OfferItem Service", query);

    let OfferItemNew = new OfferItem();
    for (let prop in query) {
        if (query.hasOwnProperty(prop)) {
            OfferItemNew[prop] = query[prop];
        }
    }
    try {
        let data = await OfferItemNew.save();
        return MISC.response(0, process.env.SUCCESS, data);
    } catch (err) {
        logger.info(err, "errror")
        let err_response = MISC.response(-11, process.env.ERROR, "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }
}


async function getOfferItemList(querys) {
    let query = JSON.parse(JSON.stringify(querys));
    logger.debug("Enter getOfferItemList Service", query);

    let newquery = {};
    for (let key in query) {
        if (query.hasOwnProperty(key)) {
            if (typeof query[key] !== "object") {
                newquery[key] = query[key];
            }
        }
    }
    if (newquery._id) {
        let _id = mongoose.Types.ObjectId(newquery._id);
        newquery._id = _id;
    }
    if (!query.pageVo) {
        query.pageVo = {};
        query.pageVo.pageNo = 1;
        query.pageVo.noOfItems = 10;
    }
    if (!query.pageVo.noOfItems || query.pageVo.noOfItems > 100) {
        query.pageVo.noOfItems = 10
    }
    if (!query.pageVo.pageNo) {
        query.pageVo.noOfItems = 1
    }
    if (query.searchKey) {
        newquery.$or = [{ name: { $regex: ".*" + query.searchKey + ".*", "$options": "i" } }];
        delete query.searchKey;
        delete newquery.searchKey;
    }
    logger.info(newquery, "newquery")
    try {
        let data = await OfferItem.paginate(
            newquery,
            { page: query.pageVo.pageNo, limit: query.pageVo.noOfItems, lean: true, });
        return MISC.response(0, process.env.SUCCESS, data);
    } catch (err) {
        logger.info(err, "err")
        let err_response = MISC.response(-11, process.env.ERROR, "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }

}


async function deleteOfferItem(OfferItemdata) {
    logger.info(" deleteOfferItem service", OfferItemdata);
    let _id = mongoose.Types.ObjectId(OfferItemdata.OfferItem_id);
    try {
        let data = await OfferItem.remove({ _id: _id }).exec();
        return MISC.response(0, process.env.COMPLETED, data);
    } catch (error) {
        logger.info(error, "error")
        let err_response = MISC.response(
            -11,
            process.env.ERROR,
            "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }

}

async function updateOfferItem(OfferItemdata) {
    console.log("updateOfferItem service");
    try {
        let data = await OfferItem.findByIdAndUpdate(OfferItemdata._id, OfferItemdata);
        return MISC.response(0, process.env.SUCCESS, data);
    } catch (error) {
        logger.info(error)
        throw MISC.response(-11, process.env.ALREADY_EXIST, {});
    }
}

module.exports = {
    addOfferItem,
    getOfferItemList,
    deleteOfferItem,
    updateOfferItem,
};

