(function(){
  'use strict';



  function config($locationProvider, $routeProvider,$httpProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        templateUrl: 'views/cinema-billboard.tpl.html',
        controller: 'BillboardCtrl',
        controllerAs: 'billboard'
      })
      .when('/movies/:movie', {
        templateUrl: 'views/cinema-movie.tpl.html',
        controller: 'MovieCtrl',
        controllerAs: 'movie'
      })
      .when('/rooms/:room', {
        templateUrl: 'views/cinema-room.tpl.html',
        controller: 'RoomCtrl',
        controllerAs: 'room'
      })
      .when('/shows/:show', {
        templateUrl: 'views/cinema-show.tpl.html',
        controller: 'ShowCtrl',
        controllerAs: 'show'
      })
      .when('/bookings/:booking', {
        templateUrl: 'views/cinema-booking.tpl.html',
        controller: 'BookingCtrl',
        controllerAs: 'booking'
      });
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }

  angular
    .module('cinema', ['ngRoute', 'cinema.controllers', 'cinema.templates'])
    .config(config);

})();
