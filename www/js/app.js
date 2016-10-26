var db = null;
// Include dependency: ngCordova
var starter = angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers'])

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
    db = $cordovaSQLite.openDB({name: "my.db"});
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS pessoas (id INTEGER PRIMARY KEY, firstname text, lastname text)");
  });
})

starter.controller('DBController', function($scope, $cordovaSQLite) {
  $scope.resultado = "";
  $scope.peopleList = [];

  $scope.insert = function(firstname, lastname) {
    $scope.peopleList = [];
    var query = "insert into pessoas (firstname, lastname) values (?,?)";
    $cordovaSQLite.execute(db,query,[firstname,lastname]).then(function(result) {
      $scope.resultado = "Insert OK.";
    }, function(error){
      $scope.resultado = "Insert FAIL!";
    });
  }

  $scope.select = function(lastname){
    $scope.peopleList = [];
    var query = "select firstname, lastname from pessoas where lastname = ?";
    $cordovaSQLite.execute(db,query,[lastname]).then(function(result) {
      if(result.rows.length > 0){
        $scope.resultado = result.rows.item(0).firstname + " found with this last name.";
      } else {
        $scope.resultado = "Last Name Not Found!";
      }
    }, function(error){
      console.log(error);
    });
  }

  $scope.selectAll = function(){
    console.log($scope.fsName);
    $scope.peopleList = [];
    var query = "select firstname, lastname from pessoas";
    $cordovaSQLite.execute(db,query,[]).then(function(result) {
      if(result.rows.length > 0){
        for(var i = 0; i < result.rows.length; i++) {
          $scope.peopleList.push({firstname: result.rows.item(i).firstname, lastname: result.rows.item(i).lastname});
        }
        $scope.resultado = result.rows.length + " rows found.";
      } else {
        $scope.resultado = "0 rows found!";
        $scope.peopleList = [];
      }
    }, function(error){
      console.log(error);
    });
    $scope.fsName = "";
  }

  $scope.delete = function(lastname) {
    $scope.peopleList = [];
    var query = "delete from pessoas where lastname = ?";
    $cordovaSQLite.execute(db,query,[lastname]).then(function(result) {
      $scope.resultado = "Delete Ok.";
    }, function(error){
      $scope.resultado = "Delete FAIL!";
    });
  }

  $scope.update = function(firstname, lastname) {
    $scope.peopleList = [];
    console.log("Vou fazer update");
    var query = "update pessoas set firstname = ? where lastname = ?";
    $cordovaSQLite.execute(db,query,[firstname,lastname]).then(function(result) {
      $scope.resultado = "Update OK.";
    }, function(error){
      $scope.resultado = "Update FAIL!";
    });
  }

  $scope.deleteAll = function() {
    $scope.peopleList = [];
    var query = "delete from pessoas";
    $cordovaSQLite.execute(db,query,[]).then(function(result) {
      $scope.resultado = "Delete Ok.";
    }, function(error){
      $scope.resultado = "Delete FAIL!";
    });
  }

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  /*.state('app.concretagem', {
  url: '/concretagem',
  views: {
  'menuContent': {
  templateUrl: 'templates/concretagem.html'
}
}
})*/

.state('app.view', {
  url: '/view',
  views: {
    'menuContent': {
      templateUrl: 'templates/view.html'
    }
  }
})
.state('app.concretagens', {
  url: '/concretagens',
  views: {
    'menuContent': {
      templateUrl: 'templates/concretagens.html',
      controller: 'ConcretagensCtrl'
    }
  }
})

.state('app.testeForm', {
  url: '/testeForm',
  views: {
    'menuContent': {
      templateUrl: 'templates/testeForm.html',
      controller: 'DBController'
    }
  }
})

.state('app.single', {
  url: '/view/:concretagensId',
  views: {
    'menuContent': {
      templateUrl: 'templates/view.html',
      controller: 'ConcretagemCtrl'
    }
  }
});
// if none of the above states are matched, use this as the fallback
$urlRouterProvider.otherwise('/app/testeForms');
});
