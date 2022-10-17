"use strict";
const MISC = require("./miscService.js");
const User = require("../model").User;
const bcrypt = require('bcrypt');
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
var mongoose = require('mongoose');

async function userSign(query) {
    logger.debug("signupUser Service", query);
    try {
        let UserNew = new User();
        for (let prop in query) {
            if (query.hasOwnProperty(prop)) {
                UserNew[prop] = query[prop];
            }
        }

        if (UserNew.phone ) {

            console.log(UserNew, "////");
            let savedData = await User.findOne({ phone: UserNew.phone, status: 1, role: query.role });
            if (savedData) {
                throw MISC.response(-11, process.env.ALREADY_EXIST, {});
            }
            let data = await UserNew.save();
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

async function loginUser(query) {
    logger.debug("loginUser Service", query);

    if (query.phone && query.role) {
        try {
            let savedData = await User.findOne({ phone: query.phone, status: 1, role: query.role });
            logger.info(savedData, "savedData")
            if (savedData) {
                if (bcrypt.compareSync(query.password, savedData.hash_password)) {
                    return MISC.response(0, process.env.SUCCESS, savedData);
                }
                else {
                    throw MISC.response(-11, process.env.AUTHENTICATION_FAILED, {});
                }
                // if (savedData.authenticate(query.password)) {
                //     return MISC.response(0, process.env.SUCCESS, savedData);
                // }
                // else {
                //     throw MISC.response(-11, process.env.AUTHENTICATION_FAILED, {});
                // }
            }
            else {
                throw MISC.response(-11, process.env.REGISTER_MSG, {});
            }
        }
        catch (err) {
            logger.info(err, "service error")
            throw MISC.response(-11, err.message, {});
        }
    }
    else {
        throw MISC.response(-11, process.env.ENTER_VALIED_DATA, {});
    }
}



async function saveOrUdpateUser(userData) {
    console.log("saveOrUdpateUser service", userData);

    if (!userData._id) {
        userData._id = new mongoose.mongo.ObjectID();
        userData.status = 1;
    }
    if (userData.email == "") {
        delete userData.email;
    }
    if (userData.password == "") {
        delete userData.password;
    }

    try {
        let data = await User.findByIdAndUpdate(userData._id, userData, { upsert: true, new: true },);
        return MISC.response(0, process.env.SUCCESS, data);
    } catch (error) {
        logger.info(error)
        throw MISC.response(-11, process.env.ALREADY_EXIST, {});
    }
}


// async function updateCity(dataObj) {
//     try {
//         let data = await City.findByIdAndUpdate(
//             dataObj._id,
//             dataObj,
//             { upsert: false, new: false }).exec();

//         return MISC.response(0, MESSAGE_CONSTANT.SUCCESS, data);
//     } catch (err) {

//         let err_response = MISC.mongoResponse(
//             err,
//             MESSAGE_CONSTANT.ENTER_VALIED_DATA,
//             MESSAGE_CONSTANT.ALREADY_USED,
//             "");

//         throw MISC.response(-11, MESSAGE_CONSTANT.ERROR, err_response);
//     }

// }

async function userList(query) {
    logger.info("enter userList service", query);


    let newquery = {};
    for (let key in query) {
        if (query.hasOwnProperty(key)) {
            if (typeof query[key] !== "object") {
                console.log("haaai")
                newquery[key] = query[key];
            }
        }
    }
    if (query._id) {
        let _id = mongoose.Types.ObjectId(query._id);
        newquery._id = _id;
    }
    if (query.searchKey) {
        newquery.$or = [
            { name: { $regex: ".*" + query.searchKey + ".*", "$options": "i" } },
            { phone: { $regex: ".*" + query.searchKey + ".*", "$options": "i" } },
        ];
    }
    delete newquery.searchKey; //for empty space

    if (!query.pageVo) {
        query.pageVo = {};
        query.pageVo.pageNo = 1;
        query.pageVo.noOfItems = 10;
    }
    if (!query.pageVo.pageNo) {
        query.pageVo.noOfItems = 1
    }
    try {
        console.log("newquery", newquery)
        let skip = (query.pageVo.pageNo - 1) * query.pageVo.noOfItems;
        let users = await User.aggregate([
            {
                $match: newquery,
            },
            {
                $facet: {
                    paginationitems: [
                        { $count: "total" },
                        { $addFields: { page: { page: query.pageVo.pageNo } } },
                    ],
                    data: [{ $skip: skip }, { $limit: query.pageVo.noOfItems }],
                },
            },
        ]);
        let docs = {};
        let returnArray = [];
        let returndata = {};

        if (users && users[0] && users[0].data && users[0].data.length > 0) {
            console.log(users[0].data, "....");
            let paginatedata = users[0].data; //userarrrys
            let paginationitems = users[0].paginationitems; //userarrrys

            for (let i = 0; i < paginatedata.length; i++) {
                // docs = await User.populate(userdata[0], {
                //     path: "state",
                // });
                returnArray.push(paginatedata[i]);
            }
            returndata.docs = returnArray;
            if (users[0].paginationitems) {
                let total = users[0].paginationitems[0].total;
                let limitno = query.pageVo.noOfItems;
                let ans = total / limitno;
                let a = Math.ceil(ans);

                returndata.total = users[0].paginationitems[0].total;
                returndata.page =
                    users[0].paginationitems[0].page &&
                    users[0].paginationitems[0].page.page;
                returndata.pages = a;
            }
        }

        return MISC.response(0, process.env.COMPLETED, returndata);
    } catch (err) {
        logger.info(err, "errr")
        let err_response = MISC.response(
            -11,
            process.env.ERROR,
            "");
        throw MISC.response(-11, process.env.ERROR, err_response);
    }

}

async function deleteUser(userData) {
    logger.info(" deleteUser service", userData);
    let _id = mongoose.Types.ObjectId(userData._id);

    try {
        User.remove({ _id: _id }).exec();
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


module.exports = {
    userSign, loginUser, saveOrUdpateUser, userList, deleteUser
};

