"use strict";
const MISC = require("./miscService.js");
const Wish = require("../model").Wish;
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
var mongoose = require('mongoose');

async function addWishList(querys) {
    let query = JSON.parse(JSON.stringify(querys));
    logger.debug("Enter Add Wish Service", query);

    let WishNew = new Wish();
    for (let prop in query) {
        if (query.hasOwnProperty(prop)) {
            WishNew[prop] = query[prop];
        }
    }

    if (WishNew.product_id) {
        try {
            await WishNew.save();
            let data = await getWishList({ user_id: querys.user_id });
            return data;
        } catch (err) {
            logger.info(err, "errror")
            let err_response = MISC.response(-11, process.env.ERROR, "");
            throw MISC.response(-11, process.env.ERROR, err_response);
        }
    } else {
        throw MISC.response(-11, process.env.ERROR, {});
    }

}

async function getWishList(querys) {
    let query = JSON.parse(JSON.stringify(querys));
    logger.debug("Enter getWish Service", query);

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
        let data = await Wish.paginate(
            newquery,
            { page: query.pageVo.pageNo, limit: query.pageVo.noOfItems, lean: true, populate: ["user_id", "product_id"] });
        return MISC.response(0, process.env.SUCCESS, data);
    } catch (err) {
        logger.info(err, "err")
        let err_response = MISC.response(-11, process.env.ERROR, "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }

}


async function deleteWishList(WishData) {
    logger.info(" deleteWish service", WishData);
    let _id = mongoose.Types.ObjectId(WishData._id);

    try {
        await Wish.remove({ _id: _id }).exec();
        let data = await getWishList({ user_id: WishData.user_id });
        return data;
    } catch (error) {
        logger.info(error, "error")
        let err_response = MISC.response(
            -11,
            process.env.ERROR,
            "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }

}



module.exports = {
    addWishList,
    deleteWishList,
    getWishList
};

