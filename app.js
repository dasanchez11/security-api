require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


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
  
