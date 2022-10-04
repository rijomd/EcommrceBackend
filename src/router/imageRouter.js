var express = require('express')
var router = express.Router(); //for routing or can use directly from express


let imageCtrl = require("../controller/Images/imageCntrol");
let { multerUpload, autherization } = require("../controller/user/autherCntrol");

router.post("/imageAdd", autherization, multerUpload.array("file"), imageCtrl.addImages);
router.post("/imagelist", autherization, imageCtrl.getImageList);



module.exports = router;

