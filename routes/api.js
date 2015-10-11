var express = require('express');
var router = express.Router();

// 列表数据
router.get('/list', function(req, res, next) {
   res.send({
      code: 1,
      name: 'list'
   });

});

// 修改
router.get('/mod', function(req, res, next) {
   res.send({
      code: 1,
      name: 'mod'
   });
});

// 增加
router.get('/add', function(req, res, next) {
   res.send({
      code: 1,
      name: 'add'
   });
});

// 删除
router.get('/del', function(req, res, next) {
   res.send({
      code: 1,
      name: 'del'
   });
});


module.exports = router;