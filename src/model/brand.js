let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');

// type main:1 sub:2 chid:3 if we need
let BrandSchema = mongoose.Schema({
    createdtime: { type: Number },
    updatedtime: { type: Number },
    status: { type: Number },
    name: { type: String, trim: true, unique: true, required: true },
    description: { type: String},
    logo: { type: String, trim: true },
    mobile_banners: { type: Array },
    web_banners: { type: Array },
    background_color: { type: String, trim: true },
    home_visibility: { type: Boolean, trim: true },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    createdby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
});
BrandSchema.plugin(mongoosePaginate);

let Brand = mongoose.model('Brand', BrandSchema);
module.exports = Brand;