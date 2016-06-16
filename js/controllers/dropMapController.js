app.controller('dropMapController', ['$scope', 'uiGmapLogger', 'uiGmapGoogleMapApi', function($scope, $log, uiGmapGoogleMapApi) {
    // General data for the form
    // User data for the form that appears next to the map
    $scope.point = {
        coords: [],
        label: undefined,
        _id: false
    };
    
    $scope.track = {
        info: [
            {dataType: "Artist", data: "Sufjan Stevens"},
            {dataType: "Album", data: "Satellite"},
            {dataType: "Track", data: "Satellite"}
        ],
        collapsed: false
    };
    
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
    
    // toggleTrackListCollapse -- Role: toggles $scope.track.collapsed value, and in doing so adds more to the bootstrap collapse effect
    $scope.toggleTrackListCollapse = function () {
        $scope.track.collapsed = !$scope.track.collapsed;
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
    
    // TEMPORARY(6/16/2016) -- Markers2-related stuff
    // Declare functions as variables that are used a lot in the javascript and do not need to be available to the $scope
    var onMarkerClicked = function (marker) {
        marker.showWindow = true;
        $scope.$apply();
    };
    
    // Attach (some) functions declared as 'var' variables to the $scope
    // This might also be a useful way to 'angularize' a bunch of javascript code that someone else is working on
    $scope.onMarkerClicked = onMarkerClicked;
    
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
        },
        // TEMPORARY(6/16/2016) -- Markers2-related stuff
        markers2: [
            {
                id: 1,
                latitude: 46,
                longitude: -77,
                showWindow: false,
                options: {
                    labelContent: '[46,-77]',
                    labelAnchor: "22 0",
                    labelClass: "marker-labels"
                }
            },
            {
                id: 2,
                latitude: 33,
                longitude: -77,
                showWindow: false,
                options: {
                    labelContent: 'DRAG ME!',
                    labelAnchor: "22 0",
                    labelClass: "marker-labels",
                    draggable: true
                }
            },
            {
                id: 3,
                latitude: 35,
                longitude: -125,
                showWindow: false,
                options: {
                    labelContent: '[35,-125]',
                    labelAnchor: "22 0",
                    labelClass: "marker-labels"
                }
            }
        ]
    });
    
    
    
    // TEMPORARY(6/16/2016) -- Markers2-related functions
    // Other functions
    $scope.map.markers2Events = {
        dragend: function (marker, eventName, model, args) {
            model.options.labelContent = "Dragged lat: " + model.latitude + " lon: " + model.longitude;
        }
    };
    
    $scope.map.markers2.forEach( function (marker) {
        marker.onClicked = function () {
            onMarkerClicked(marker);
        };
        marker.closeClick = function () {
            marker.showWindow = false;
            $scope.$evalAsync();
        };
    });
    
}]);