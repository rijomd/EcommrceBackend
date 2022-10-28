var express = require('express');
var router = express.Router(); //for routing or can use directly from express


//userrouter
let userRoutes = require("../router/userRouter");
router.use(userRoutes);

//category
let categoryRouter = require("../router/categoryRouter");
router.use(categoryRouter);

//images
let imageRouter = require("../router/imageRouter");
router.use(imageRouter);

//products
let productRouter = require("../router/productRouter");
router.use(productRouter);

//options banner slider...etc
let optionRouter = require("../router/optionRouter");
router.use(optionRouter);

//wishlist
let wishlistRouter = require("../router/wishlistRouter");
router.use(wishlistRouter);

//cart
let cartRouter = require("../router/cartRouter");
router.use(cartRouter);

//address
let AddressRouter = require("../router/addressRouter");
router.use(AddressRouter);

//brands
let BrandRouter = require("../router/brandRouter");
router.use(BrandRouter);

//product attributes
let ProducattributesRouter = require("../router/product_attributeRouter");
router.use(ProducattributesRouter);


//offer
let OfferRouter = require("../router/offerRouter");
router.use(OfferRouter);


//order
let OrderRouter = require("../router/orderRouter");
router.use(OrderRouter);

module.exports = router



