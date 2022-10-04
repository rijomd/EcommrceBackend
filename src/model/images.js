let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let mongoosePaginate = require('mongoose-paginate');
let ImagesSchema = new Schema({
    status: { type: Number },
    createdtime: { type: Number },
    updatedtime: { type: Number },
    image: { type: String, trim: true, required: true },
    user_id: { type: mongoose.Schema.ObjectId, ref: 'User' },
});
ImagesSchema.plugin(mongoosePaginate);
let Images = mongoose.model('Images', ImagesSchema);
module.exports = Images;

