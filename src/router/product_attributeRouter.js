var express = require('express')
var router = express.Router(); //for routing or can use directly from express


let product_atributesCtrl = require("../controller/Product_Attribute/product_atributesCtrl");
let {  autherization } = require("../controller/user/autherCntrol");

router.post("/product_atributesAdd", autherization, product_atributesCtrl.addProduct_atributes);
router.post("/product_atributesList", product_atributesCtrl.getProduct_atributes);



module.exports = router;

