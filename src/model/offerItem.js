let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');

let OfferItemSchema = mongoose.Schema({
    createdtime: { type: Number },
    updatedtime: { type: Number },
    offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer",
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
    },
});
OfferItemSchema.plugin(mongoosePaginate);

let OfferItem = mongoose.model('OfferItem', OfferItemSchema);
module.exports = OfferItem;