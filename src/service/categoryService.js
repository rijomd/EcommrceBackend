"use strict";
const MISC = require("./miscService.js");
const Category = require("../model").Category;
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
var mongoose = require('mongoose');


async function updateChildArray(parent_id, childid, previousparent) {
    logger.debug(" updateChildArray Service parent_id==", parent_id, "childid=", childid, "previousparent=", previousparent);

    let _id = mongoose.Types.ObjectId(parent_id);
    let parentdata = await Category.findOne({ _id: _id });

    //adding into childs
    if (parentdata.name) {
        let childArray = parentdata.childs ? parentdata.childs : [];
        childArray.push(childid);
        parentdata.childs = childArray;
        await Category.findByIdAndUpdate(
            parent_id,
            parentdata,
            { upsert: false, new: false }).exec();
    }

    //deleting chid from previous parent
    if (previousparent) {
        logger.info("changed parent");
        let id = mongoose.Types.ObjectId(previousparent);
        let previous_parentData = await Category.findOne({ _id: id });

        if (previous_parentData.childs) {
            let childArray = previous_parentData.childs
            logger.info("changed parent", childArray);
            for (let i = 0; i < childArray.length; i++) {
                if (childArray[i] == childid) {
                    childArray.splice(i, 1);
                }
            }
            previous_parentData.childs = childArray;
            logger.info(previous_parentData, "parentdeleted", parent_id)
            await Category.findByIdAndUpdate(
                previousparent,
                previous_parentData,
                { upsert: false, new: false }).exec();  //for parent 
            await Category.findByIdAndUpdate(
                childid,
                { parent_id: parent_id },
                { upsert: false, new: false }).exec(); //for child change parent id
        }
    }
    return parentdata;
}

async function addCategory(querys) {
    let query = JSON.parse(JSON.stringify(querys));
    logger.debug("add Category Service", query);
    let type;

    try {
        let CategoryNew = new Category();
        for (let prop in query) {
            if (query.hasOwnProperty(prop)) {
                CategoryNew[prop] = query[prop];
            }
        }

        if (CategoryNew.name) {
            console.log(CategoryNew, "////");
            let savedData = await Category.findOne({ name: CategoryNew.name, status: 1 });
            if (savedData) {
                throw MISC.response(-11, process.env.ALREADY_EXIST, {});
            }
            let data = await CategoryNew.save();
            //add chidid to parent childs when parent_id exist
            if (query.parent_id) {
                await updateChildArray(query.parent_id, data._id);
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






async function updateCategory(dataObj) {
    logger.info("enter updatecategory service", dataObj);
    let data;
    try {
        if (dataObj.new_parentid) {
            if (dataObj.parent_id && (dataObj.parent_id._id !== dataObj.new_parentid)) {
                logger.info("change parent and update childs");
                data = await updateChildArray(dataObj.new_parentid, dataObj._id, dataObj.parent_id._id); //update parent
            }
            // if (!dataObj.parent_id) {
            //     await updateChildArray(dataObj.new_parentid, dataObj._id);
            //     dataObj.parent_id = dataObj.new_parentid;
            //     dataObj.type = 2;
            //     await Category.findByIdAndUpdate(
            //         dataObj._id,
            //         dataObj,
            //         { upsert: false, new: false }).exec();
            // }
        }
        else {
            data = await Category.findByIdAndUpdate(
                dataObj._id,
                dataObj,
                { upsert: false, new: false }).exec();
        }
        return MISC.response(0, process.env.SUCCESS, data);
    } catch (err) {
        logger.info("errr", err)
        let err_response = MISC.response(
            err,
            "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }

}

async function getCategoryList(query) {
    logger.info("enter getCategoryList service", query);
    let newquery = {};
    for (let key in query) {
        if (query.hasOwnProperty(key)) {
            if (typeof query[key] !== "object") {
                newquery[key] = query[key];
            }
        }
    }
    if (query.main) {
        newquery.type = query.main;   //for gets categories in add products 
        delete newquery.main;
    }
    //for subcategorylisting
    if (query.parent) {
        newquery.type = { $in: [1, 2] }
        newquery._id = { $ne: query.category_id }
        delete query.parent;
        delete newquery.parent;
        delete newquery.category_id;
    }
    if (query.parent_id) {
        delete query.type;
        delete newquery.type;
        newquery.parent_id = mongoose.Types.ObjectId(query.parent_id);;
    }
    if (query._id) {
        let _id = mongoose.Types.ObjectId(query._id);
        newquery._id = _id;
    }
    if (query.searchKey) {
        newquery.$or = [{ name: { $regex: ".*" + query.searchKey + ".*", "$options": "i" } }];
    }
    delete query.searchKey;
    delete newquery.searchKey;

    if (!query.pageVo) {
        query.pageVo = {};
        query.pageVo.pageNo = 1;
        query.pageVo.noOfItems = 20;
    }
    if (!query.pageVo.pageNo) {
        query.pageVo.noOfItems = 1
    }
    try {
        // newquery.name = { $sort: "asc" }
        console.log("newquery", newquery);
        let conditions = { page: query.pageVo.pageNo, limit: query.pageVo.noOfItems, lean: true, populate: ["childs", "parent_id"], sort: [['name', 'asc']] };
        let data = await Category.paginate(newquery, conditions);

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







async function deletecategory(CategoryData) {
    logger.info(" deleteCategory service", CategoryData);
    let _id = mongoose.Types.ObjectId(CategoryData._id);

    try {
        let data = await childDeletionofParent(CategoryData._id);//if parent id exist removes id from childs from parent
        if (data) {
            await Category.remove({ _id: _id }).exec();
        }
        return MISC.response(0, process.env.COMPLETED, {});
    } catch (error) {
        logger.info(error, "error")
        let err_response = MISC.response(
            -11,
            process.env.ERROR,
            "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }

}
async function childDeletionofParent(categoryid) {
    logger.info(" childDeletionofParent service", categoryid);

    let category = await Category.findById(categoryid);
    if (category.parent_id) {
        let parentid = category.parent_id;
        let parentData = await Category.findById(parentid);

        if (parentData.childs) {
            let childArray = parentData.childs
            logger.info(" child array", childArray);
            for (let i = 0; i < childArray.length; i++) {
                if (childArray[i] == categoryid) {
                    childArray.splice(i, 1);
                }
            }
            parentData.childs = childArray;
            await Category.findByIdAndUpdate(
                parentid,
                parentData,
                { upsert: false, new: false }).exec();  //for parent 
        }
    }
    return "success";
}







//for listing all categories for home menubar
const getCategoryAllList = async (query) => {
    logger.info("getCategoryAllList service", query);
    try {
        //getting maincategory
        let newquery = {
            status: 1,
        }
        let categories = await Category.find(newquery).exec();
        let list = await createCatList(categories);
        console.log(list, "list")

        return MISC.response(0, process.env.COMPLETED, list);
    }
    catch (error) {
        logger.info(error, "error")
        let err_response = MISC.response(
            -11,
            process.env.ERROR,
            "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }
}


async function createCatList(categories, parent_id = null) {
    let categoryList = [];
    let category = [];



    if (parent_id == null) {
        category = categories.filter((cat) => cat.parent_id == undefined);
    } else {
        let compareid = parent_id.toString();
        category = categories.filter((cat) => cat.parent_id == compareid);
    }
    for (let cate of category) {
        let objnew = {
            _id: cate._id,
            name: cate.name,
            type: cate.type,
            // parent_id: cate.parent_id,
            image: cate.image,
            children: await createCatList(categories, cate._id),
        };
        categoryList.push(objnew);
    }
    return categoryList;
}










const getFlexibleCateList = async (query) => {
    logger.info("getFlexibleCateList serivce", query);
    delete query.flexible;
    let returnarray = [];

    try {
        let categorylist = await Category.find(query).lean();
        for (let category of categorylist) {
            if (category.childs && category.childs.length > 0) {
                let childarray = await getChildArray(category.childs);
                category.childs = childarray;
                // category['childarray'] = childarray;
                returnarray.push(category);
            }
        }
        return MISC.response(0, process.env.COMPLETED, returnarray);
    }
    catch (error) {
        logger.info(error, "error")
        let err_response = MISC.response(
            -11,
            process.env.ERROR,
            "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }
}
const getChildArray = async (childarray) => {
    let newquery = {};
    newquery._id = { $in: childarray }

    let childCategorys = await Category.aggregate([
        {
            $match: newquery,
        },
        {
            "$project": {
                "_id": 1,
                "name": 1,
                "image": 1
            }
        },
    ]);
    // logger.info(childCategorys, "childCategorys");
    return childCategorys;
}






module.exports = {
    addCategory, updateCategory, getCategoryList, deletecategory, updateChildArray, getCategoryAllList, getFlexibleCateList
};

