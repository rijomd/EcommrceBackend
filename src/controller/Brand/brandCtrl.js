"use strict";
const BrandService = require("../../service/BrandService");
const categoryService = require("../../service/categoryService");
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";

async function addBrand(req, res) {
    let query = req.body;
    logger.debug("add addBrand Ctrl", query);

    if (query.parent_id == "") {
        delete query.parent_id;
    }
    try {
        let response;
        //delete
        if (query.delete) {
            response = await BrandService.deleteBrand(query);
        }
        //update
        else if (query._id) {
            query.updatedtime = new Date().getTime();
            response = await BrandService.updateBrand(query);
        }
        else {
            //save
            query.status = 1;
            query.createdtime = new Date().getTime();
            query.createdby = req.user._id;
            response = await BrandService.addBrand(query);
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

//listing Brand
async function getBrandList(req, res) {
    let query = req.body;
    logger.info("getBrandList ctrl", query);
    let Category_ids = [];
    try {
        if (query.searchKey) {
            Category_ids = await getCategoryId(query.searchKey);
        }
        let response = await BrandService.getBrand(query, Category_ids); //for ordinory listing
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
    addBrand, getBrandList
}