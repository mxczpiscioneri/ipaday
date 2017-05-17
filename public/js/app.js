angular.module("BeersApp", ['ngRoute', 'ngStorage', 'ngFileUpload'])
  .config(function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when("/beers", {
        controller: "ListController",
        templateUrl: "list.html"
      })
      .when("/beers/new", {
        controller: "NewBeerController",
        templateUrl: "beer-add.html"
      })
      .when("/beers/:year", {
        controller: "ListController",
        templateUrl: "list.html"
      })
      .when("/beers/view/:beerId", {
        controller: "ViewBeerController",
        templateUrl: "beer.html"
      })
      .when("/beers/edit/:beerId", {
        controller: "EditBeerController",
        templateUrl: "beer-edit.html"
      })
      .when("/register", {
        controller: "NewUserController",
        templateUrl: "register.html"
      })
      .when("/login", {
        controller: "LoginController",
        templateUrl: "login.html"
      })
      .otherwise({
        redirectTo: "/beers"
      });

    $locationProvider.html5Mode(true);

    // Insert Token in Header HTTP
    $httpProvider.interceptors.push('TokenInterceptor');
  })
  .service('TokenInterceptor', function($sessionStorage, $location) {
    this.request = function(config) {
      config.headers = config.headers || {};
      if ($sessionStorage.token) {
        config.headers['x-access-token'] = $sessionStorage.token;
      }
      return config;
    };
    this.responseError = function(rejection) {
      if (rejection.status === 401) {
        $location.path('/');
      }
      return rejection;
    };
  })
  .service("Users", function($http) {
    this.createUser = function(user) {
      return $http.post("/api/users", user)
        .then(function(response) {
          return response;
        }, function(response) {
          return null;
        });
    }
    this.login = function(user) {
      return $http.post("/api/authenticate", user)
        .then(function(response) {
          return response;
        }, function(response) {
          return null;
        });
    }
  })
  .service("Beers", function($http) {
    this.getBeers = function(year) {
      if (year) {
        var url = "/api/beers/" + year;
      } else {
        var url = "/api/beers";
      }
      return $http.get(url)
        .then(function(response) {
          return response.data;
        }, function(response) {
          return null;
        });
    }
    this.createBeer = function(beer) {
      $http.defaults.headers.common['Authorization'] = 'bXhjenBpc2Npb25lcmk6bXhjenBhc3NwaXNjaW9uZXJp';
      return $http.post("/api/beers", beer)
        .then(function(response) {
          return response;
        }, function(response) {
          alert("Error creating beer.");
        });
    }
    this.getBeer = function(beerId) {
      var url = "/api/beers/view/" + beerId;
      return $http.get(url)
        .then(function(response) {
          return response.data;
        }, function(response) {
          return null;
        });
    }
    this.editBeer = function(beer) {
      var url = "/api/beers/" + beer._id;
      $http.defaults.headers.common['Authorization'] = 'bXhjenBpc2Npb25lcmk6bXhjenBhc3NwaXNjaW9uZXJp';
      return $http.put(url, beer)
        .then(function(response) {
          return response;
        }, function(response) {
          alert("Error editing this beer.");
        });
    }
    this.deleteBeer = function(beerId) {
      var url = "/api/beers/" + beerId;
      $http.defaults.headers.common['Authorization'] = 'bXhjenBpc2Npb25lcmk6bXhjenBhc3NwaXNjaW9uZXJp';
      return $http.delete(url)
        .then(function(response) {
          return response;
        }, function(response) {
          alert("Error deleting this beer.");
        });
    }
    this.upload = function(Upload, file, beername) {
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
  })
  .controller("ListController", function($scope, $location, $routeParams, Beers) {
    $scope.URL_S3 = "https://s3-sa-east-1.amazonaws.com/ipaday/";
    Beers.getBeers($routeParams.year)
      .then(function(beers) {
        if (beers && beers.data.length > 0) {
          $scope.beers = beers.data;
        } else {
          alert("Error finding Beers.");
          $location.path("/");
        }
      });

    window.onresize = function() {
      equalHeight("product");
    };
  })
  .controller("NewBeerController", function($scope, $location, Beers, Upload) {
    $scope.saveBeer = function(beer) {
      if ($scope.image) {
        beer.image = slug($scope.beer.name) + '-' + $scope.beer.year + '.' + $scope.image.name.split('.').pop();
      }
      Beers.createBeer(beer)
        .then(function(doc) {
          if ($scope.form.image.$valid && $scope.image) {
            Beers.upload(Upload, $scope.image, beer.image);
          }
          var beerUrl = "/beers/view/" + doc.data.data._id;
          $location.path(beerUrl);
        }, function(response) {
          alert(response);
        });
    }
  })
  .controller("ViewBeerController", function($scope, $location, $routeParams, Beers) {
    $scope.URL_S3 = "https://s3-sa-east-1.amazonaws.com/ipaday/";
    Beers.getBeer($routeParams.beerId)
      .then(function(doc) {
        if (doc) {
          $scope.beer = doc.data;
        } else {
          alert("Error finding this beer.");
          $location.path("/");
        }
      });

    $scope.deleteBeer = function(beerId) {
      if (confirm("Delete?")) {
        Beers.deleteBeer(beerId);
        $location.path("/");
      }
    }
  })
  .controller("EditBeerController", function($scope, $location, $routeParams, Beers, Upload) {
    Beers.getBeer($routeParams.beerId)
      .then(function(doc) {
        $scope.beer = doc.data;
      }, function(response) {
        alert(response);
      });

    $scope.saveBeer = function(beer) {
      if ($scope.image) {
        beer.image = slug($scope.beer.name) + '-' + $scope.beer.year + '.' + $scope.image.name.split('.').pop();
      }
      Beers.editBeer(beer)
        .then(function(doc) {
          if ($scope.form.image.$valid && $scope.image) {
            Beers.upload(Upload, $scope.image, beer.image);
          }
          var beerUrl = "/beers/view/" + doc.data.data._id;
          $location.path(beerUrl);
        }, function(response) {
          alert(response);
        });
    }
  })
  .controller("NewUserController", function($scope, $location, $sessionStorage, Users) {
    delete $sessionStorage.user;
    delete $sessionStorage.token;

    $scope.saveUser = function() {
      if (!$scope.form.$valid) {
        return;
      }

      Users.createUser($scope.user)
        .then(function(data) {
          // Login
          Users.login($scope.user)
            .then(function(data) {
              if (data.data.type) {
                $sessionStorage.user = data.data.user;
                $sessionStorage.token = data.data.token;
                $location.path("/beers");
              } else {
                alert(data.data.data);
              }
            }, function(response) {
              alert(response);
            });
        }, function(response) {
          alert(response);
        });
    }
  })
  .controller("LoginController", function($scope, $location, $sessionStorage, Users) {
    delete $sessionStorage.user;
    delete $sessionStorage.token;

    $scope.login = function() {
      if (!$scope.form.$valid) {
        return;
      }

      Users.login($scope.user)
        .then(function(data) {
          if (data.type) {
            $sessionStorage.user = data.user;
            $sessionStorage.token = data.token;
            $location.path("/beers");
          } else {
            alert(data.data);
          }
        }, function(response) {
          alert(response);
        });
    }
  })
  .directive("scroll", function($window) {
    return function(scope, element, attrs) {
      angular.element($window).bind("scroll", function() {
        if (this.pageYOffset >= 145) {
          scope.stickyClass = true;
        } else {
          scope.stickyClass = false;
        }
        scope.$apply();
      });
    };
  })
  .directive('loadedImg', function() {
    return {
      link: function(scope, element, attrs) {
        element.bind("load", function(e) {
          equalHeight("product");
        });
      }
    }
  });

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

function equalHeight(className) {
  var div = document.getElementsByClassName(className);
  var tallest = 0;
  for (i = 0; i < div.length; i++) {
    div[i].style.height = '';
    var ele = div[i];
    var eleHeight = ele.offsetHeight;
    tallest = (eleHeight > tallest ? eleHeight : tallest);
  }
  var findClass = document.getElementsByClassName(className);
  for (i = 0; i < findClass.length; i++) {
    findClass[i].style.height = tallest + "px";
  }
}