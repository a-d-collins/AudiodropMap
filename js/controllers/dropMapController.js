app.controller('dropMapController', ['$scope', 'uiGmapLogger', 'uiGmapGoogleMapApi', function($scope, $log, uiGmapGoogleMapApi) {
    // General data for the form
    // User data for the form that appears next to the map
    $scope.point = {
        coords: [],
        label: undefined,
        _id: false
    };
    
    $scope.track = [
        {dataType: "Artist", data: "Sufjan Stevens"},
        {dataType: "Album", data: "Satellite"},
        {dataType: "Track", data: "Satellite"}
    ];
    
    $scope.user = {};
    
    // Set mapCenter to New York, NY
    $scope.mapCenter = {latitude: 40.7127837, longitude: -74.00594130000002};
    
    // Main map object. Contains all marker, shape, and other map-related data
    $scope.map= {
        center: $scope.mapCenter,
        zoom: 12,
        clickedPoint: {
            id: 0 // Note: All markers must have an id and a corresponding html element
        },
        circles: [
            // See angular.extend method for properties
        ],
        events: {
            // See angular.extend method for more about the available events
        }
    };
    
    // When maps API is initialized...
    uiGmapGoogleMapApi.then(function(maps) {
        // examine the maps object
        console.log(maps);
        // Try locating user -- THIS MAY NEED TO BE CONVERTED INTO A PROMISE-BASED FUNCTION AND
        // BE 'ANGULARIZED' (IF POSSIBLE)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              $scope.user.pos = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              };
            
              $scope.map.center = $scope.user.pos;
              $scope.$apply();
            }, function() {
              handleLocationError(true, infoWindow, map.getCenter());
            });
          } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
          }
    });
    
    // Functions
    
    var angularGMapsBounds = function (bounds) {
        var NE = bounds.getNorthEast(),
            SW = bounds.getSouthWest();
        
        return {northeast: angularLatLng(NE), southwest: angularLatLng(SW)};
    };
    
    var angularLatLng = function (LatLng) {
        return {latitude: LatLng.lat(), longitude: LatLng.lng()};
    };
    
    // changeTrack -- Arguments: point; Return: none; Role: Redirect user to page that allows him/her to change the track associated with a point
    $scope.changeTrack = function (point) {
        alert("Unable to fulfill changeTrack() request on " + point.label + ". Functionality not yet built.");
    };
    
    // deletePoint -- Arguments: none; Return: none; Role: Deletes the 'clickedPoint' and the circle associated with it.
    $scope.deletePoint = function () {
        $scope.map.clickedPoint = null;
        $scope.map.circles[0].center = {};
        $scope.point.label = "";
        $scope.point.coords = [];
    };
    
    // noCoords -- Arguments point object; Return: boolean; Role: Determines ng-disabled state of update/create button
    $scope.noCoords = function (pointObj) {
        // Return true (and disable button) if longitude is undefined
        return pointObj.coords[0] === undefined;
    };
    
    $scope.updatePoint = function (pointObj) {
        // Does nothing yet
    };
    
    // Toggle a single class of a given element
    $scope.toggleClass = function (elementID, elementClass) {
        document.getElementById(elementID).classList.toggle(elementClass);
    } 
    
    // This method allows you to alter/add to (a.k.a. 'extend') the properties of any earlier-declared object (e.g. $scope.map)
    // Useful for cleaning up the beginning of a JS file because you can place all of the busy details lower down in the file
    angular.extend($scope.map, {
        circles: [
            {
                id: 1,
                radius: 30.48,
                stroke: {
                    color: '#08B21F',
                    weight: 2,
                    opacity: 1
                },
                fill: {
                    color: '#08B21F',
                    opacity: 0.5
                },
                geodesic: true, // optional: defaults to false
                draggable: false, // optional: defaults to false
                clickable: false, // optional: defaults to true
                editable: false, // optional: defaults to false
                visible: true, // optional: defaults to true
                control: {}
            }
        ],
        clickedPoint: {
            id: 0,
            showWindow: true
        },
        events: {
            click: function (mapModel, eventName, originalEventArgs) {
                // 'this' is the directive's scope
                // I got the following line of code from the example (http://angular-ui.github.io/angular-google-maps/#!/demo)
                // WHERE IS THIS LOG??
                $log.info("user defined event: " + eventName, mapModel, originalEventArgs);

                var e = originalEventArgs[0];
                var lat = e.latLng.lat(),
                    lon = e.latLng.lng();
                
                $scope.map.clickedPoint = {
                    latitude: lat,
                    longitude: lon,
                    options: {
                        animation: 2
                    },
                    events: {
                        dblclick: function (mapModel, eventName, originalEventArgs) {
                            $scope.map.center = {latitude: $scope.map.clickedPoint.latitude, longitude: $scope.map.clickedPoint.longitude};
                            $scope.map.zoom = 16;
                        }
                    }
                };
                
                // Set center of circles[0] with radius 100ft(~30.48m)
                $scope.map.circles[0].center = new google.maps.LatLng(lat, lon);
                
                // Update $scope.point lat and lng with marker position
                $scope.point.coords[1] = $scope.map.clickedPoint.latitude;
                $scope.point.coords[0] = $scope.map.clickedPoint.longitude;
                
                if ($scope.map.zoom > 19) {
                    $scope.map.zoom = 19;
                }
                
                //scope apply required because this event handler is outside of the angular domain
                $scope.$evalAsync();
            }
            
        },
        searchbox: { 
          template:'searchbox.tpl.html', 
          events:{
            places_changed: function (searchBox) {
                // Array of places from searchBox
                var places = searchBox.getPlaces();

                if (places.length == 0) {
                    return;
                }
                
                // Save the first place
                var place = places[0];
                
                // Create bounds object to hold place's bounds information
                var bounds = new google.maps.LatLngBounds();
                
                if (place.geometry.viewport) {
                  // Only geocodes have viewport.
                  bounds.union(place.geometry.viewport);
                } else {
                  bounds.extend(place.geometry.location);
                }
                
                $scope.map.bounds = angularGMapsBounds(bounds);
            }
          }
        }
    });
    
}]);