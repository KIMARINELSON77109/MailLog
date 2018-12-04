var app = angular.module("mailLog", ["ngRoute","ui.bootstrap","datatables","datatables.bootstrap"]);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "templates/login.html",
        controller: 'recordCtrl'
    })
    .when("/addRecord", {
        templateUrl : "templates/addRecord.html",
        controller: 'recordCtrl'
    })
    .when("/dashboard", {
      resolve: {
			check: function($location, user) {
				if(!user.isUserLoggedIn()) {
					$location.path('/');
				}
			},
		},
        templateUrl : "templates/dashboard.html",
        controller: 'recordCtrl'
    })
    .when("/addUser", {
      resolve: {
        check: function($location, user) {
          if(!user.isUserLoggedIn()) {
            $location.path('/');
          }
        },
      },
        templateUrl : "templates/addUser.html",
        controller: 'recordCtrl'
    })
    .when("/logout",{
        resolve: {
  			deadResolve: function($location, user) {
  				user.clearData();
  				$location.path('/');
  			}
  		}
    })
    .otherwise({
      templates: '404'
    });
    
    //$locationProvider.html5Mode(true);
    // $locationProvider.html5Mode({
    //   enabled: true,
    //   requireBase: false
    // });
});

app.service('user', function() {
  var User;
	var loggedin = false;
	var id;
  
  this.isUserLoggedIn = function() {
		if(!!localStorage.getItem('login')) {
			loggedin = true;
			var data = JSON.parse(localStorage.getItem('login'));
			User = data.User;
			id = data.id;
		}
		return loggedin;
	};

	this.saveData = function(data) {
		User = data.User;
		id = data.id;
		loggedin = true;
		localStorage.setItem('login', JSON.stringify({
			User: User,
			id: id
		}));
	};
	
	this.clearData = function() {
	localStorage.removeItem('login');
	loggedin = false;
	}
});
app.controller("recordCtrl", function($scope, $http, $location, $timeout,DTOptionsBuilder,user){


//Login Function
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
                  url: "php/main.php",
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
              if(response.data.message == "admin" && response.data.Status == 'loggedin')
              {
                localStorage.setItem('showAdduser', 'false');
                user.saveData(response.data);
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
$scope.file = [];
  $http({
     method: 'get',
     url: 'php/records.php'}).then(function(user_data) {
        $scope.file = user_data.data;
        $scope.current_grid = 1;
        $scope.data_limit = 50;
        $scope.filter_data = $scope.file.length;
        $scope.entire_user = $scope.file.length;
    });
    $scope.page_position = function(page_number) {
        $scope.current_grid = page_number;
    };
    $scope.filter = function() {
        $timeout(function() {
            $scope.filter_data = $scope.searched.length;
        }, 5);
    };
    $scope.sort_with = function(base) {
        $scope.base = base;
        $scope.reverse = !$scope.reverse;
    };
    
    $scope.editingData = {};
        for (var i = 0, length = $scope.file.length; i < length; i++) {
          $scope.editingData[$scope.file[i].id] = false;
        }
        
        $scope.modify = function(row){
            $scope.editingData[row.id] = true;
        };
        
        $scope.update = function(row){
            $scope.editingData[row.id] = false;
            $http({
                method: "POST",
                url: "php/update.php",
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
                alert("Record updated successfully");
                }
              })
        };
 // Function to add records
//===============================================================================================-->
  $scope.insert_d = {};
  $scope.insertData = function(){
    $http({
      method: "POST",
      url: "php/main.php",
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
       $http({
       method: 'get',
       url: 'php/records.php'}).then(function(response) {
          $scope.file = response.data;
         });
      if(response.data.message == "success")
      {
          $scope.recordData = response.data;
          $scope.insert_d.sender = '';
          $scope.insert_d.action = '';
          $scope.insert_d.content = '';
          $scope.insert_d.sdate = '';
          alert("Record add successfully");
      }
      else
      {
        $scope.recval_1 = true;
        $scope.insert_d.sender = '';
        $scope.insert_d.action = '';
        $scope.insert_d.content = '';
        $scope.insert_d.sdate = '';
        alert("Somthing went wrong!! Try again");
      }
    });
  },  
  
  
//Retrieve users  
//<!--===============================================================================================-->
 $scope.persons = {};
  $http({
        method: "get",
        url: "php/persons.php",
        }).then(function (response) {
        $scope.persons = response.data;
        $scope.vm = {};
    		$scope.vm.dtOptions = DTOptionsBuilder.newOptions()
        		.withOption('order', [0, 'desc'])
            .withOption('hasBootstrap', true)
            .withPaginationType('full_numbers')
            .withOption('saveState', false)
            .withOption('lengthChange',false)
            .withOption('destroy',true)
      });
      
      
// Function to add user  
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
                  url: "php/addUser.php",
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
                 $http({
                   method: 'get',
                   url: 'php/persons.php'}).then(function(response) {
                      $scope.persons = response.data;
                     });
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
        
        // Remove record
//<!--===============================================================================================-->
       $scope.removeItem = function(index,recid){
        if (confirm('Are you sure you want to delete this?')){
          $http({
           method: 'post',
           url: 'php/main.php',
           headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
              transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
           data: {id:recid,request_type:3},
           }).then(function successCallback(response) {
           $scope.file.splice(index,1);
           });
         }
       };

// Remove users
//<!--===============================================================================================-->
$scope.removePerson = function(index,recid)
 {
  if (confirm('Are you sure you want to delete this?'))
  {
    $http({
     method: 'post',
     url: 'php/main.php',
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
// Logout user function
//<!--===============================================================================================--> 
  $scope.logout_user = function(){
    $location.path("/logout");
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

app.filter('beginning_data', function() {
    return function(input, begin) {
        if (input) {
            begin = +begin;
            return input.slice(begin);
        }
        return [];
    }
});

