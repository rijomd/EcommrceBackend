"use strict";
const productservice = require("../../service/productService");
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
var mongoose = require('mongoose');


async function addProduct(req, res) {
    let query = req.body;
    logger.debug("add addProduct Ctrl", query);

    if (query.brand === "1") {
        delete query.brand;
    }

    try {
        let response;
        //delete
        if (query.delete) {
            response = await productservice.deleteProduct(query);
        }
        //update
        else if (query._id) {
            query.updatedtime = new Date().getTime();
            response = await productservice.updateProduct(query);
        }
        else {
            //save
            query.status = 1;
            query.soldout_count = 0;
            query.createdtime = new Date().getTime();
            if (req.user.role !== 1) {
                logger.info("not admin")
                query.seller = req.user._id;
            }
            response = await productservice.addProduct(query);
        }

        res.status(200).json({
            error_code: 0,
            message: process.env.SUCCESS,
            data: response.data
        });

    } catch (err) {
        logger.info(err)
        res.status(200).json({
            error_code: 11,
            message: err.message,
            data: err
        });
    }

}


async function addProductlistHome(req, res) {
    let query = req.body;
    logger.debug("add addProductlistHome Ctrl", query);
    try {
        let response;
        //delete
        if (query.delete) {
            response = await productservice.deleteProductListHome(query);
        }
        //update
        else if (query._id) {
            query.updatedtime = new Date().getTime();
            response = await productservice.updateProductListHome(query);
        }
        else {
            //save
            query.status = 1;
            query.createdtime = new Date().getTime();
            response = await productservice.addProductLISThome(query);
        }

        res.status(200).json({
            error_code: 0,
            message: process.env.SUCCESS,
            data: response.data
        });

    } catch (err) {
        logger.info(err)
        res.status(200).json({
            error_code: 11,
            message: err.message,
            data: err
        });
    }

}

async function getProductlist(req, res) {
    let query = req.body;
    logger.info("getProductlist ctrl", query);

    try {
        let response = await productservice.getProductlist(query);
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


async function getProductlistHome(req, res) {
    let query = req.body;
    logger.info("getProductlistHome ctrl", query);

    try {
        let response = await productservice.getProductlistHome(query);
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
    addProduct, getProductlist, addProductlistHome, getProductlistHome
}