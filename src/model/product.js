const mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');

const productSchema = new mongoose.Schema({
    createdtime: { type: Number },
    updatedtime: { type: Number },
    status: { type: Number },
    cod: { type: Boolean },
    name: {
        type: String,
        required: true,
        trim: true
    },
    short_desc: {
        type: String,
    },
    description: {
        type: String,
        trim: true
    },
    returnable: {
        type: Boolean
    },
    hometype: {
        type: String
    }, //shows in productlist home
    homevisibilty: { type: Boolean, trim: true },
    type_product: {
        type: String,
    },
    saved_Attributes: { type: Array },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

productSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Product', productSchema);