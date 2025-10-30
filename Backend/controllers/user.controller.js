const userModel = require("../models/user.model.js");
const userService = require("../services/user.service.js");
const { validationResult } = require("express-validator");

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw res.Status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password } = req.body;

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstName: fullName.firstName,
        lastName: fullName.lastName,
        email,
        password: hashedPassword,
    });

    const token = user.generateAuthToken();
    res.status(201).json({ token });
};

module.exports.loginUser = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        throw res.status(400).json({ error: error.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user)
        return res.status(401).json("message: Invalid Email or Password");

    const isMatch = await user.comparePassword(password);

    if (!isMatch)
        return res.status(401).json("message: Invalid Email or Password");

    const token = user.generateAuthToken();

    res.status(200).json({ token, user });
};
