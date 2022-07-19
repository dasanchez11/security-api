const User = require('../Models/user.model')
const verifyPassword = require('../utils/utils')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const hashPassword = require('../utils/utils')
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
        const {verifyPassword,createToken} = utils
        const passwordValid = await verifyPassword(
            password,
            user.password
        );

        if (passwordValid) {
            const { password, bio, ...rest } = user;
            
            const userInfo = Object.assign({}, { ...rest });
            const token = createToken(userInfo);

            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const expiresAt = decodedToken.exp;

            res.json({
                message: 'Authentication successful!',
                token,
                userInfo,
                expiresAt
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

    const { email, firstName, lastName, password,captchaToken} = req.body;
    const {createToken} = utils
    try {
        const validateHuman = async(captchaToken) =>{
            const secret = process.env.GOOGLE_RECAPTCHA
            const URL = 'https://www.google.com/recaptcha/api/siteverify?'
            const response = await axios.post(`${URL}secret=${secret}&response=${captchaToken}`)
            const {data} = await response
            return data.success
        }

        const isHuman = await validateHuman(captchaToken)

        if(!isHuman){
            return res.status(400).json({message:'There was a problem creating your user account'})
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
            const token = createToken(savedUser);
            const decodedToken = jwt.verify(token,process.env.SECRET_KEY);
            const expiresAt = decodedToken.exp;

            const {
                firstName,
                lastName,
                email,
                role,
                kanban
            } = savedUser;

            const userInfo = {
                firstName,
                lastName,
                email,
                role,
                kanban
            };

            return res.json({
                message: 'User created!',
                token,
                userInfo,
                expiresAt
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