// var Promise = require('bluebird');
var mongodb = require('mongodb');
var server  = new mongodb.Server('127.0.0.1', 27017, {auto_reconnect: true});
var db = new mongodb.Db('testdb', server, {safe:true});

db.open(function(err, client) {
   if (!err) {
      console.log('success');
      var coll = db.collection('test11');
      // coll.insert({b:44});
      coll.find(function(err, ret) {
         ret.each(function(err, one) {
            console.log(': ', one);
         });
         // console.log(err, ret);
      });
      // var coll = new mongodb.Collection(client, 'test11');
      // // console.log(coll.find());
      // coll.find(function(err, ret) {
      //    console.log(ret);
      // })
      // console.log('success',db);
      // db.test11.insert({a:'33'});
      // console.log(db.test11.find());
   } else {
      console.log('error');
   }
});
