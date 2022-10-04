"use strict";
const MISC = require("./miscService.js");
const Address = require("../model").Address;
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
var mongoose = require('mongoose');

async function addAddress(querys) {
    let query = JSON.parse(JSON.stringify(querys));
    logger.debug("Enter Add Address Service", query);

    let AddressNew = new Address();
    for (let prop in query) {
        if (query.hasOwnProperty(prop)) {
            AddressNew[prop] = query[prop];
        }
    }

    if (AddressNew.user_id && AddressNew.state && AddressNew.name && AddressNew.pin) {
        let returndata;
        try {
            let data = await AddressNew.save();
            if (data) {
                returndata = await getAddress(AddressNew.user_id);
            }
            return MISC.response(0, process.env.SUCCESS, returndata);
        } catch (err) {
            logger.info(err, "errror")
            let err_response = MISC.response(-11, process.env.ERROR, "");
            throw MISC.response(-11, process.env.ERROR, err_response);
        }
    } else {
        throw MISC.response(-11, process.env.ERROR, {});
    }

}

async function getAddress(querys) {
    let query = JSON.parse(JSON.stringify(querys));
    logger.debug("Enter getAddress Service", query);

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
        let data = await Address.paginate(
            newquery,
            { page: query.pageVo.pageNo, limit: query.pageVo.noOfItems, lean: true, populate: ["user_id"] });
        return MISC.response(0, process.env.SUCCESS, data);
    } catch (err) {
        logger.info(err, "err")
        let err_response = MISC.response(-11, process.env.ERROR, "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }

}


async function deleteAddress(Addressdata) {
    logger.info(" deleteAddress service", Addressdata);
    let _id = mongoose.Types.ObjectId(Addressdata.address_id);
    let returndata;
    try {
        let data = await Address.remove({ _id: _id }).exec();
        if (data) {
            returndata = await getAddress(Addressdata.address_id);
        }
        return MISC.response(0, process.env.COMPLETED, returndata);
    } catch (error) {
        logger.info(error, "error")
        let err_response = MISC.response(
            -11,
            process.env.ERROR,
            "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }

}

async function updateAddress(address) {
    console.log("updateAddress service");
    let returndata;
    try {
        let data = await Address.findByIdAndUpdate(address._id, address);
        if (data) {
            returndata = await getAddress(AddressNew.user_id);
        }

        return MISC.response(0, process.env.SUCCESS, returndata);
    } catch (error) {
        logger.info(error)
        throw MISC.response(-11, process.env.ALREADY_EXIST, {});
    }
}

module.exports = {
    addAddress,
    getAddress,
    deleteAddress,
    updateAddress
};

