<!DOCTYPE html>
 <html lang="en" ng-app="mailLog">

<head>
     <meta charset="UTF-8">
     <title>Mail Log</title>
     <meta name="viewport" content="width=device-width, initial-scale=1">
     <!--===============================================================================================-->
     <script src="../js/angular.min.js"></script>
     <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
     <link rel="stylesheet" href="../css/app.css" type="text/css" />
     <!--===============================================================================================-->
     <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.10.0/ui-bootstrap-tpls.min.js"></script>
     <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular-route.js"></script>
     <script src="../js/app.js"></script>
     <!--===============================================================================================-->
 </head>

 <body class ="bg-light" ng-controller="recordCtrl">
   <div ng-view></div>
 </body>

 </html>