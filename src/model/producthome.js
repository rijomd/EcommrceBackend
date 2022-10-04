const mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');

const ProducthomeSchema = new mongoose.Schema({
    createdtime: { type: Number },
    updatedtime: { type: Number },
    status: { type: Number },
    name: {
        type: String,
        required: true,
        trim: true, unique: true
    },
    products_id: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Product_varient' }
    ],

}, { timestamps: true });

ProducthomeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Producthome', ProducthomeSchema);