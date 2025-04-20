/*
  This is model for level3 table
*/
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const level3Schema = new Schema({
  acc: {
    type: Number,
    required: true
  },
  time: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  }
}, { timestamps: true })


module.exports = mongoose.model('Level3', level3Schema)
