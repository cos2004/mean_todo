
var model = require('../model');

var controller = {
   list: function(req, res, next) {
      model.list(function(ret) {
         res.send(ret);
      });
   },
   mod: function(req, res, next) {
      model.mod(function(ret) {
         res.send(ret);
      }, req);
   },
   add: function(req, res, next) {
      model.add(function(ret) {
         res.send(ret);
      }, req);
      // res.send({code:1});
   },
   del: function(req, res, next) {
      model.del(function(ret) {
         res.send(ret);
      }, req);
   },
   done: function(req, res, next) {
      // res.send({a:1});
      model.done(function(ret) {
         res.send(ret);
      }, req);
   }

};


module.exports = controller;


