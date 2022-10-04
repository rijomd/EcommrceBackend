"use strict";
const categoryService = require("../../service/categoryService");
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
var slugify = require('slugify')
var mongoose = require('mongoose');


async function addCategory(req, res) {
    let query = req.body;
    logger.debug("add addCategory Ctrl", query);

    if (query.parent_id == "") {
        delete query.parent_id;
    }
    try {
        let response;
        //delete
        if (query.delete) {
            response = await categoryService.deletecategory(query);
        }
        //update
        else if (query._id) {
            query.updatedtime = new Date().getTime();
            response = await categoryService.updateCategory(query);
        }
        else {
            //save
            query.status = 1;
            query.createdtime = new Date().getTime();
            if (req.user.role !== 1) {
                logger.info("not admin")
                query.createdby = req.user._id;
            }
            response = await categoryService.addCategory(query);
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

//listing category
async function getCategoryList(req, res) {
    let query = req.body;
    logger.info("getCategoryList ctrl", query);
    try {
        let response = await categoryService.getCategoryList(query); //for ordinory listing
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

//get all category for home page website  need to change
const getCategoryAllList = async (req, res) => {
    logger.info("getCategoryAllList cntrol", req.body);
    let query = req.body;
    let response;
    try {
        if (query.flexible) {
            response = await categoryService.getFlexibleCateList(query); //for flexible home categories (change by requirements)
        }
        else {
            response = await categoryService.getCategoryAllList(query); //for menuheader
        }
        res.status(200).json({
            error_code: 0,
            message: process.env.SUCCESS,
            data: response.data
        });
    }
    catch (error) {
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
    addCategory, getCategoryList, getCategoryAllList
}