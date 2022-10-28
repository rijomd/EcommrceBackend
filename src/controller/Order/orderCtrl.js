"use strict";
const OrderService = require("../../service/orederService");
const CartService = require("../../service/cartService");
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";

async function addOrder(req, res) {
    let query = req.body;
    logger.debug("add addOrder Ctrl", query);

    try {
        let response;
        if (query.delete) {
            response = await OrderService.deleteOrder(query);
        }
        else if (query._id) {
            query.updatedtime = new Date().getTime();
            response = await OrderService.updateOrder(query);
        }
        else {
            query.status = 1;
            query.createdtime = new Date().getTime();
            query.order_date = new Date().getTime();
            if (req.user._id) {
                query.user_id = req.user._id;
                let datas = await CartService.getCart({ user_id: req.user._id });
                let varients = [];
                let carts = [];

                if (datas.data && datas.data.docs && datas.data.docs.length > 0) {
                    for (let item of datas.data.docs) {
                        varients.push(item.product_id._id);
                        carts.push(item._id);
                    }
                    query.product_varient = varients;
                }
                let orders = await OrderService.addOrder(query);
                if (orders.data) {
                    logger.info("successfully placed");
                    response = await CartService.deleteCart({ carts: carts, multi: true, user_id: req.user._id });
                }
            }
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


async function getOrderList(req, res) {
    let query = req.body;
    logger.info("getOrderList ctrl", query);
    if (req.user._id && req.user.role !== 1) {
        query.user_id = req.user._id;
    }
    try {
        let response = await OrderService.getOrderList(query);
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
    addOrder, getOrderList
}