'use strict';
require('dotenv').config()
const wunderAPI = require('./utils/wundergroundAPI')
const cleanDb = require('./utils/cleanDb')
const mongoose = require('mongoose')
module.exports.wunder = (event, context, callback) => {
  // connect to the db
  mongoose.connect(process.env.MONGODB_URI, function(err, res){
    if (err){
      console.log('DB CONNECTION FAILED: '+err)
      return;
    }
  })
  // take city and state as params to get the weather
  wunderAPI.get({key: process.env.WUNDER_API_KEY, city: "philadelphia", state: "pa"})
  .then((result) => {
    console.log("done")
    cleanDb.clean()
    .then(() => {
      mongoose.connection.close()
      callback(null, result)
    })
    .catch(() => {
      mongoose.connection.close()
    })
  })
};
