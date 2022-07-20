require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const session = require('express-session')
const csurf = require('csurf')
const cookieParser = require('cookie-parser')


// const FileStore = require('session-file-store')(session)
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: process.env.MONGO_DB_URL,
    collection: 'mySessions'
  });

const app = express()
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())


app.use(session({
    store:store,
    secret:process.env.SESSION_SECRET,
    saveUninitialized:false,
    rolling:true,
    resave:false,
    cookie:{
        httpOnly:true,
        sameSite:true,
        secure: process.env.NODE_ENV === 'productio' ? true : false, 
        maxAge:parseInt(process.env.SESSION_MAX_AGE)
    }
}))

const csrfProtection = csurf({
    cookie:true
})
app.use(csrfProtection);

app.get('/auth/csrf-token', (req,res)=>{
    res.json({csrfToken:req.csrfToken()})
})

const appRoutes = require('./Routes/app.routes')
app.use('/app',appRoutes)

const authRoutes = require('./Routes/auth.routes')
app.use('/auth',authRoutes)

const kanbanRoutes = require('./Routes/kanban.routes')
app.use('/kanban',kanbanRoutes)


mongoose.connect(process.env.MONGO_DB_URL)
    .then(res=>{
        const server = app.listen(process.env.PORT)
        console.log('app running on port',process.env.PORT)
    }).catch(error=>{
        console.log(error)
    })
  
