"use strict";
const MISC = require("./miscService.js");
const Images = require("../model").Images;
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
var mongoose = require('mongoose');

async function addImages(querys) {
    let query = JSON.parse(JSON.stringify(querys));
    logger.debug("Enter Add images Service", query);

    let ImagesNew = new Images();
    for (let prop in query) {
        if (query.hasOwnProperty(prop)) {
            ImagesNew[prop] = query[prop];
        }
    }

    if (ImagesNew.image) {
        try {
            let data = await ImagesNew.save();
            return MISC.response(0, process.env.SUCCESS, data);
        } catch (err) {
            let err_response = MISC.response(-11, process.env.ERROR, "");
            throw MISC.response(-11, process.env.ERROR, err_response);
        }
    } else {
        throw MISC.response(-11, process.env.ERROR, {});
    }

}

async function updateImages(dataObj) {
    logger.debug("Enter updateImages Service", dataObj);

    try {
        let data = await Images.findByIdAndUpdate(
            dataObj._id,
            dataObj,
            { upsert: false, new: false }).exec();

        return MISC.response(0, process.env.SUCCESS, data);
    } catch (err) {
        let err_response = MISC.response(-11, process.env.ERROR, "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }

}

async function getImagesList(querys) {
    let query = JSON.parse(JSON.stringify(querys));
    logger.debug("Enter getImagesList Service", query);

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
        let data = await Images.paginate(
            newquery,
            { page: query.pageVo.pageNo, limit: query.pageVo.noOfItems, lean: true });
        return MISC.response(0, process.env.SUCCESS, data);
    } catch (err) {
        logger.info(err, "err")
        let err_response = MISC.response(-11, process.env.ERROR, "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }

}

async function deleteImages(query) {
    try {
        let data = await Images.remove({ _id: query._id, user_id: query.user_id }).exec();
        return MISC.response(0, process.env.SUCCESS, data);
    } catch (err) {
        let err_response = MISC.response(-11, process.env.ERROR, "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }
}

module.exports = {
    addImages,
    updateImages,
    getImagesList,
    deleteImages
};

