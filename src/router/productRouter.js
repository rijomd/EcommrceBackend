var express = require('express')
var router = express.Router(); //for routing or can use directly from express


let productCtrl = require("../controller/Product/producttrl");
let varientCtrl = require("../controller/Product/varientsCtrl");

let { multerUpload, autherization } = require("../controller/user/autherCntrol");

router.post("/productAdd", autherization, multerUpload.array("file"), productCtrl.addProduct);
router.post("/productlist", productCtrl.getProductlist);

router.post("/addproductlisthome", autherization, productCtrl.addProductlistHome);
router.post("/getproductlisthome", productCtrl.getProductlistHome);

router.post("/varientList", varientCtrl.varientList);
router.post("/varientsAdd", autherization, varientCtrl.varientsAdd);


module.exports = router;