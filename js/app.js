var app = angular.module("mailLog", ["ngRoute","datatables","datatables.bootstrap"]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "/templates/login.html",
        controller: 'recordCtrl'
    })
    .when("/addRecord", {
        templateUrl : "/templates/addRecord.html",
        controller: 'recordCtrl'
    })
    .when("/dashboard", {
        templateUrl : "/templates/dashboard.html",
        controller: 'recordCtrl'
    })
    .when("/addUser", {
        templateUrl : "/templates/addUser.html",
        controller: 'recordCtrl'
    })
});

app.controller("recordCtrl", function($scope, $http, $location,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder){
  $scope.insert_d = {};
  //===============================================================================================-->
  $scope.insertData = function(){
    $http({
      method: "POST",
      url: "../php/main.php",
      headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
      transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
    },
    data: {sender: $scope.insert_d.sender, action: $scope.insert_d.action, content: $scope.insert_d.content,
      sdate: $scope.insert_d.sdate},
    }).then(function (response) {
      if(response.data.message == "success")
      {
          $scope.recordData = response.data;
          $scope.recval = true;
          $scope.insert_d.sender = '';
          $scope.insert_d.action = '';
          $scope.insert_d.content = '';
          $scope.insert_d.sdate = '';
          $http({
            method: "GET",
            url: "../php/records.php",
            }).then(function (response) {$scope.records = response.data;})
          $scope.recval = false;
      }
      else
      {
        $scope.recval_1 = true;
        $scope.insert_d.sender = '';
        $scope.insert_d.action = '';
        $scope.insert_d.content = '';
        $scope.insert_d.sdate = '';
      }
    }); 
  }
  
  //<!--===============================================================================================-->
  $scope.log_in = {};
  $scope.showAddUser = localStorage.getItem('showAdduser') || false;
  $scope.User = sessionStorage.getItem('user') || '';
  $scope.loginform = function(){
    $http({
      method: "POST",
      url: "https://apps.mona.uwi.edu/wservice/authenticate.php",
      headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
      transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
    },
    data: {idnumber: $scope.log_in.idnumber, password: $scope.log_in.password}
    }).then(function(response){
      console.log(response.data)
      $scope.loginData = response.data;
          if($scope.loginData.message == true)
          {
            $http({
                  method: "POST",
                  url: "../php/main.php",
                  headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
                  transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {idnumber: $scope.log_in.idnumber}
            }).then(function(response)
            {
              console.log(response.data);
               sessionStorage.setItem('user', response.data.User);
              console.log($scope.user);
              if(response.data.message == "admin")
              {
                localStorage.setItem('showAdduser', 'false');
                $location.path("/dashboard");
              }
              else if (response.data.message == "other")
              {
                localStorage.setItem('showAdduser', 'true');
                $location.path("/dashboard");
              }
              else
              {
                $location.path("/");
              }
            });
          }
          else
          {
            $scope.loginval = false;
            $location.path("/");
          }
    });
          
  }
  
  
  //<!--===============================================================================================-->
  $scope.roles = ["admin","regular user"];
  $scope.user = {};
  $scope.addUserData = function(){
      $http({
        method: "POST",
        url: "https://apps.mona.uwi.edu/wservice/userinfo.php",
        headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
        transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
      },
       data: {idnumber: $scope.user.idnumber},
      }).then(function (response) {
            if(response.data.httpcode == 200)
            {
              $http({
                  method: "POST",
                  url: "../php/addUser.php",
                  headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
                  transformRequest: function(obj) {
                      var str = [];
                      for(var p in obj)
                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                      return str.join("&");
                  },
                  data: {idnumber : response.data.message.idnumber,department: response.data.message.department,
                        email : response.data.message.email, firstname: response.data.message.firstname, 
                        lastname: response.data.message.lastname, role: $scope.user.selectedrole}
              }).then(function(response) {
                if(response.data.message==true){
                  $scope.user.idnumber = '';
                  $scope.user.selectedrole = '';
                  alert("User successfully added");
                  
                }
                else if(response.data.message=="duplicate")
                {
                  $scope.user.idnumber = '';
                  $scope.user.selectedrole = '';
                  alert("The user you are trying to add is already added!!"); 
                }
              })
            }
            else
            {
              $scope.user.idnumber = '';
              $scope.user.selectedrole = '';
              alert("Something went wrong! Ensure that Id number is valid and role is selected");
            }
          });
  }
  $scope.persons = {};
  $('#update-success').hide();
  $http({
        method: "GET",
        url: "../php/persons.php",
        }).then(function (response) {
        $scope.persons = response.data;
        $scope.vm = {};
    		$scope.vm.dtOptions = DTOptionsBuilder.newOptions()
        		.withOption('order', [4, 'asc'])
            .withOption('hasBootstrap', true)
            .withPaginationType('full_numbers')
            .withOption('searchDelay', 350)
            .withOption('saveState', true)
            .withOption('width', '5%')
            .withOption('lengthChange',false)
            .withOption('destroy',true)
      });
  
  $scope.records = {};
  $http({
        method: "GET",
        url: "../php/records.php",
        }).then(function (response) {
        $scope.records = response.data;
        $scope.vm = {};
    		$scope.vm.dtOptions = DTOptionsBuilder.newOptions()
        		.withOption('order', [4, 'desc'])
            .withOption('hasBootstrap', true)
            .withPaginationType('full_numbers')
            .withOption('searchDelay', 350)
            .withOption('saveState', true)
            .withOption('width', '5%')
            .withOption('lengthChange',false)
            .withOption('destroy',true)
      });
  $scope.editingData = {};
        for (var i = 0, length = $scope.records.length; i < length; i++) {
          $scope.editingData[$scope.records[i].id] = false;
        }
        
        $scope.modify = function(row){
            $scope.editingData[row.id] = true;
        };
        
        $scope.update = function(row){
            $scope.editingData[row.id] = false;
            $http({
                method: "POST",
                url: "../php/update.php",
                headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
                transformRequest: function(obj) {
                  var str = [];
                  for(var p in obj)
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
              },
              data: {id: row.id, sender: row.fromperson, action: row.raction, content: row.description,
                sdate: row.sdate},
              }).then(function (response) {
                if(response.data.message == "updated"){
                //alert("Record updated successfully");
                alert("Record updated successfully");
                }
              })
        };
  $scope.logout_user = function(){
     $http({
      method: "POST",
      url: "../php/logout.php",
      headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
        transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
      },
      data: {logout:true},
    }).then(function (response) {
    if(response.data == "logged out"){
      $location.path("/");
    }
    });
  }
   
   // Remove record
 $scope.removeItem = function(index,recid)
 {
  if (confirm('Are you sure you want to delete this?'))
  {
    $http({
     method: 'post',
     url: '../php/main.php',
     headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
        transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
      },
     data: {id:recid,request_type:3},
    }).then(function successCallback(response) {
     $scope.records.splice(index,1);
    });
  }
 }

$scope.removePerson = function(index,recid)
 {
  if (confirm('Are you sure you want to delete this?'))
  {
    $http({
     method: 'post',
     url: '../php/main.php',
     headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
        transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
      },
     data: {id:recid,request_type:2},
    }).then(function successCallback(response) {
     $scope.persons.splice(index,1);
    });
  }
 }
});

app.controller("locationCtrl", function($scope,$location){
  $scope.goDashboard = function(){
    $location.path("/dashboard");
  }
  $scope.goToAddUser = function(){
    $location.path("/addUser");
  }
});

