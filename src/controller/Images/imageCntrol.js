"use strict";
const imageService = require("../../service/imageServices");
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
var mongoose = require('mongoose');


async function addImages(req, res) {
    let query = req.body;
    logger.debug("add  addImages Ctrl", query);


    try {
        let response;
        //delete
        // if (query.delete) {
        //     response = await imageService.deletecategory(query);
        // }
        //update
        // else if (query._id) {
        //     query.updatedtime = new Date().getTime();
        //     response = await imageService.updateCategory(query);
        // }
        // else {
        //save
        query.status = 1;
        query.createdtime = new Date().getTime();

        if (req.files) {
            query.image = req.files[0].location;
            logger.info("files", req.files[0].location)
        }
        if (req.user) {
            query.user_id = req.user._id;
            logger.info("files", req.user._id)
        }
        // if (req.files.length > 0) {
        //     productPictures = req.files.map((file) => {
        //       return { img: file.location };
        //     });
        //   }
        response = await imageService.addImages(query);
        // }
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


async function getImageList(req, res) {
    let query = req.body;
    logger.info("getImageList ctrl", query);

    try {
        let response = await imageService.getImagesList(query);
        res.status(200).json({
            error_code: 0,
            message: process.env.SUCCESS,
            data: response.data
        });
    } catch (err) {
        logger.info(err, "error");
        res.status(200).json(
            {
                error_code: 11,
                message: err.message,
                data: err
            }
        )
    }
}

module.exports = {
    addImages, getImageList
}