let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');

let OptionsSchema = new mongoose.Schema({
    key: { type: String, unique: true, required: true },
    valueobject: { type: Array },
});
OptionsSchema.plugin(mongoosePaginate);
let Options = mongoose.model('Options', OptionsSchema);
module.exports = Options;

