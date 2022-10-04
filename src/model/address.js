let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');

let AddressSchema = mongoose.Schema({
    createdtime: { type: Number },
    updatedtime: { type: Number },
    status: { type: Number },
    name: { type: String, required: true },
    locality: { type: String },
    pin: { type: String, required: true },
    phone: { type: String },
    landmark: { type: String },
    city: { type: String },
    state: { type: String, required: true },
    a_phone: { type: String },
    address: { type: String },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

});
AddressSchema.plugin(mongoosePaginate);
let Address = mongoose.model('Address', AddressSchema);
module.exports = Address;