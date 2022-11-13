var express = require('express')
var router = express.Router(); //for routing or can use directly from express


let orderCtrl = require("../controller/Order/orderCtrl");
let { autherization } = require("../controller/user/autherCntrol");

router.post("/addOrder", autherization, orderCtrl.addOrder);
router.post("/razorpay_key", autherization, orderCtrl.razorpayKey);
router.post("/createOrder", autherization, orderCtrl.createOrder); //onlin payment

router.post("/getOrder",autherization, orderCtrl.getOrderList);



module.exports = router;

