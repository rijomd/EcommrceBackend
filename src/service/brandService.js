"use strict";
const MISC = require("./miscService.js");
const Brand = require("../model").Brand;
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
var mongoose = require('mongoose');

async function addBrand(querys) {
    let query = JSON.parse(JSON.stringify(querys));
    logger.debug("Enter Add Brand Service", query);

    let BrandNew = new Brand();
    for (let prop in query) {
        if (query.hasOwnProperty(prop)) {
            BrandNew[prop] = query[prop];
        }
    }

    if (BrandNew.name && BrandNew.category_id) {
        let returndata;
        try {
            let data = await BrandNew.save();
            if (data) {
                // returndata = await getBrand(data.createdby);
            }
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


async function getBrand(querys, Category_ids) {
    let query = JSON.parse(JSON.stringify(querys));
    logger.debug("Enter getBrand Service", query);
    logger.debug("Category_ids", Category_ids);

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
        if (Category_ids.length > 0) {
            newquery.$or = [{ name: { $regex: ".*" + query.searchKey + ".*", "$options": "i" } }, { category_id: { $in: Category_ids } }];
        }
        else {
            newquery.$or = [{ name: { $regex: ".*" + query.searchKey + ".*", "$options": "i" } }];
        }
    }
    delete query.searchKey;
    delete newquery.searchKey;
    logger.info(newquery, "newquery")
    try {
        let data = await Brand.paginate(
            newquery,
            { page: query.pageVo.pageNo, limit: query.pageVo.noOfItems, lean: true, populate: ["category_id"],sort: [['name', 'asc']]  });
        return MISC.response(0, process.env.SUCCESS, data);
    } catch (err) {
        logger.info(err, "err")
        let err_response = MISC.response(-11, process.env.ERROR, "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }

}


async function deleteBrand(Branddata) {
    logger.info(" deleteBrand service", Branddata);
    let _id = mongoose.Types.ObjectId(Branddata.Brand_id);
    let returndata;
    try {
        let data = await Brand.remove({ _id: _id }).exec();
        if (data) {
            // returndata = await getBrand(Branddata.Brand_id);
        }
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

async function updateBrand(Branddata) {
    console.log("updateBrand service");
    let returndata;
    try {
        let data = await Brand.findByIdAndUpdate(Branddata._id, Branddata);
        if (data) {
            returndata = await getBrand(Branddata.createdby);
        }

        return MISC.response(0, process.env.SUCCESS, ata);
    } catch (error) {
        logger.info(error)
        throw MISC.response(-11, process.env.ALREADY_EXIST, {});
    }
}

module.exports = {
    addBrand,
    getBrand,
    deleteBrand,
    updateBrand,
};

