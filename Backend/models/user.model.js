const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    fullName: {
        firstName: {
            type: String,
            required: true,
            minlength: [3, "First name should be atleast 3 characters long"],
        },
        lastName: {
            type: String,
            required: false,
            minlength: [3, "Last name should be atleast 3 characters long"],
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [13, "Email should be atleast 13 characters long"],
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password should be atleast 6 characters long"],
    },
    socketId: {
        type: String,
    },
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

userSchema.methods.comparePasswords = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
