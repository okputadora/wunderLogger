const moment = require('moment-timezone')
const Promise = require('bluebird')
const Prediction = require('../models/Prediction')

module.exports = {
  clean: () => {
    return new Promise((resolve, reject) => {
      // get all documents in database
      Prediction.find((err, result) => {
        if (err){
          reject(err);
          return;
        }
        console.log(result)
        let currentTimeMom = moment();
        let predictionsToRemove = [];
        result.forEach(pred => {
          // if over ten days old (240 hours)
          let timeOfPredMom = moment(pred.timeOfPrediction, "YYYY-MM-DD-HH")
          if (currentTimeMom.diff(timeOfPredMom, 'days') >= 10){
            console.log("prediction should be removed")
            predictionsToRemove.push(pred._id)
          }
        })
        // then delete from db
        if (predictionsToRemove.length > 0){
          Prediction.remove({'_id':{$in:predictionsToRemove}}, (err, result) => {
            if (err){
              reject(err);
              return;
            }
            resolve(result)
          })
        }
        else{
          console.log("no cleaning necessary at this time")
          resolve()
        }
      })
    })
  }
}
