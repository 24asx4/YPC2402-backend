/*
  This is the routing script for login api
*/
const express = require('express')
const {
  add_result,
  get_avg
} = require('../controllers/levels_controller')

const router = express.Router()

// add a result
router.post('/add_result', add_result);
// get avg results
router.get('/get_avg/:levels/:diff', get_avg);


module.exports = router