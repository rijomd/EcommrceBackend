let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');

let OfferSchema = mongoose.Schema({
    createdtime: { type: Number },
    updatedtime: { type: Number },
    status: { type: Number },
    start_date: { type: Number, required: true },
    offer_item: { type: Number, required: true }, //offer percantage
    end_date: { type: Number, required: true },
    name: { type: String, trim: true, unique: true, required: true },
    thumb_nail: { type: String },
    description: { type: String },
    logo: { type: String, trim: true },
    mobile_banners: { type: Array },
    web_banners: { type: Array },
    background_color: { type: String, trim: true },
});
OfferSchema.plugin(mongoosePaginate);

let Offer = mongoose.model('Offer', OfferSchema);
module.exports = Offer;