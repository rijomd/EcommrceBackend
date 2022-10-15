"use strict";
const productvarientService = require("../../service/productVarientService");
const productservice = require("../../service/productService");

const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
var mongoose = require('mongoose');

async function varientList(req, res) {
    let query = req.body;
    logger.info("varientList ctrl", query);
    let productarray = [];
    let response = {};

    try {
        if (query.listing) {
            // gets products id from category
            // for productlist in web
            delete query.listing;
            let responseall = await productservice.getProductlist(query);

            if (responseall.data && responseall.data.docs && responseall.data.docs.length > 0) {
                let docs = responseall.data.docs;
                for (let item of docs) {
                    //    let a= mongoose.Types.ObjectId(item._id.toString());
                    productarray.push(item._id);
                }
            }
            if (productarray && productarray.length > 0) {
                let newquery = {
                    productarray: productarray,
                }
                response = await productvarientService.getvarientList(newquery);
            }
        }
        else if (query.singleview_Web) {
            // for single view in website
            // gets product id from varient and selecting all data 
            let productFulldata = await productvarientService.getvarientByProduct(query);
            logger.info(productFulldata, "productFulldata");
            let docs = [];
            docs.push(productFulldata);
            let data = {
                docs: docs
            }
            response.data = data;//for sending same format
        }
        else {
            response = await productvarientService.getvarientList(query);
        }

        res.status(200).json({
            error_code: 0,
            message: process.env.SUCCESS,
            data: response.data
        });
    } catch (error) {
        logger.info(error, "error");
        res.status(200).json(
            {
                error_code: 11,
                message: error.message,
                data: error
            }
        )
    }
}

async function varientsAdd(req, res) {
    let query = req.body;
    logger.info("varientsAdd ctrl", query);
    let response;
    try {
        if (query.delete) {
            response = await productvarientService.deleteVarient(query);
        }
        res.status(200).json({
            error_code: 0,
            message: process.env.SUCCESS,
            data: response.data
        });
    } catch (error) {
        logger.info(error, "error");
        res.status(200).json(
            {
                error_code: 11,
                message: error.message,
                data: error
            }
        )
    }
}

module.exports = {
    varientList, varientsAdd
}