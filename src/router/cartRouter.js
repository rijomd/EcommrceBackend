var express = require('express')
var router = express.Router(); //for routing or can use directly from express


let cartCtrol = require("../controller/cart/cartCtrl");
let { autherization } = require("../controller/user/autherCntrol");

router.post("/cartadd", autherization, cartCtrol.addCart);
router.post("/cartList", autherization, cartCtrol.getCart);



module.exports = router;

