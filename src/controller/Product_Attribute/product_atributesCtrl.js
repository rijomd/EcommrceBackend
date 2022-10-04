"use strict";
const product_atributeService = require("../../service/product_atributeService");
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
var mongoose = require('mongoose');
const categoryService = require("../../service/categoryService");


async function addProduct_atributes(req, res) {
    let query = req.body;
    logger.debug("add addProduct_atributes Ctrl", query);

    try {
        let response;
        if (query.common === false) {
            console.log("hhhh")
            delete query.common;
        }
        //delete
        if (query.delete) {
            response = await product_atributeService.deleteAtributtes(query);
        }
        //update
        else if (query._id) {
            query.updatedtime = new Date().getTime();
            response = await product_atributeService.updateProduct_atributes(query);
        }
        else {
            //save
            query.status = 1;
            query.createdtime = new Date().getTime();
            response = await product_atributeService.addProduct_atributes(query);
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
const getCategoryId = async (searchKey) => {
    let Category_ids = [];
    let newquery = {
        pageVo: {
            pageNo: 1,
            noOfItems: 15,
        },
        status: 1,
        searchKey: searchKey
    };
    let catgeryArray = await categoryService.getCategoryList(newquery);
    if (catgeryArray && catgeryArray.data && catgeryArray.data.docs && catgeryArray.data.docs.length > 0) {
        logger.info(catgeryArray.data.docs, "docs");
        let newarray = catgeryArray.data.docs;
        for (let item of newarray) {
            Category_ids.push(item._id.toString());
        }
    }
    return Category_ids;
}

async function getProduct_atributes(req, res) {
    let query = req.body;
    logger.info("getProduct_atributes ctrl", query);
    let Category_ids = [];
    try {
        if (query.searchKey) {
            Category_ids = await getCategoryId(query.searchKey);
        }
        let response = await product_atributeService.getProduct_atributes(query, Category_ids);
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
    addProduct_atributes, getProduct_atributes
}