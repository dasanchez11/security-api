require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const csrf = require('csurf')

const csrfProtection = csrf({
    cookie:true
})


const app = express()
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())





const authRoutes = require('./Routes/auth.routes')
app.use('/auth',authRoutes)


app.use(csrfProtection);
app.get('/app/csrf-token',(req,res)=>{ 
    res.json({csrfToken:req.csrfToken()})
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
  
