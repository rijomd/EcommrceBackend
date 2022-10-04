var express = require('express')
var router = express.Router(); //for routing or can use directly from express


let wishListCtrol = require("../controller/Wishlist/wishlistCtrl");
let { autherization } = require("../controller/user/autherCntrol");

router.post("/wishlistadd", autherization, wishListCtrol.addWishList);
router.post("/getWishlist", autherization, wishListCtrol.getWishList);



module.exports = router;

