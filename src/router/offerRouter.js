var express = require('express')
var router = express.Router(); //for routing or can use directly from express

let authCtrl = require("../controller/user/autherCntrol");
let offerCtrl = require("../controller/Offer/oferCtrl");
let offerItemCtrl = require("../controller/Offer/offerItemCtrl");

router.post("/addOffer", authCtrl.autherization, offerCtrl.addOffer);
router.post("/offerList", offerCtrl.getOfferList);
router.post("/addOfferItm", authCtrl.autherization, offerItemCtrl.addOfferItem);
router.post("/offerItemList", offerItemCtrl.getOfferItemList);

router.get('/', (req, res) => {
    res.status(200).json({
        message: `hello iam fine`
    })
})


module.exports = router;
