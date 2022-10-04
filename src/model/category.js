let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');

// type main:1 sub:2 chid:3 if we need
let categorySchema = mongoose.Schema({
    createdtime: { type: Number },
    updatedtime: { type: Number },
    status: { type: Number },
    type: { type: Number },
    name: { type: String, trim: true, unique: true, required: true },
    description: { type: String},
    image: { type: String, trim: true },
    mobile_banners: { type: Array },
    web_banners: { type: Array },
    background_color: { type: String, trim: true },
    home_visibility: { type: Boolean, trim: true },
    parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    createdby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    // childs: { type: Array },
    childs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    }],
});
categorySchema.plugin(mongoosePaginate);
let Category = mongoose.model('Category', categorySchema);
module.exports = Category;