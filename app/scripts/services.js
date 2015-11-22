(function(){
  'use strict';

  angular.module('cinema.services', ['ngResource']);

  function User ($resource, BaseUrl) {
    return $resource(BaseUrl + '/users/:userID',{userID: '@_id'});
  }

  function Movie ($resource, BaseUrl) {
    return $resource(BaseUrl + '/movies/:movieID', {movieID: '@_id'});
  }

  function Room ($resource, BaseUrl) {
    return $resource(BaseUrl + '/rooms/:roomID', {roomID: '@_id'}, {'update': {method: 'PUT'}});
  }

  function Show ($resource, BaseUrl) {
    return $resource(BaseUrl + '/shows/:showID', {showID: '@_id'}, {'update': {method: 'PUT'}});
  }

  function ShowsByMovie($resource, BaseUrl){
    return $resource(BaseUrl + '/shows/movie/:movieID', {movieID: '@_id'});
  }

  function ShowsByRoom($resource, BaseUrl){
    return $resource(BaseUrl + '/shows/movie/:movieID', {movieID: '@_id'});
  }

  function Reservation ($resource, BaseUrl) {
    return $resource(BaseUrl + '/bookings/:reservationID',{reservationID: '@_id'});
  }
  angular
    .module('cinema.services')
    .constant('BaseUrl', 'http://labs.davidtaboas.es/cinema/api')
    .factory('User',User)
    .factory('Room',Room)
    .factory('Show',Show)
    .factory('ShowsByMovie',ShowsByMovie)
    .factory('ShowsByRoom',ShowsByRoom)
    .factory('Reservation',Reservation)
    .factory('Movie',Movie);
})();
