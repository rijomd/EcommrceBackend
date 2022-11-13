let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');

let OrderSchema = mongoose.Schema({
    createdtime: { type: Number },
    updatedtime: { type: Number },
    status: { type: Number },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    product_varient: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product_varient",
    }],
    address_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
    },
    razorpay: {
        orderId: String,
        paymentId: String,
        signature: String
    },
    order_status: { type: Boolean },
    paid_status: { type: Boolean },
    cod_delivery: { type: Boolean },
    comment: { type: String },
    quantity: { type: Number },
    total_price: { type: Number },
    transaction_id: { type: String },
    delivered_date: { type: Number },
    order_date: { type: Number },
    shiping_date: { type: Number },
});
OrderSchema.plugin(mongoosePaginate);
let Order = mongoose.model('Order', OrderSchema);
module.exports = Order;