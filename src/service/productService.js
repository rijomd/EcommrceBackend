"use strict";
const MISC = require("./miscService.js");
const Products = require("../model").Products;
const ProductsHome = require("../model").Producthome;
const Category = require("../model").Category;
const Productvarient = require("../model").Product_varient;
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
var mongoose = require('mongoose');
const productVarientservice = require("./productVarientService");


async function productsIntoHome(product_id, hometype_id, previoushome_id) {
    logger.debug(product_id, "productid", hometype_id, "add productsIntoHome Service", previoushome_id);

    let hometypesData = await ProductsHome.findOne({ _id: hometype_id }).lean();
    let myarray = [];

    // adding new one
    if (hometypesData.products_id) {
        logger.debug(hometypesData.products_id, "hometypesData");
        let new_id = mongoose.Types.ObjectId(product_id);
        if (hometypesData.products_id.length > 0) {
            myarray = hometypesData.products_id;
        }
        //already exist then
        for (let i = 0; i < myarray.length; i++) {
            if (new_id.equals(myarray[i])) {
                return true;
            }
        }
        //if new one
        myarray.push(product_id);
        hometypesData.products_id = myarray;
        await ProductsHome.findOneAndUpdate({ _id: hometype_id }, hometypesData).exec();
    }
    // updating 
    if (previoushome_id && previoushome_id !== "0") {
        if (previoushome_id !== hometype_id) {
            logger.debug("updaing");
            let hometypesData = await ProductsHome.findOne({ _id: previoushome_id }).lean();
            if (hometypesData) {
                let new_id = mongoose.Types.ObjectId(product_id);
                let myarray = hometypesData.products_id;
                logger.debug(myarray, "myarray");
                for (let i = 0; i < myarray.length; i++) {
                    if (new_id.equals(myarray[i])) {
                        myarray.splice(i, 1);
                    }
                }
                hometypesData.products_id = myarray;
                logger.debug(hometypesData, "updaing");

                await ProductsHome.findOneAndUpdate({ _id: previoushome_id }, hometypesData).exec();
            }
        }
    }

}
async function productsdeleteFromHome(product_id, hometype_id) {
    logger.debug(hometype_id, "add productsdeleteFromHome Service", product_id);
    let new_id = mongoose.Types.ObjectId(product_id);
    let hometypesData = {};

    if (hometype_id) {

        hometypesData = await ProductsHome.findOne({ _id: hometype_id }).lean();
        logger.info(hometypesData, "hometypesData");
        let myarray = [];
        if (hometypesData.products_id) {
            logger.debug(hometypesData.products_id, "hometypesData")
            if (hometypesData.products_id.length > 0) {
                myarray = hometypesData.products_id;
                for (let i = 0; i < myarray.length; i++) {
                    if (new_id.equals(myarray[i])) {
                        myarray.splice(i, 1);
                    }
                }
            }
        }
        logger.info(myarray, "myarray");
        hometypesData.products_id = myarray;

        await ProductsHome.findOneAndUpdate({ _id: hometype_id }, hometypesData).exec();
    }

}
async function addProduct(querys) {
    let query = JSON.parse(JSON.stringify(querys));
    logger.debug("add Products Service", query);

    try {
        let ProductsNew = new Products();
        for (let prop in query) {
            if (query.hasOwnProperty(prop)) {
                ProductsNew[prop] = query[prop];
            }
        }
        if (ProductsNew.name) {
            //finds already existing data
            let savedData = await Products.findOne({ name: ProductsNew.name, status: 1 });
            if (savedData) {
                throw MISC.response(-11, process.env.ALREADY_EXIST, {});
            }
            // save datas in product table
            let data = await ProductsNew.save();

            //adding product varients (if it is single or multi varients)
            if (data._id) {
                logger.info("product varients");
                await productVarientservice.addProductvarients(data._id, query.varients);
                // saves product into productlist in home section
                if (query.hometype) {
                    let varient = await Productvarient.find({ product: data._id }).lean();
                    if (varient.length > 0) {
                        logger.info(varient[0]._id, "varient");
                        await productsIntoHome(varient[0]._id, querys.hometype);
                    }
                }
            }
            return MISC.response(0, process.env.SUCCESS, data);
        }
        else {
            throw MISC.response(-11, process.env.ENTER_VALIED_DATA, {});
        }
    } catch (err) {
        logger.info(err, "service error")
        throw MISC.response(-11, err.message, {});
    }
}
async function updateProduct(dataObj) {
    logger.info(dataObj._id, "enter updateProduct service", dataObj.previoushomeId)
    try {


        // adding into productlisthome category for listing products in home
        if (dataObj.homevisibilty == true) {
            logger.info("true")
            let varient = await Productvarient.find({ product: dataObj._id }).lean();
            if (varient) {
                logger.info("true", varient[0]._id)
                await productsIntoHome(varient[0]._id, dataObj.hometype, dataObj.previoushomeId);
            }
        }
        // deleteing from productlisthome category for listing products in home
        if (dataObj.homevisibilty == false) {
            logger.info("false");
            // parseInt(dataObj.hometype);
            if (dataObj.hometype !== "0") {
                logger.info("false2");
                let varient = await Productvarient.find({ product: dataObj._id }).lean();
                await productsdeleteFromHome(varient[0]._id, dataObj.hometype);
                dataObj.hometype = 0;
            }
        }
        //updating simple product (only one varient)
        if (dataObj.type_product === "single" && dataObj.varients && dataObj.varients.length > 0) {
            await productVarientservice.varientsEdit(dataObj.varients[0]);
        }
        // updating multiple varients 
        if (dataObj.type_product === "multi") {
            await productVarientservice.multivarientsEdit(dataObj._id, dataObj.varients, dataObj.edit_Varients);
        }

        // updating product table
        let data = await Products.findByIdAndUpdate(
            dataObj._id,
            dataObj,
            { upsert: false, new: false }).exec();
        return MISC.response(0, process.env.SUCCESS, data);

    } catch (err) {
        logger.info(err);
        let err_response = MISC.response(
            err,
            "");

        throw MISC.response(-11, process.env.ERROR, err_response);
    }

}
async function deleteProduct(ProductsData) {
    logger.info(" deleteProduct service", ProductsData);
    let _id = mongoose.Types.ObjectId(ProductsData._id);

    try {
        let varient = await Productvarient.find({ product: ProductsData._id }).lean();
        if (varient.length > 0) {
            if (ProductsData.hometype) {
                await productsdeleteFromHome(varient[0]._id, ProductsData.hometype);   //delete from producthome category 
            }
            await productVarientservice.deleteVarientFromProduct(ProductsData._id);  //delete varients
            await Products.remove({ _id: _id }).exec(); //deletes from product table
        }
    } catch (error) {
        logger.info(error, "error")
        let err_response = MISC.response(
            -11,
            process.env.ERROR,
            "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }
    return MISC.response(0, process.env.COMPLETED, {});
}

async function getProductlist(query) {
    logger.info("enter getProductlist service", query);


    let newquery = {};
    for (let key in query) {
        if (query.hasOwnProperty(key)) {
            if (typeof query[key] !== "object") {
                newquery[key] = query[key];
            }
        }
    }
    if (query._id) {
        let _id = mongoose.Types.ObjectId(query._id);
        newquery._id = _id;
    }
    if (query.searchKey) {
        newquery.$or = [{ name: { $regex: ".*" + query.searchKey + ".*", "$options": "i" } }];
        delete query.searchKey;
        delete newquery.searchKey;
    }
    // filter option from admin 
    if (query.filter) {
        if (query.filtername === "category") {
            newquery.$or = [{ category: { $in: query.filter } }];
        }
        if (query.filtername === "seller") {
            newquery.$or = [{ seller: { $in: query.filter } }];
        }
        if (query.filtername === "brand") {
            newquery.$or = [{ brand: { $in: query.filter } }];
        }
        if (query.filtername === "visibility") {
            newquery.$or = [{ hometype: { $in: query.filter } }];
        }
        delete newquery.filtername;
        delete newquery.filter;
    }


    if (!query.pageVo) {
        query.pageVo = {};
        query.pageVo.pageNo = 1;
        query.pageVo.noOfItems = 10;
    }
    if (!query.pageVo.pageNo) {
        query.pageVo.noOfItems = 1
    }
    try {
        console.log("newquery", newquery);

        let conditions = { page: query.pageVo.pageNo, limit: query.pageVo.noOfItems, lean: true, populate: ["category", "seller", "brand"], sort: [['name', 'asc']] };
        let data = await Products.paginate(newquery, conditions);


        return MISC.response(0, process.env.COMPLETED, data);
    } catch (err) {
        logger.info(err, "errr")
        let err_response = MISC.response(
            -11,
            process.env.ERROR,
            "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }

}






async function addProductLISThome(querys) {
    let query = JSON.parse(JSON.stringify(querys));
    logger.debug("add addProductLISThome Service", query);
    try {
        let ProductsHomeNew = new ProductsHome();
        for (let prop in query) {
            if (query.hasOwnProperty(prop)) {
                ProductsHomeNew[prop] = query[prop];
            }
        }
        logger.debug("ProductsHomeNew", ProductsHomeNew);
        if (ProductsHomeNew.name) {
            let data = await ProductsHomeNew.save();
            if (data) {
                let returndata = await getProductlistHome({ status: 1 });
                return returndata;
            }
        }
        else {
            throw MISC.response(-11, process.env.ENTER_VALIED_DATA, {});
        }
    } catch (err) {
        logger.info(err, "service error")
        throw MISC.response(-11, err.message, {});
    }
}
async function updateProductListHome(dataObj) {
    logger.info("enter updateProductListHome service", dataObj)
    try {
        let data = await ProductsHome.findByIdAndUpdate(
            dataObj._id,
            dataObj,
            { upsert: false, new: false }).exec();
        if (data) {
            let returndata = await getProductlistHome({ status: 1 });
            return returndata;
        }
    } catch (err) {

        let err_response = MISC.mongoResponse(
            err,
            MESSAGE_CONSTANT.ENTER_VALIED_DATA,
            MESSAGE_CONSTANT.ALREADY_USED,
            "");

        throw MISC.response(-11, MESSAGE_CONSTANT.ERROR, err_response);
    }

}
async function deleteProductListHome(ProductsData) {
    logger.info(" deleteProductListHome service", ProductsData);
    let _id = mongoose.Types.ObjectId(ProductsData._id);
    try {
        ProductsHome.remove({ _id: _id }).exec();
        let returndata = await getProductlistHome({ status: 1 });
        return returndata;
    } catch (error) {
        logger.info(error, "error")
        let err_response = MISC.response(
            -11,
            process.env.ERROR,
            "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }

}
async function getProductlistHome(query) {
    logger.info("enter getProductlistHome service", query);
    let newquery = {};
    for (let key in query) {
        if (query.hasOwnProperty(key)) {
            if (typeof query[key] !== "object") {
                newquery[key] = query[key];
            }
        }
    }
    if (query._id) {
        let _id = mongoose.Types.ObjectId(query._id);
        newquery._id = _id;
    }
    if (!query.pageVo) {
        query.pageVo = {};
        query.pageVo.pageNo = 1;
        query.pageVo.noOfItems = 10;
    }
    if (!query.pageVo.pageNo) {
        query.pageVo.noOfItems = 1
    }
    if (query.searchKey) {
        newquery.$or = [{ name: { $regex: ".*" + query.searchKey + ".*", "$options": "i" } }];
    }
    try {
        console.log("newquery", newquery);
        let conditions = { page: query.pageVo.pageNo, limit: query.pageVo.noOfItems, lean: true, populate: ["products_id"] };
        let data = await ProductsHome.paginate(newquery, conditions);

        return MISC.response(0, process.env.COMPLETED, data);
    } catch (err) {
        logger.info(err, "errr")
        let err_response = MISC.response(
            -11,
            process.env.ERROR,
            "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }
}


module.exports = {
    addProduct, updateProduct, getProductlist, deleteProduct,
    deleteProductListHome, updateProductListHome, addProductLISThome, getProductlistHome,
};

