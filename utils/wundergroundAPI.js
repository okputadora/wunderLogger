
const moment = require('moment-timezone')
const Wunderground = require('node-weatherunderground')
const Promise = require('bluebird')
const Prediction = require('../models/Prediction')
const mongoose = require('mongoose')
module.exports = {
  get: (params) => {
    return new Promise((resolve, reject) =>{
      var client = new Wunderground()
      // because AWS defaults to UTC timezone we need to explicitly set
      // the timezone to that of the target city
      var currentTime = moment().tz("America/New_York").format('YYYY-MM-DD-HH')
      console.log(currentTime)
      var forecasts = []
      client.hourly10day(params, (err, data) => {
        if (err){
          throw err
          return
        }
        // parse data
        for (var i=0; i < data.length; i++){
          var month = (data[i].FCTTIME.mon_padded);
          var day = (data[i].FCTTIME.mday_padded );
          var year = (data[i].FCTTIME.year);
          var hour = (data[i].FCTTIME.hour_padded);
          var dateString = year + '-' + month + '-' + day + '-' + hour;
          var end = moment(dateString, 'YYYY-MM-DD-HH').format('YYYY-MM-DD-HH');

          // build model
          var forecast = {
            timeOfFruition: end,
            temp: data[i].temp.english,
            condition: data[i].condition
          }
          forecasts.push(forecast)
        }
        var prediction = {
          city: params.city,
          state: params.state,
          timeOfPrediction: currentTime,
          service: "wunderground",
          forecasts: forecasts
        }
        Prediction.create(prediction, (err, prediction) => {
          if (err){
            console.log('couldnt create')
            reject(err)
            return
          }
          resolve(prediction)
        })
      })
    })
  }
}
