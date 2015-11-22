(function(){
  'use strict';

  angular.module('cinema.controllers', ['cinema.services']);

  function LoginCtrl(User, $scope, $timeout){
    var self = this;

    $scope.logged = false;
    $scope.me = {};
    $scope.login = function(){

      console.log($scope.userID);
      User.get({userID: $scope.userID})
      .$promise.then(
         //Success
         function(data){


               $scope.logged = true;
               $scope.me = data;

         },
         //Error
         function(error){
           console.log('Error' + error);
         }
       );

    };

  }
  function BillboardCtrl(Movie, Room){

    this.movies = Movie.query();
    this.rooms = Room.query();

  }

  function MovieCtrl($routeParams, $scope, $location, Movie, Room, ShowsByMovie){
    var self = this;
    self.data = Movie.get({movieID: $routeParams.movie});
    ShowsByMovie.query({movieID: $routeParams.movie})
      .$promise.then(function(data){
        self.shows = data;
        angular.forEach(self.shows, function(value, key) {

          value.room = Room.get({roomID: value.idPlace});
        });
      },
      function(error){
        console.log(error);
      });

    self.viewShow = function(obj){
      $location.path('/shows/'+obj.id);
    };



  }


  function ShowCtrl($routeParams, $scope, $location, Show, Movie, Room, Reservation){
    var self = this;
    var seats, myseats;

    var parseSeats = function(obj){
      var i, j;
      var row = JSON.parse(obj).row,
          col = JSON.parse(obj).col;
      // Crear array primera vez
      var x = new Array(row);
      for (i = 0; i < row; i++) {
        x[i] = new Array(col);
        for (j = 0; j < col; j++) {
          x[i][j] = {ocupado: 0, desactivado: 0};
        }
      }
      return x;
    };


    self.data = Show.get({showID: $routeParams.show}, function(){
      self.movie = Movie.get({movieID: self.data.idMovie});
      self.room = Room.get({roomID: self.data.idPlace}, function(){
        if(self.data.sites === ''){
          self.seats = parseSeats(self.room.places);
        }
        else{
          self.seats = JSON.parse(self.data.sites);
        }
        self.myseats = parseSeats(self.room.places);
      });


    });



    $scope.changeStatus = function(x,y){
      if(self.myseats[x][y].me === undefined){
        self.myseats[x][y].me = 1;
      }
      else{
       self.myseats[x][y].me = !self.myseats[x][y].me;
      }
      self.seats[x][y].ocupado = !self.seats[x][y].ocupado;
    };
    self.send = function(){

      // Create new reserve
      var newReserve = new Reservation();
      newReserve.idShow = self.data.id;
      newReserve.idUser = 1; // asignación fija -> actualizar desde formulario de usuario
      newReserve.sites = self.myseats;

      newReserve.$save(function(u, putResponseHeaders) {
        //u => saved user object

        // Update seats filled
        Show.update({showID: self.data.id}, self.seats);

        // Load reserves view
        $location.path('/bookings/'+u.id);
      });




    };
  }

  function BookingCtrl($routeParams, Reservation, Show, Movie, Room){
    var self = this;
    function filterByProperty(array, prop, value){
        var filtered = [];
        for(var i = 0; i < array.length; i++){

            var obj = array[i];

            for(var key in obj){
                if(typeof(obj[key] == "object")){
                    var item = obj[key];
                    if(item[prop] == value){
                        var row = i;
                        var col = parseInt(key) +1;
                        var numSeat = row+''+col;
                        filtered.push(numSeat);
                    }
                }
            }

        }
        return filtered;

    }


    self.data = Reservation.get({reservationID: $routeParams.booking}, function(){
      self.seats = filterByProperty(JSON.parse(self.data.sites), 'me', 1);
      self.show = Show.get({showID: self.data.idShow}, function(){
        self.movie = Movie.get({movieID: self.show.idMovie});
        self.room = Room.get({roomID: self.show.idPlace});
      });

    });
  }
  angular.module('cinema.controllers')
    .controller('LoginCtrl', LoginCtrl)
    .controller('BillboardCtrl', BillboardCtrl)
    .controller('ShowCtrl', ShowCtrl)
    .controller('BookingCtrl', BookingCtrl)
    .controller('MovieCtrl', MovieCtrl);
})();
