require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const sessions = require('express-session');
const cors = require('cors')
const fs = require("fs");

mongoose.set('strictQuery', true)
// routes
const levels = require('./routes/levels.js')

// express app
const app = express()

app.use(cors())
app.use(sessions({
  secret: process.env.SECRET,
  saveUninitialized:true,
  cookie: { maxAge: 86400000 },
  resave: false 
}));

app.use(express.json())

app.use('/api/levels', levels)

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to database')
    // listen to port
    app.listen(process.env.PORT, () => {
      console.log('listening for requests on port', process.env.PORT)
    })
    
  })
  .catch((err) => {
    console.log(err)
  }) 