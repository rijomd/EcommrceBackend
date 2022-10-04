let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');

let WishSchema = mongoose.Schema({
    createdtime: { type: Number },
    updatedtime: { type: Number },
    status: { type: Number },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },

});
WishSchema.plugin(mongoosePaginate);
let Wish = mongoose.model('Wish', WishSchema);
module.exports = Wish;