var app = angular.module("mailLog", ["ngRoute"]);

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
    .when("/admindash", {
        templateUrl : "/templates/AdminDash.html",
        controller: 'recordCtrl'
    });
});

app.controller("recordCtrl", function($scope, $http, $location){
  $scope.insert_d = {};
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
      }
      else
      {
        $scope.recval = false;
      }
    }); 
  }
  $scope.log_in = {};
  $scope.rec = {};
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
      console.log(response.data.message)
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
              if(response.data.message == "admin")
              {
                $location.path("/admindash");
              }
              else if (response.data.message == "other")
              {
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
            $location.path("/");
          }
          console.log($scope.loginData);
    });
          
  }
  $scope.roles = ["admin","guest"];
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
                  $scope.AdduserResponse = response.data.message;
                  $scope.userval = true;
              })
            }
            else
            {
              $scope.userval = false;
            }
          });
  }
  $http({
        method: "POST",
        url: "../php/records.php",
        headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
                  transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
        data: {numRec:20},
        }).then(function (response) {
        $scope.rec.records = response.data;
        //console.log($scope.rec.records);
        });
  $scope.logout_user = function(){
     $http({
      method: "POST",
      url: "../php/logout.php",
      data: $scope.logout = true,
    }).then(function (response) {
    if(response.data === "logged out"){
      $location.path("/");
    }
      //console.log(response.data);
    });
  }
  $scope.values = [5, 10, 20];
  $scope.val={};
  $scope.limit_rec = function(){
  $http({
      method: "POST",
      url: "../php/records.php",
      headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
      transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
    },
    data: {numRec: $scope.val.selectedvalue},
    }).then(function (response) {
        $scope.rec.records = response.data;
        //console.log($scope.rec.records);
        });
   }
});

app.controller("locationCtrl", function($scope,$location){
  $scope.goToRecordForm = function(){
    $location.path("/addRecord");
  }
   $scope.goToHome = function(){
    $location.path("/admindash");
  }
  $scope.dashboard = function(){
    $location.path("/dashboard");
  }
  $scope.goToAddUser = function(){
    $location.path("/addUser");
  }
});
