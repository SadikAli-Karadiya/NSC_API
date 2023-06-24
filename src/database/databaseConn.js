const mongoose = require("mongoose");
const {MONGODB_URL_1} = require('../../constant')
const {updateCurrentDB} = require('../state');

async function startDatabase(){
  mongoose
    .connect(MONGODB_URL_1)
    .then(() => {
      updateCurrentDB('nsc1');
      console.log("Connected to database nsc 1");
      return true;
    })
    .catch((err) => {
      console.log("Something went wrong, can't connect to database");
      return false;
    });
}

module.exports = {startDatabase};
  
