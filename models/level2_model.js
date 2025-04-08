/*
  This is model for level2 table
*/
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const level2Schema = new Schema({
  NPC: {
    type: Array,
  },
  acc: {
    type: Number,
    required: true
  },
  time: {
    type: Number,
    required: true
  }
}, { timestamps: true })


module.exports = mongoose.model('Level2', level2Schema)
