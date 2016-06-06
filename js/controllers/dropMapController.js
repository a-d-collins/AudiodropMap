app.controller('dropMapController', ['$scope', 'uiGmapLogger', 'uiGmapGoogleMapApi', function($scope, $log, uiGmapGoogleMapApi) {
    // Form data
    // TODO -- Get form from Seth
    
    $scope.formData = [
        {dataType: "Longitude", value: undefined},
        {dataType: "Latitude", value: undefined},
        {dataType: "Album Name", value: "Abbey Road"},
        {dataType: "In your opinion, is Paul dead?", value: "Yes"}
    ];
    
    $scope.mapCenter = {latitude: 40.738341, longitude: -73.961062};
    $scope.map= {
        center: $scope.mapCenter,
        zoom: 12,
        clickedMarker: {
            id: 0
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
        rectangle: {
            bounds:{},
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
        }
    };
    $scope.markers = [];
    
    // When maps API is initialized...
    uiGmapGoogleMapApi.then(function(maps) {
        // It seems like I should be putting all of the Google Maps related functions and variable assignements in here, but I encounter errors each time I try that...
        console.log(maps);
        $scope.map.rectangle.bounds = new maps.LatLngBounds(
          new maps.LatLng(55,-100),
          new maps.LatLng(49,-78)
        );
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