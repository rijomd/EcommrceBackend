const mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');

const Product_varientSchema = new mongoose.Schema({
    createdtime: { type: Number },
    updatedtime: { type: Number },
    status: { type: Number },
    block_status: { type: Number },
    varient_name: { type: String },
    attributes: {
        type: Array,
    },
    atribute_value: {
        type: Array,
    },
    availabile_qty: {
        type: Number,
    },
    type_product: { type: String }, //same in product table filtration
    soldout_count: { type: Number },
    orginal_price: {
        type: Number,
        trim: true,
    },
    selling_price: {
        type: Number,
        trim: true,
        required: true
    },
    offer: {
        type: Number,
        trim: true,
    },
    productPictures:
        { type: Array },
    product_details: { type: Array },
    specifications: { type: Array },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },

}, { timestamps: true });

Product_varientSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Product_varient', Product_varientSchema);