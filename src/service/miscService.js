const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";


const response =  (error_code, message, data) => {
    return {
        error_code: error_code,
        message: message,
        data: data
    }
}

module.exports = {
    response :response
}
