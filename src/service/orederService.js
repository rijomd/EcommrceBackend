"use strict";
const MISC = require("./miscService.js");
const Order = require("../model").Order;
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
var mongoose = require('mongoose');

async function addOrder(querys) {
    let query = JSON.parse(JSON.stringify(querys));
    logger.debug("Enter Add Order Service", query);

    let OrderNew = new Order();
    for (let prop in query) {
        if (query.hasOwnProperty(prop)) {
            OrderNew[prop] = query[prop];
        }
    }

    if (OrderNew.user_id) {
        try {
            let data = await OrderNew.save();
            return MISC.response(0, process.env.SUCCESS, data);
        } catch (err) {
            logger.info(err, "errror")
            let err_response = MISC.response(-11, process.env.ERROR, "");
            throw MISC.response(-11, process.env.ERROR, err_response);
        }
    } else {
        throw MISC.response(-11, "Incomplete form", {});
    }
}


async function getOrderList(querys) {
    let query = JSON.parse(JSON.stringify(querys));
    logger.debug("Enter getOrderList Service", query);

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
        let data = await Order.paginate(
            newquery,
            { page: query.pageVo.pageNo, limit: query.pageVo.noOfItems, lean: true, populate: ["user_id", "product_varient"]});
        return MISC.response(0, process.env.SUCCESS, data);
    } catch (err) {
        logger.info(err, "err")
        let err_response = MISC.response(-11, process.env.ERROR, "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }

}


async function deleteOrder(Orderdata) {
    logger.info(" deleteOrder service", Orderdata);
    let _id = mongoose.Types.ObjectId(Orderdata.Order_id);
    try {
        let data = await Order.remove({ _id: _id }).exec();
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

async function updateOrder(Orderdata) {
    console.log("updateOrder service");
    try {
        let data = await Order.findByIdAndUpdate(Orderdata._id, Orderdata);
        return MISC.response(0, process.env.SUCCESS, data);
    } catch (error) {
        logger.info(error)
        throw MISC.response(-11, process.env.ALREADY_EXIST, {});
    }
}

module.exports = {
    addOrder,
    getOrderList,
    deleteOrder,
    updateOrder,
};

