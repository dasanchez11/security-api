require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const Token = require('./Models/token.model')
const User = require('./Models/user.model')
const utils = require('./utils/utils')
const cookieParser = require('cookie-parser')

const {createToken} = utils

const app = express()
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser()) 

const authRoutes = require('./Routes/auth.routes')
app.use('/auth',authRoutes)

app.get('/auth/token/refresh', async(req,res)=>{
     try {
        const {refreshToken} = req.cookies;
        if(!refreshToken) return res.status(401).json({message:'Not Authorized'})

        const userFromToken = await Token.findOne({refreshToken}).select('user')
        if(!userFromToken) return res.status(401).json({message:'Not Authorized'})
       
        const user = await User.findOne({_id:userFromToken.user})
        if(!user) return res.status(401).json({message:'Not Authorized'})

        const token = createToken(user)

        return res.status(200).json({token})
     } catch (error) {
        return res.status(400).json({message:'Something went Wrong'})
     }
})

const appRoutes = require('./Routes/app.routes')
app.use('/app',appRoutes)


const kanbanRoutes = require('./Routes/kanban.routes')
app.use('/kanban',kanbanRoutes)


mongoose.connect(process.env.MONGO_DB_URL)
    .then(res=>{
        const server = app.listen(process.env.PORT)
        console.log('app running on port',process.env.PORT)
    }).catch(error=>{
        console.log(error)
    })
  
