// var Promise = require('bluebird');
var mongodb = require('mongodb');
var _ = require('lodash');
var server  = new mongodb.Server('127.0.0.1', 27017, {auto_reconnect: true});
var db = new mongodb.Db('mean_todo', server, {safe:true});
var config = require('../config');

var conn = function(next) {
   db.open(function(err, client) {
      if (!err) {
         console.log('success');
         return next(db, client);
      } else {
         db.close();
         console.log('error');
      }
   });
}

// 自增id
var getNextSequenceValue = function(db, id, next){
   var coll = db.collection('counters');
   // console.log('counters= ',coll);
   coll.findAndModify({_id: id}, [], {$inc: {sequence_val: 1}}, {upsert: true, new: true}, 
      function(err, ret) {
         next(ret.value.sequence_val);
      }
   );
}
var model = {
   list: function(next) {
      conn(function(db, client) {
         var coll = db.collection('todos');
         coll.find({}).toArray(function(err, ret) {
            // console.log('list: ', err, ret);
            next({
               code: 1,
               msg: 'get list data success!',
               data: ret  
            });
            db.close();
         });
      });
   },
   mod: function(next, req) {
      var query = req.query;
      if (query.id && query.text) {
         conn(function(db, client) {
            var coll = db.collection('todos');
            // query.done = parseInt(query.done);
            coll.findOneAndUpdate({id: parseInt(query.id)}, {$set: _.pick(query, 'text')}, {returnOriginal: false}, function(err, ret) {
               if (!err) {
                  // console.log('mod: ',ret.value);
                  next({
                     code: 1,
                     msg: 'modify success',
                     data: ret.value
                  });
               } else {
                  next(config.error['unknown_error']);
               }
               db.close();
            });
         });
      } else {
         next(config.error['miss_param']);
      }
   },
   add: function(next, req) {
      var query = req.query;
      var ret = _.merge({
         done: 0,
         createtime: Date.now()
      }, query);
      ret.text = ret.text.trim();
      if (ret.text) {
         conn(function(db, client) {
            var coll = db.collection('todos');
            getNextSequenceValue(db, 'todos', function(sequence_val) {
               ret = _.merge(ret, {
                  id: sequence_val
               })
               coll.insert(ret);
               ret = {
                  code: 1,
                  msg: 'success add!',
                  data: ret
               };
               next(ret);
               db.close();
            })
         });
      } else {
         next(config.error['text_null']);
      }
   },
   del: function(next, req) {
      var query = req.query;
      if (query.id) {
         conn(function(db, client) {
            var coll = db.collection('todos');
            coll.findOneAndDelete({id: parseInt(query.id)}, {}, function(err, ret) {
               if (!err) {
                  console.log('del: ', ret.value);
                  next({
                     code: 1,
                     msg: 'delete success',
                     data: ret.value
                  });
               } else {
                  next(config.error['unknown_error']);
               }
               db.close();
            });
         });
      } else {
         next(config.error['miss_param']);
      }
   },
   done: function(next, req) {
      var query = req.query;
      if (query.ids && typeof query.done !== 'undefined') {
         var _done = parseInt(query.done);
         if (_done !== 0 && _done !== 1) {
            return next(config.error['err_param']);
         }
         var idArr = query.ids.split(',');
         idArr = _.map(idArr, function(n) {
            return parseInt(n);
         });
         conn(function(db, client) {
            var coll = db.collection('todos');
            coll.updateMany({id: {"$in": idArr}}, {"$set": {done: _done}}, {}, function(err, ret) {
               next({
                  code: 1,
                  msg: _done && 'done all!' || 'undone all!'
               });
               db.close();
            });
         });
      } else {
         next(config.error['miss_param']);
      }
   }
};


module.exports  = model;




