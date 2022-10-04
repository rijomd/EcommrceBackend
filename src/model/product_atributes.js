let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');

let Product_atributesSchema = new mongoose.Schema({
    key: { type: String, required: true },
    value: { type: Array },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    common: { type: Boolean },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
});
Product_atributesSchema.plugin(mongoosePaginate);
let Product_atributes = mongoose.model('Product_atributes', Product_atributesSchema);
module.exports = Product_atributes;

