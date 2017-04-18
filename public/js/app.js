angular.module("BeersApp", ['ngRoute', 'ngFileUpload'])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "list.html",
        controller: "ListController",
        resolve: {
          beers: function(Beers) {
            return Beers.getBeers();
          }
        }
      })
      .when("/beers/new", {
        controller: "NewBeerController",
        templateUrl: "beer-add.html"
      })
      .when("/beers/:beerId", {
        controller: "ViewBeerController",
        templateUrl: "beer.html"
      })
      .when("/beers/edit/:beerId", {
        controller: "EditBeerController",
        templateUrl: "beer-edit.html"
      })
      .otherwise({
        redirectTo: "/"
      });
    $locationProvider.html5Mode(true);
  })
  .service("Beers", function($http) {
    this.getBeers = function() {
      return $http.get("/api/beers").
      then(function(response) {
        return response.data;
      }, function(response) {
        alert("Error finding Beers.");
      });
    }
    this.createBeer = function(beer) {
      $http.defaults.headers.common['Authorization'] = 'bXhjenBpc2Npb25lcmk6bXhjenBhc3NwaXNjaW9uZXJp';
      return $http.post("/api/beers", beer).
      then(function(response) {
        return response;
      }, function(response) {
        alert("Error creating beer.");
      });
    }
    this.getBeer = function(beerId) {
      var url = "/api/beers/" + beerId;
      return $http.get(url).
      then(function(response) {
        return response.data;
      }, function(response) {
        alert("Error finding this beer.");
      });
    }
    this.editBeer = function(beer) {
      var url = "/api/beers/" + beer._id;
      console.log(beer._id);
      $http.defaults.headers.common['Authorization'] = 'bXhjenBpc2Npb25lcmk6bXhjenBhc3NwaXNjaW9uZXJp';
      return $http.put(url, beer).
      then(function(response) {
        return response;
      }, function(response) {
        alert("Error editing this beer.");
        console.log(response);
      });
    }
    this.deleteBeer = function(beerId) {
      var url = "/api/beers/" + beerId;
      $http.defaults.headers.common['Authorization'] = 'bXhjenBpc2Npb25lcmk6bXhjenBhc3NwaXNjaW9uZXJp';
      return $http.delete(url).
      then(function(response) {
        return response;
      }, function(response) {
        alert("Error deleting this beer.");
        console.log(response);
      });
    }
  })
  .controller("ListController", function(beers, $scope, $location) {
    $scope.beers = beers.data;

    $scope.go = function(path) {
      $location.path(path);
    };
  })
  .controller("NewBeerController", ['$scope', '$location', 'Beers', 'Upload', function($scope, $location, Beers, Upload) {
    $scope.back = function() {
      $location.path("/");
    }

    $scope.saveBeer = function(beer) {
      beer.image = slug($scope.beer.name) + '.' + $scope.image.name.split('.').pop();
      Beers.createBeer(beer).then(function(doc) {
        if ($scope.form.image.$valid && $scope.image) {
          upload(Upload, $scope.image, $scope.beer.image);
        }
        var beerUrl = "/beers/" + doc.data.data._id;
        $location.path(beerUrl);
      }, function(response) {
        alert(response);
      });
    }
  }])
  .controller("ViewBeerController", ['$scope', '$location', '$routeParams', 'Beers', function($scope, $location, $routeParams, Beers) {
    Beers.getBeer($routeParams.beerId).then(function(doc) {
      $scope.beer = doc.data;
    }, function(response) {
      alert(response);
    });

    $scope.go = function(path) {
      $location.path(path);
    };

    $scope.deleteBeer = function(beerId) {
      if (confirm("Delete?")) {
        Beers.deleteBeer(beerId);
        $location.path("/");
      }
    }
  }])
  .controller("EditBeerController", ['$scope', '$location', '$routeParams', 'Beers', 'Upload', function($scope, $location, $routeParams, Beers, Upload) {
    Beers.getBeer($routeParams.beerId).then(function(doc) {
      $scope.beer = doc.data;
    }, function(response) {
      alert(response);
    });

    $scope.go = function(path) {
      $location.path(path);
    };

    $scope.saveBeer = function(beer) {
      console.log($scope.image);
      console.log($scope.beer.image);
      console.log($scope.form);
      console.log($scope.form.image);
      if ($scope.form.image.$valid && $scope.image) {
        upload(Upload, $scope.image, $scope.beer.image);
      }
      Beers.editBeer(beer);
      $location.path("/");
    }
  }]);

function upload(Upload, file, beername) {
  Upload.upload({
    url: '/api/beers/upload',
    headers: {
      'Authorization': 'bXhjenBpc2Npb25lcmk6bXhjenBhc3NwaXNjaW9uZXJp'
    },
    data: {
      file: file,
      'beername': beername
    }
  }).then(function(resp) {
    console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
  }, function(resp) {
    console.log('Error status: ' + resp.status);
  });
}

function slug(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
  var to = "aaaaaeeeeeiiiiooooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
}