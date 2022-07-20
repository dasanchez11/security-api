const User = require('../Models/user.model')
require('dotenv').config()
const utils = require('../utils/utils')
const bcrypt = require('bcryptjs')
const axios = require('axios')
const Kanban = require('../Models/Kanban.model')

module.exports.signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email
        }).lean();

        if (!user) {
            return res.status(403).json({
                message: 'Wrong email or password.'
            });
        }
        const { verifyPassword } = utils
        const passwordValid = await verifyPassword(
            password,
            user.password
        );

        if (passwordValid) {
            const { _id, firstName, lastName, email, role ,kanban} = user
            const userInfo = { _id, firstName, lastName, email, role,kanban }

            req.session.user = userInfo

            res.json({
                message: 'Authentication successful!',
                userInfo
            });
        } else {
            res.status(403).json({
                message: 'Wrong email or password.'
            });
        }
    } catch (err) {
        console.log(err);
        return res
            .status(400)
            .json({ message: 'Something went wrong.' });
    }
};



module.exports.signUp = async (req, res, next) => {

    const { email, firstName, lastName, password, captchaToken } = req.body;
    try {
        const validateHuman = async (captchaToken) => {
            const secret = process.env.GOOGLE_RECAPTCHA
            const URL = 'https://www.google.com/recaptcha/api/siteverify?'
            const response = await axios.post(`${URL}secret=${secret}&response=${captchaToken}`)
            const { data } = await response
            return data.success
        }

        const isHuman = await validateHuman(captchaToken)

        if (!isHuman) {
            return res.status(400).json({ message: 'There was a problem creating your user account' })
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const kanban = new Kanban()
        const savedKanban = await kanban.save()
        const userData = {
            email: email.toLowerCase(),
            firstName,
            lastName,
            password: hashedPassword,
            role: 'admin',
            kanban: savedKanban._id
        };

        const existingEmail = await User.findOne({
            email: userData.email
        }).lean();

        if (existingEmail) {
            return res
                .status(400)
                .json({ message: 'Email already exists' });
        }

        const newUser = new User(userData);
        const savedUser = await newUser.save();

        if (savedUser) {

            const {
                _id,
                firstName,
                lastName,
                email,
                role,
                kanban
            } = savedUser;

            const userInfo = {
                _id,
                firstName,
                lastName,
                email,
                role,
                kanban
            };

            req.session.user = userInfo

            return res.json({
                message: 'User created!',
                userInfo
            });
        } else {
            return res.status(400).json({
                message: 'There was a problem creating your account'
            });
        }
    } catch (err) {
        return res.status(400).json({
            message: 'There was a problem creating your account'
        });
    }
}