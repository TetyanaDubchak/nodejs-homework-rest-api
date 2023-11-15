const bcrypt = require('bcrypt');
const User = require('../models/user');

async function register(req, res, next) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).exec();

        if (user !== null) {
            return res.status(409).json('Email in use')
        }
        const passwordHash = await bcrypt.hash(password, 10)

        await User.create({ email, password: passwordHash })
        res.status(201).json({
             "user": {
                "email": email,
                "subscription": "starter"
            }})
    } catch (error) {
        next()

    }
}

async function login(req, res, next) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).exec();

        if (user === null) {
            return res.status(401).json('Email or password is wrong');
        }

        const comparedResult = await bcrypt.compare(password, user.password);
        
        if (comparedResult === false) {
            return res.status(401).json('Email or password is wrong');
        }

        res.json({token: 'Token'})

    } catch (error) {
        next(error)
    }

}

module.exports = { register, login };