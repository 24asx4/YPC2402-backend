/*
  This is model for level1 table
*/
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const level1Schema = new Schema({
  acc: {
    type: Number,
    required: true
  },
  time: {
    type: Number,
    required: true
  }
}, { timestamps: true })


module.exports = mongoose.model('Level1', level1Schema)
