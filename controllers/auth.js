const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const gravatar = require('gravatar');

const authSchema = require("../schemas_validation/auth");

async function register(req, res, next) {
    const { email, password } = req.body;

    try {
    const validatedStatus = authSchema.validate(req.body, { abortEarly: false });

    if (typeof validatedStatus.error !== "undefined") {
      return res.status(400).json(validatedStatus.error.details.map((err) => err.message).join(", "));
    }
    const user = await User.findOne({ email }).exec();

    if (user !== null) {
            return res.status(409).json('Email in use')
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const url = gravatar.url(email, {s: '250', r: 'pg', d: '404'});

        await User.create({ email, password: passwordHash, avatarURL: url})
        res.status(201).json({
             "user": {
                "email": email,
                "subscription": "starter"
            }})
    } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json(validationErrors);
    }
        next(error)

    }
}

async function login(req, res, next) {
    const { email, password } = req.body;

    try {
        const validatedStatus = authSchema.validate(req.body, { abortEarly: false });

        if (typeof validatedStatus.error !== "undefined") {
        return res.status(400).json(validatedStatus.error.details.map((err) => err.message).join(", "));
        }

        const user = await User.findOne({ email }).exec();

        if (user === null) {
            return res.status(401).json('Email or password is wrong');
        }

        const comparedResult = await bcrypt.compare(password, user.password);
        
        if (comparedResult === false) {
            return res.status(401).json('Email or password is wrong');
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' })

        await User.findByIdAndUpdate(user._id, { token }).exec();
        res.json({
            "token":token,
            "user": {
                "email": user.email,
                "subscription": user.subscription,
            }
        });

    } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json(validationErrors);
    }
        next(error)
    }

}

async function logout(req, res, next) {
    try {
        await User.findByIdAndUpdate(req.user.id, { token: null }).exec();
        
        res.status(204).end()
    } catch (error) {
        next(error);
    }
    
}

async function current(req, res, next) {
    try {
        const user = await User.findById(req.user.id).exec();

        if (user === null) {
            return res.status(401).json('Not authorized')
        }
        
        res.status(200).json({
            "email": user.email,
            "subscription": user.subscription,
        })
    } catch (error) {
        next(error);
    }
    
}

module.exports = { register, login, logout, current };