var express = require('express');
var router = express.Router();
var controller = require('../controller');

// 列表数据
router.get('/list', controller.list);

// 修改
router.get('/mod', controller.mod);

// 增加
router.get('/add', controller.add);

// 删除
router.get('/del', controller.del);

// 标记已完成
router.get('/done', controller.done);


module.exports = router;