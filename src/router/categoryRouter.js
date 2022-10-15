var express = require('express')
var router = express.Router(); //for routing or can use directly from express


let categoryCtrl = require("../controller/category/categoryCntrol");
let { multerUpload, autherization } = require("../controller/user/autherCntrol");

router.post("/categoryAdd", autherization, multerUpload.single("category"), categoryCtrl.addCategory);
router.post("/categoryList", categoryCtrl.getCategoryList);
router.post("/categoryAllList", categoryCtrl.getCategoryAllList);




module.exports = router;

