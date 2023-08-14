// //var UserService = require('../services/user.service')    
// //models here



// const GetStocks : async function (req, res, next) {
//     // Validate request parameters, queries using express-validator
    
//     // var page = req.params.page ? req.params.page : 1;
//     // var limit = req.params.limit ? req.params.limit : 10;
//     // try {
//     //     var users = await UserService.getUsers({}, page, limit)
//     //     return res.status(200).json({ status: 200, data: users, message: "Succesfully Users Retrieved" });
//     // } catch (e) {
//     //     return res.status(400).json({ status: 400, message: e.message });
//     // }

//     // return res.status(200).json({
//     //         status : 'ok',
//     //         data : 'testing controller'
//     //     })

//     return res.status(400).json({ status: 400, message: e.message });
// }

// const stocks = {
//     GetStocks : GetStocks
// }


// module.exports = stocks


// const express = require('express');
// const router = express.Router();

// module.exports = {

//     GetStocks : function(req,res,next) {

//         console.log(req)

//         return res

//     },

//     // viewOne: function(req, res){
//     //     console.log('Viewing ' + req.params.id);
//     // },
//     // create: function(req, res){
//     //     console.log('Todo created')
//     // },
//     // destroy: function(req, res){
//     //     console.log('Todo deleted')
//     // },
//     // edit: function(req, res){
//     //     console.log('Todo ' + req.params.id + ' updated')
//     // }
// };


exports.GetStocks = (req, res) => {
  
  res.json({user: 'testing' });
  
};