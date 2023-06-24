const express = require('express');
const mongoose = require('mongoose')
const {MONGODB_URL_1, MONGODB_URL_2} = require('../../../constant')
const {updateCurrentDB} = require('../../state');
const switchDBRouter = express.Router();

switchDBRouter.get('/switch/:branch', (req, res, next)=>{
  try{
    const branch = req.params.branch;
    mongoose.disconnect();
    mongoose
      .connect(branch == 'ajitmill' ? MONGODB_URL_1 : MONGODB_URL_2)
      .then(() => {
        updateCurrentDB(branch == 'ajitmill' ? 'nsc1' : 'nsc2')
        console.log('connected to database', branch)
        res.status(201).json({
          success: true,
        });
      })
      .catch((err) => {
        console.log("Something went wrong, can't connect to database");
        return false;
      });
  }
  catch(error){
    next(error);
  }

})

module.exports = switchDBRouter