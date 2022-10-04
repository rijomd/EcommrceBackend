let mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let UserSchema = mongoose.Schema({
    createdtime: { type: Number },
    updatedtime: { type: Number },
    activation_status: { type: Number, default: 0 },
    status: { type: Number },
    block_status: { type: Number },

    name: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true, required: true, unique: true },
    hash_password: { type: String, trim: true, unique: false, required: true },
    role: { type: Number, required: true },
    image: { type: String, trim: true },
    priceDetails_cart: { type: Object },

}, { timestamps: true }); //  automatically updated when our model changes.

//set password 
UserSchema.virtual(`password`).set(function (password) {
    this.hash_password = bcrypt.hashSync(password, 10);//encrypt
});

//get fullname 
// UserSchema.virtual(`fullname`).get(function (password) {
// return `${this.fname} ${this.lname}`
// });

UserSchema.methods = {
    authenticate: (password) => {
        console.log(password, "pasword");
        return bcrypt.compareSync(password, this.hash_password); // true for decrypt
    }
}


let User = mongoose.model('User', UserSchema);
module.exports = User;