const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const User = new mongoose.Schema({
    first_name: String,
    last_name: String,
    user_id: String,
    pin: String
});

User.methods.correctPassword = async function (
    enteredPin,
    actualPin
) {
    return await bcrypt.compare(enteredPin, actualPin);
};
  
// generating jwt token
User.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        return token;
    } catch (err) {
        console.log(err, "err in User");
    }
};

const UserSchema = mongoose.model('user-temp', User);
module.exports = UserSchema;