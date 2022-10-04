let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');

let CartSchema = mongoose.Schema({
    createdtime: { type: Number },
    updatedtime: { type: Number },
    status: { type: Number },
    quantity: { type: Number },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },

});
CartSchema.plugin(mongoosePaginate);
let Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;