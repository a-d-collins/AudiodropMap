app.controller('dropMapController', ['$scope', 'uiGmapLogger', 'uiGmapGoogleMapApi', function($scope, $log, uiGmapGoogleMapApi) {
    // Form data
    // TODO -- Get form from Seth
    
    // Data for the form that appears next to the map
    $scope.formData = [
        {dataType: "Longitude", value: undefined},
        {dataType: "Latitude", value: undefined},
        {dataType: "Album Name", value: "Abbey Road"},
        {dataType: "In your opinion, is Paul dead?", value: "Yes"}
    ];
    
    $scope.mapCenter = {latitude: 40.738341, longitude: -73.961062};
    
    // Main map object. Contains all marker, shape, and other map-related data
    $scope.map= {
        center: $scope.mapCenter,
        zoom: 12,
        clickedMarker: {
            id: 0 // Note: All markers must have an id and a corresponding html element
        },
        events: {
            // See angular.extend method for more about the available events
        },
        rectangle: {
            bounds:{}
        }
    };
    
    // When maps API is initialized...
    uiGmapGoogleMapApi.then(function(maps) {
        // examine the maps object
        console.log(maps);
        // Use maps object to set the bounds of the map.rectangle object
        $scope.map.rectangle.bounds = new maps.LatLngBounds(
          new maps.LatLng(55,-100),
          new maps.LatLng(49,-78)
        );
    });
    
    // Declare functions as variables that are used a lot in the javascript and do not need to be available to the $scope
    var onMarkerClicked = function (marker) {
        marker.showWindow = true;
        $scope.$apply();
        //window.alert("Marker: lat: " + marker.latitude + ", lon: " + marker.longitude + " clicked!!")
    };
    
    // Attach (some) functions declared as 'var' variables to the $scope
    // This might also be a useful way to 'angularize' a bunch of javascript code that someone else is working on
    $scope.onMarkerClicked = onMarkerClicked;
    
    // This method allows you to alter/add to (a.k.a. 'extend') the properties of any earlier-declared object (e.g. $scope.map)
    // Useful for cleaning up the beginning of a JS file because you can place all of the busy details lower down in the file
    angular.extend($scope.map, {
        events: {
            click: function (mapModel, eventName, originalEventArgs) {
                // 'this' is the directive's scope
                // I got the following line of code from the example (http://angular-ui.github.io/angular-google-maps/#!/demo)
                // WHERE IS THIS LOG??
                $log.info("user defined event: " + eventName, mapModel, originalEventArgs);

                var e = originalEventArgs[0];
                var lat = e.latLng.lat(),
                    lon = e.latLng.lng();
                $scope.map.clickedMarker = {
                    id: 0,
                    latitude: lat,
                    longitude: lon,
                    options: {
                      labelContent: 'You clicked here ' + 'lat: ' + lat + ' lon: ' + lon,
                      labelClass: "marker-labels",
                      labelAnchor:"100 0"
                    }
                };
                
                // Update $scope.formData lat and lng with marker position
                $scope.formData[0].value = $scope.map.clickedMarker.latitude;
                $scope.formData[1].value = $scope.map.clickedMarker.longitude;
                //scope apply required because this event handler is outside of the angular domain
                $scope.$evalAsync();
            }
            
        },
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
        ],
        rectangle: {
            stroke: {
                color: '#08B21F',
                weight: 2,
                opacity: 1
            },
            fill: {
                color: 'pink',
                opacity: 0.5
            },
            events:{
                dblclick: function(){
                    window.alert("rectangle dblclick");
                }
            },
            draggable: true, // optional: defaults to false
            clickable: true, // optional: defaults to true
            editable: true, // optional: defaults to false
            visible: true // optional: defaults to true
        },
        zoom: 3
    });
    
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
    
    /*$scope.addMarker = function (position) {
        alert(position);
    };*/
    
    /*$scope.marker = {
          id: 0,
          coords: {
            latitude: position[0],
            longitude: position[1]
          },
          options: { draggable: true },
          events: {
            dragend: function (marker, eventName, args) {
              $log.log('marker dragend');
              var lat = marker.getPosition().lat();
              var lon = marker.getPosition().lng();
              $log.log(lat);
              $log.log(lon);

              $scope.marker.options = {
                draggable: true,
                labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                labelAnchor: "100 0",
                labelClass: "marker-labels"
              };
            }
          }
        };*/
    
    
    /*
    GENERAL IDEA
    Initializer.mapsInitialized.then(function(){
        // Set center of map
        var haightAshbury = {lat: 37.769, lng: -122.446};
        
        // Create map
        $scope.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: haightAshbury,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        });
        
        // This event listener will call addMarker() when the map is clicked.
        $scope.map.addListener('click', function(event) {
            $scope.addMarker(event.latLng);
        });
    });
    
    // Adds a marker to the map and push to the array.
    $scope.addMarker = function (location) {
        var marker = new google.maps.Marker({
            position: location,
            map: $scope.map
        });

        // Clear markers from map, clear markers array, and push new marker (array is useful if more markers are to be added later)
        $scope.clearMarkers();
        $scope.markers = [];
        $scope.markers.push(marker);

        // Add info window to marker (to be used more later)
        var infowindow = new google.maps.InfoWindow({
            content: marker.position.lat() + ", " + marker.position.lng()
        });

        // Add click event to marker that displays infowindow
        marker.addListener('click', function() {
            infowindow.open($scope.map, marker);
        });
        
        // Update $scope.formData lat and lng with marker position
        $scope.formData[0].value = marker.position.lat();
        $scope.formData[1].value = marker.position.lng();
        // $apply() the changes.
        $scope.$apply();
        // TODO: CONVERT THE "addMarker()" function into a service. Services do the $apply themselves.
    }
    
    // Sets the map on all markers in the array.
    $scope.setMapOnAll = function (map) {
      for (var i = 0; i < $scope.markers.length; i++) {
        $scope.markers[i].setMap(map);
      }
    }

    // Removes the markers from the map, but keeps them in the array.
    $scope.clearMarkers = function () {
      $scope.setMapOnAll(null);
    }*/
    
}]);