angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $state) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  $scope.$on('$ionicView.enter', function(e) {
  });

  // Form data for the login modal
  $scope.loginData = {};
  $scope.registerData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginmodal = modal;
  });
  $ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.registermodal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.loginmodal.hide();
  };
  $scope.closeRegister = function() {
    $scope.registermodal.hide();
  };
  $scope.accept = function(id) {
    console.log(id)
    $http.post('https://stark-savannah-6837.herokuapp.com/trades/accept/' + id)
    .then(function(data){
      console.log(data)
    })
  };
  $scope.makeTrade = function(homeowner) {
    var tradeInfo = {};
    tradeInfo.homePokemon = $scope.currentUser.startPokemon
    tradeInfo.guestPokemon = homeowner.startPokemon
    tradeInfo.homeownerId = $scope.currentUser._id
    tradeInfo.guestId = homeowner._id
    tradeInfo.guestName = homeowner.username
    $http.post('https://stark-savannah-6837.herokuapp.com/trades', tradeInfo)
    .then(function(data){
      console.log(data);
      $scope.trade = data
  })
    console.log("YOUR POKEMON:", $scope.currentUser.startPokemon)
    console.log("THEIR POKEMON:", homeowner.startPokemon)
    console.log("THEIR NAME:", homeowner.username)
    console.log("YOUR NAME:", $scope.currentUser.username)
  };
  // Open the login modal
  $scope.login = function() {
    $scope.loginmodal.show();
  };
  $scope.logout = function() {
    $scope.currentUser = null;
    $scope.loggedIn = false;
  };
  $scope.register = function() {
    $scope.registermodal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    var user = {};
    user.username = $scope.loginData.username;
    user.password = $scope.loginData.password;
    $http.post('https://stark-savannah-6837.herokuapp.com/users/login', user)
    .then(function(data){
      console.log(data)
      $scope.currentUser = data.data
      $scope.loggedIn = true;
      $scope.closeLogin();
      $state.go('app.browse')
    })
  };
  $scope.doRegister = function() {
    if(!$scope.registerData.username || !$scope.registerData.password){
      console.log("No username or password")
      return;
    }
    if($scope.registerData.password !== $scope.registerData.password2){
      console.log("Passwords do not match")
      return;
    }

    var newUser = {};
    newUser.username = $scope.registerData.username;
    newUser.password = $scope.registerData.password;
    newUser.startPokemon = $scope.registerData.startPokemon
    ;
    $http.post('https://stark-savannah-6837.herokuapp.com/users/register', newUser)
    .then(function(data){
      console.log(data)
      $scope.closeRegister();
    })
  };
})

.controller('WorldmapCtrl', function($scope, $http) {
  $http.get('https://stark-savannah-6837.herokuapp.com/worldmap/').then(function(data){
    console.log("DATA", data.data)
    $scope.userdata = data.data
  })
})

.controller('PlaylistCtrl', function($scope, $stateParams, $http) {
  $http.get('https://stark-savannah-6837.herokuapp.com/homes/' + $stateParams.username).then(function(data){
    $scope.homeowner = data.data
  })
});
