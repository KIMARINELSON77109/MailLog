var app = angular.module("mailLog",['ui.router', 'templates']);

  app.config(['$stateProvider','$urlRouterProvider',
  function($stateProvider,$urlRouterProvider) {
    /**
     * Routes and States
     */
    // $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
    // $httpProvider.defaults.withCredentials = true;

     


 $stateProvider
    
    .state('index', {
        url: '/',
        templateUrl: 'index.html',
        controller: 'loadCtrl'
    })
    
    // .state('Display', {
    //     url: '/Display',
    //     templateUrl: 'display.html',
    //     controller: 'myCtrl'
    // })
    
    // .state('Login', {
    //     url: '/Login',
    //     templateUrl: 'login.html',
    //     controller: 'myCtrl'
    // })
    
    // .state('Profile', {
    //     url: '/Profile',
    //     templateUrl: 'profile.html',
    //     controller: 'myCtrl'
    // })
    
    // .state('Bookings', {
    //     url: '/Bookings',
    //     templateUrl: 'bookings.html',
    //     controller: 'myCtrl'
    // })
    
    // .state('Schedule', {
    //     url: '/Schedule',
    //     templateUrl: 'schedule-day.html',
    //     controller: 'myCtrl'
    // })
    
  

    // default fall back route
    $urlRouterProvider.otherwise('/');

    // enable HTML5 Mode for SEO
    $locationProvider.html5Mode(true);
    

  
}]);

app.controller("recordCtrl", function($scope, $http){
  $scope.insertData = function(){
    $http.post("main.php", {
      'sender': $scope.sender, 'mail_content': $scope.mail_content,
      'action': $scope.action
    }).success(function(data){
      
    });
  }
  $scope.displayRecord = function(){  
           $http.get("main.php")  
           .success(function(data){  
                $scope.records = data;  
           });  
      }  
});