"use strict";
const MISC = require("./miscService.js");
const Product_atributes = require("../model").Product_atributes;
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
var mongoose = require('mongoose');

async function addProduct_atributes(querys) {
    let query = JSON.parse(JSON.stringify(querys));
    logger.debug("Enter Add Product_atributes Service", query);

    let Product_atributesNew = new Product_atributes();
    for (let prop in query) {
        if (query.hasOwnProperty(prop)) {
            Product_atributesNew[prop] = query[prop];
        }
    }

    if (Product_atributesNew.key) {
        try {
            let data = await Product_atributesNew.save();
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

async function updateProduct_atributes(dataObj) {
    logger.debug("Enter updateProduct_atributes Service", dataObj);

    try {
        let data = await Product_atributes.findByIdAndUpdate(
            dataObj._id,
            dataObj,
            { upsert: false, new: false }).exec();

        return MISC.response(0, process.env.SUCCESS, data);
    } catch (err) {
        let err_response = MISC.response(-11, process.env.ERROR, "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }

}

async function getProduct_atributes(querys, Category_ids) {
    let query = JSON.parse(JSON.stringify(querys));
    logger.debug("Enter getProduct_atributes Service", query, Category_ids);

    let newquery = {};
    let newquery2 = {};

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
        newquery.$or = [{ category_id: { $in: Category_ids } }];
    }
    if (query.category_id) {
        newquery2.$or = [{ common: true }];
        newquery.$or = [{ value: { $ne: [] } }];
        newquery = {
            $or:
                [
                    newquery2,
                    newquery
                ]
        }
    }

    logger.info(newquery, "newquery", newquery2)
    try {
        let data = await Product_atributes.paginate(
            newquery,
            { page: query.pageVo.pageNo, limit: query.pageVo.noOfItems, lean: true, populate: ["category_id"] });
        return MISC.response(0, process.env.SUCCESS, data);
    } catch (err) {
        logger.info(err, "err")
        let err_response = MISC.response(-11, process.env.ERROR, "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }

}


async function deleteAtributtes(Addressdata) {
    logger.info(" deleteAtributtes service", Addressdata._id);
    try {
        let data = await Product_atributes.deleteMany({ _id: Addressdata._id }).exec();
        return MISC.response(0, process.env.COMPLETED, Addressdata);
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
    addProduct_atributes,
    updateProduct_atributes,
    getProduct_atributes, deleteAtributtes
};

