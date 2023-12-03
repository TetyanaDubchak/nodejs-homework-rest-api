const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const gravatar = require('gravatar');
const ElasticEmail = require('@elasticemail/elasticemail-client');
const { ELASTICE_API_KEY, EMAIL_FROM } = process.env;

const defaultClient = ElasticEmail.ApiClient.instance;
const {apikey} = defaultClient.authentications;
apikey.apiKey = ELASTICE_API_KEY;

const authSchema = require("../schemas_validation/auth");
const verifySchema = require("../schemas_validation/verify");

const sendEmail = require("../helpers/sendEmail")

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
    const verificationToken = await uuidv4();
     
    const url = gravatar.url(email, { s: '250', r: 'pg', d: '404' });
    
    const emailData = await ElasticEmail.EmailMessageData.constructFromObject({
        Recipients: [
            new ElasticEmail.EmailRecipient(email)
        ],
        Content: {
            Body: [
            ElasticEmail.BodyPart.constructFromObject({
                ContentType: "HTML",
                Content: `<strong>To confirm your registration please click on <a href='http://localhost:3000/api/users/verify/${verificationToken}'>Link</a></strong>`
            })
            ],
            Subject: "Verify",
            From: EMAIL_FROM
        }
    });
        
    sendEmail(emailData).then(result => console.log(result)).catch(error => next(error))

    await User.create({ email, verificationToken, password: passwordHash, avatarURL: url})
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

        if (user.verify === false) {
            return res.status(401).json("Account is not verifed");
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

async function verify(req, res, next) {
    const { verificationToken } = req.params;
    
    try {
        const user = await User.findOne({ verificationToken }).exec();
        
        if (user === null) {
            return res.status(404).json("User not found");
        }

        await User.findByIdAndUpdate(user._id, {verify:true, verificationToken: null });

        res.status(200).json("Verification successful")

    } catch (error) {
        next(error);
    }

}

async function notVerify(req, res, next) {
    const { email } = req.body;

    try {
        const validatedStatus = verifySchema.validate(req.body, { abortEarly: false });

        if (typeof validatedStatus.error !== "undefined") {
            return res.status(400).json(validatedStatus.error.details.map((err) => err.message).join(", "));
        }

        const user = await User.findOne({ email }).exec();

        if (user === null) {
            return res.status(404).json("User not found");
        }
        
        if (user.verify === false) {
            const verificationToken = await uuidv4();

            const emailData = await ElasticEmail.EmailMessageData.constructFromObject({
                Recipients: [
                    new ElasticEmail.EmailRecipient(email)
                ],
                Content: {
                    Body: [
                        ElasticEmail.BodyPart.constructFromObject({
                            ContentType: "HTML",
                            Content: `<strong>To confirm your registration please click on <a href='http://localhost:3000/api/users/verify/${verificationToken}'>Link</a></strong>`
                        })
                    ],
                    Subject: "Verify",
                    From: EMAIL_FROM
                }
            });
        
            sendEmail(emailData).then(result => console.log(result)).catch(error => next(error));
            
            await User.findByIdAndUpdate(user._id, { verificationToken });
            
            res.status(200).json("Verification email sent")
        } else {
            res.status(400).json("Verification has already been passed")
        }


    } catch (error) {
        next(error);
    }

}

module.exports = { register, login, logout, current, verify, notVerify };