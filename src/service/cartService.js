"use strict";
const MISC = require("./miscService.js");
const Cart = require("../model").Cart;
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
var mongoose = require('mongoose');

async function addCart(querys) {
    let query = JSON.parse(JSON.stringify(querys));
    logger.debug("Enter Add Cart Service", query);

    let CartNew = new Cart();
    for (let prop in query) {
        if (query.hasOwnProperty(prop)) {
            CartNew[prop] = query[prop];
        }
    }

    if (CartNew.product_id) {
        try {
            let data = await CartNew.save();
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

async function getCart(querys) {
    let query = JSON.parse(JSON.stringify(querys));
    logger.debug("Enter getCart Service", query);

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
        let data = await Cart.paginate(
            newquery,
            { page: query.pageVo.pageNo, limit: query.pageVo.noOfItems, lean: true, populate: ["user_id", "product_id"] });
        return MISC.response(0, process.env.SUCCESS, data);
    } catch (err) {
        logger.info(err, "err")
        let err_response = MISC.response(-11, process.env.ERROR, "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }

}


async function deleteCart(CartData) {
    logger.info(" deleteCart service", CartData);
    let _id = mongoose.Types.ObjectId(CartData._id);
    let returndata;

    try {
        let data = await Cart.remove({ _id: _id }).exec();
        if (data) {
            returndata = await getCart({ user_id: CartData.user_id, status: 1 });
        }
        return returndata;
    } catch (error) {
        logger.info(error, "error")
        let err_response = MISC.response(
            -11,
            process.env.ERROR,
            "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }

}

const updateCart = async (cartdata) => {
    console.log("update cartdata service", cartdata);
    let returndata;
    try {
        let data = await Cart.findByIdAndUpdate(cartdata._id, cartdata);
        if (data) {
            returndata = await getCart({ user_id: cartdata.user_id, status: 1 });
        }
        return returndata;
    } catch (error) {
        logger.info(error)
        throw MISC.response(-11, process.env.ALREADY_EXIST, {});
    }
}

module.exports = {
    addCart,
    getCart,
    deleteCart, updateCart
};

