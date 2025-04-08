/*
  This is the routing script for login api
*/
const express = require('express')
const {
  add_result,
  get_results,
  get_avg
} = require('../controllers/level1_controller')

const router = express.Router()

// add a result
router.post('/add_result', add_result)
// get all results
router.get('/get_results', get_results)
// get avg results
router.get('/get_avg', get_avg)


module.exports = router