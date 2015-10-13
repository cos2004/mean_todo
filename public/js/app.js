console.log('app init');

/**
 * @name TODO app demo
 * @date  2015.10.11
 * @author cos2004@126.com
 */

var app = angular.module('TODO', []),list;

//List controller
app.controller('TodoListCtrl', ['$scope', '$http', function($scope, $http) {

   // get list
   $http.get('/api/list').success(function(data) {
      if (data && data.code == 1) {
         list = $scope.list = data.data;
         var sum = 0;
         $scope.list.forEach(function(val) {
            if (val.done == 1) {
               ++sum;
            }
         });
         if (sum === $scope.list.length) {
            $scope.toggleALl = 1;
         }
      } else {
         alert('获取列表数据失败');
      }
   });

   /**
    * [onToggle 全选/全不选]
    * @method onToggle
    * @param  {Event} e 事件对象
    */
   $scope.onToggle = function(e) {
      var target = e.target;
      var submit = [];
      if (target.checked) {
         $scope.list.forEach(function(val) {
            val.done = 1;
            submit.push(val.id);
         });
         $http.get('/api/done?done=1&ids='+submit.join(',')).success(function(data) {
            if (data && data.code == 1) {
            } else {
               alert('设置全部已完成失败');
            }
         });
      } else {
         $scope.list.forEach(function(val) {
            val.done = 0;
            submit.push(val.id);
         });
         $http.get('/api/done?done=0&ids='+submit.join(',')).success(function(data) {
            if (data && data.code == 1) {
            } else {
               alert('设置全部未完成失败');
            }
         });
      }
   };

   /**
    * [onOneDone 标记一个TODO的状态]
    * @method onOneDone
    * @param  {Event}  e 
    * @param  {Number}  id  TODO id
    * @param  {Number}  index 序号
    */
   $scope.onOneDone = function(e, id, index) {
      var target = e.target;
      var done = 0;
      if (target.checked) {
         done = 1;
      }
      $http.get('/api/done?done='+done+'&ids='+id).success(function(data) {
         if (data && data.code == 1) {
            $scope.list[index].done = done;
         } else {
            alert('标记失败');
         }
      });
   };

   /**
    * [del 删除一个TODO]
    * @method del
    * @param  {Event}  e 
    * @param  {Number}  id  TODO id
    * @param  {Number}  index 序号
    */
   $scope.del = function(e, id, index) {
      var target = e.target;
      $http.get('/api/del?id='+id).success(function(data) {
         if (data && data.code == 1) {
            $scope.list.splice(index, 1);
         } else {
            alert('删除失败');
         }
      });
   };

   var getTarget = function(el, tagName) {
      if (el.tagName.toLowerCase() !== 'li') {
         return getTarget(el.parentNode, tagName);
      }
      return el;
   }

   /**
    * [onEdit 编辑]
    * @method onEdit
    * @param  {Event}  e 
    */
   $scope.onEdit = function(e) {
      var target = e.target;
      getTarget(target, 'li').classList.add('editing');
   };

   /**
    * [onSubmitEdit 提交修改]
    * @method onSubmitEdit
    * @param  {Event}  e 
    * @param  {Number}  id  TODO id
    * @param  {Number}  index 序号       
    */
   $scope.onSubmitEdit = function(e, id, index) {
      var target = e.target;
      if (e.keyCode === 13) {
         $http.get('/api/mod?id='+id+'&text='+target.value).success(function(data) {
            if (data && data.code == 1) {
               $scope.list[index] = data.data;
               getTarget(target, 'li').classList.remove('editing');
            } else {
               alert('修改失败');
            }
         });
      }
   };

   $scope.onBlurEdit = function(e) {
      var target = e.target;
      getTarget(target, 'li').classList.remove('editing');
   };
}]);


//add-input controller
app.controller('InputCtrl', ['$scope', '$http', function($scope, $http) {
   $scope.onKeydown = function(e) {
      var target = e.target;
      if (e.keyCode === 13) {
         $http.get('/api/add?text='+target.value).success(function(data) {
            if (data && data.data) {
               list.push(data.data);
               target.value = '';
            } else {
               alert('添加失败');
            }
         });
      }
   };
}]);


