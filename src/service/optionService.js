"use strict";
const MISC = require("./miscService.js");
const Options = require("../model").Options;
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
var mongoose = require('mongoose');

async function addOptions(querys) {
    let query = JSON.parse(JSON.stringify(querys));
    logger.debug("Enter Add Options Service", query);

    let OptionsNew = new Options();
    for (let prop in query) {
        if (query.hasOwnProperty(prop)) {
            OptionsNew[prop] = query[prop];
        }
    }

    if (OptionsNew.key) {
        try {
            let data = await OptionsNew.save();
            return MISC.response(0, process.env.SUCCESS, data);
        } catch (err) {
            logger.info(err, "errror")
            let err_response = MISC.response(-11, process.env.ERROR, "");
            throw MISC.response(-11, process.env.ERROR, err_response);
        }
    } else {
        throw MISC.response(-11, process.env.ERROR, {});
    }

}

async function updateOptions(dataObj) {
    logger.debug("Enter updateOptions Service", dataObj);

    try {
        let data = await Options.findByIdAndUpdate(
            dataObj._id,
            dataObj,
            { upsert: false, new: false }).exec();

        return MISC.response(0, process.env.SUCCESS, data);
    } catch (err) {
        let err_response = MISC.response(-11, process.env.ERROR, "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }

}

async function getOptions(querys) {
    let query = JSON.parse(JSON.stringify(querys));
    logger.debug("Enter getOptions Service", query);

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

  

    logger.info(newquery, "newquery")
    try {
        let data = await Options.paginate(
            newquery,
            { page: query.pageVo.pageNo, limit: query.pageVo.noOfItems, lean: true });
        return MISC.response(0, process.env.SUCCESS, data);
    } catch (err) {
        logger.info(err, "err")
        let err_response = MISC.response(-11, process.env.ERROR, "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }

}



module.exports = {
    addOptions,
    updateOptions,
    getOptions,
};

