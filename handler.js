'use strict';
require('dotenv').config()
const wunderAPI = require('./utils/wundergroundAPI')
const mongoose = require('mongoose')
module.exports.wunder = (event, context, callback) => {
  console.log("running hello")
  // take city and state as params to get the weather
  wunderAPI.get({key: process.env.WUNDER_API_KEY, city: "philadelphia", state: "pa"})
  .then((result) => {
    console.log("done")
    mongoose.connection.close()
    callback(null, result)
  })
};
