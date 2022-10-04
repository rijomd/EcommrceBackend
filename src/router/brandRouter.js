var express = require('express')
var router = express.Router(); //for routing or can use directly from express

let authCtrl = require("../controller/user/autherCntrol");
let brandCtrl = require("../controller/Brand/brandCtrl");
router.post("/addBrand", authCtrl.autherization, brandCtrl.addBrand);
router.post("/brandList", brandCtrl.getBrandList);

router.get('/', (req, res) => {
    res.status(200).json({
        message: `hello iam fine`
    })
})


module.exports = router;
