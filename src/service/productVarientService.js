"use strict";
const MISC = require("./miscService.js");
const Productvarient = require("../model").Product_varient;
const Products = require("../model").Products;
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
var mongoose = require('mongoose');

const calculateOffer = async (sellerprice, original) => {
    let i = (original - sellerprice) / original;
    let offer = i * 100;
    return Math.round(offer);
}

// creating variations and saves in varient table
async function addProductvarients(_id, varientsArray) {
    logger.debug("add addProductvarients Service", varientsArray, _id);
    try {
        await varientsArray.forEach(async item => {
            let VarientsNew = new Productvarient();
            for (let prop in item) {
                if (item.hasOwnProperty(prop)) {
                    VarientsNew[prop] = item[prop];
                }
            }
            VarientsNew.product = _id;
            VarientsNew.createdtime = new Date().getTime();
            VarientsNew.offer = await calculateOffer(item.selling_price, item.orginal_price);
            await VarientsNew.save();
        });
    } catch (err) {
        logger.info(err, "service error")
        throw MISC.response(-11, err.message, {});
    }
}

const getvarientList = async (query) => {
    logger.debug(" getvarientList Service", query);

    let newquery = {};
    for (let key in query) {
        if (query.hasOwnProperty(key)) {
            if (typeof query[key] !== "object") {
                newquery[key] = query[key];
            }
        }
    }
    if (query._id) {
        let _id = mongoose.Types.ObjectId(query._id);
        newquery._id = _id;
    }
    if (!query.pageVo) {
        query.pageVo = {};
        query.pageVo.pageNo = 1;
        query.pageVo.noOfItems = 10;
    }
    if (!query.pageVo.pageNo) {
        query.pageVo.noOfItems = 1
    }
    //for varient listing in website
    if (query.productarray) {
        newquery.product = { $in: query.productarray }
        delete query.productarray;
        delete newquery.productarray;
    }
    try {
        console.log("newquery", newquery);
        let conditions = { page: query.pageVo.pageNo, limit: query.pageVo.noOfItems, lean: true, populate: "product", sort: [['varient_name', 'asc']] };
        let data = await Productvarient.paginate(newquery, conditions);
        return MISC.response(0, process.env.COMPLETED, data);
    }
    catch (err) {
        logger.info(err, "errr");
        let err_response = MISC.response(
            -11,
            process.env.ERROR,
            "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }

}

// single varient edit
const varientsEdit = async (dataObj) => {
    logger.info(dataObj, "enter varientsEdit service");
    dataObj.offer = await calculateOffer(dataObj.selling_price, dataObj.orginal_price);
    try {
        let data = await Productvarient.findByIdAndUpdate(
            dataObj._id,
            dataObj,
            { upsert: false, new: false }).exec();

        return data;
    } catch (err) {
        logger.info(err);
        let err_response = MISC.response(
            err,
            "");

        throw MISC.response(-11, process.env.ERROR, err_response);
    }
}


const editProductVarients = async (edit_Varients) => {
    logger.info("editProductVarients");

    for (let item of edit_Varients) {
        await varientsEdit(item);
    }
}

// multivarient edit
const multivarientsEdit = async (_id, varients, edit_Varients) => {
    logger.info(varients, "enter multivarientsEdit service varients");
    logger.info(edit_Varients, "enter multivarientsEdit service edit_Varients",);

    try {
        // adding new varient
        if (varients && varients.length > 0) {
            await addProductvarients(_id, varients);
        }
        // edit varient data
        if (edit_Varients && edit_Varients.length > 0) {
            await editProductVarients(edit_Varients);
        }
    }
    catch (err) {
        logger.info(err);
        let err_response = MISC.response(
            err,
            "");

        throw MISC.response(-11, process.env.ERROR, err_response);
    }
}

async function deleteVarient(ProductsData) {
    logger.info(" deleteVarient service", ProductsData);
    let _id = mongoose.Types.ObjectId(ProductsData._id);

    try {
        await Productvarient.remove({ _id: _id }).exec();
        let data = await getvarientList({ product: ProductsData.product._id })
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

const deleteVarientFromProduct = async (ProductsData) => {
    logger.info(" deleteVarientFromProduct service", ProductsData);

    try {
        await Productvarient.remove({ product: ProductsData }).exec();
    } catch (error) {
        logger.info(error, "error")
        let err_response = MISC.response(
            -11,
            process.env.ERROR,
            "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }

}

const getvarientByProduct = async (data) => {
    logger.info(" getvarientByProduct ", data);
    let fullproductData;
    try {
        let varient = await Productvarient.findOne({ _id: data._id });
        if (varient && varient.product) {
            let varientsDataArray = await Productvarient.find({ product: varient.product });
            let productData = await Products.find({ _id: varient.product });

            if (varientsDataArray && productData && productData.length > 0) {
                 fullproductData = {
                    varients: varientsDataArray,
                    product: productData[0]
                }
            }
        }
        return fullproductData;
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
    addProductvarients, getvarientList, deleteVarient, varientsEdit, multivarientsEdit, deleteVarientFromProduct, getvarientByProduct
}