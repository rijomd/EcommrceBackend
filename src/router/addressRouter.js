var express = require('express')
var router = express.Router(); //for routing or can use directly from express


let addressCtrl = require("../controller/Adress/addressCtrl");
let { autherization } = require("../controller/user/autherCntrol");

router.post("/addressAdd", autherization, addressCtrl.addAddress);
router.post("/addressList", autherization, addressCtrl.getAddress);



module.exports = router;

