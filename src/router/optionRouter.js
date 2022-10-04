var express = require('express')
var router = express.Router(); //for routing or can use directly from express


let optionCtrl = require("../controller/Options/optionCtrl");
let {  autherization } = require("../controller/user/autherCntrol");

router.post("/optionAdd", autherization, optionCtrl.addOptions);
router.post("/optionList", optionCtrl.getOptions);



module.exports = router;

