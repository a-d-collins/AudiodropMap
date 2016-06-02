app.controller('dropMapController', ['$scope', 'Initializer', function($scope, Initializer) {
    // Form data
    // TODO -- Get form from Seth
    
    $scope.formData = [
        {dataType: "Longitude", value: undefined},
        {dataType: "Latitude", value: undefined},
        {dataType: "Album Name", value: "Abbey Road"},
        {dataType: "In your opinion, is Paul dead?", value: "Yes"}
    ];
    
    $scope.map;
    $scope.markers = [];
    
    // When maps API is initialized...
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
    }
    
    /*
    GENERAL IDEA... works as regular JS...
    NOT READY TO BE INTEGRATED into AJS YET
    
    var map;
    var markers = [];
    
    function initMap() {
        var haightAshbury = {lat: 37.769, lng: -122.446};

        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: haightAshbury,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        });

        // This event listener will call addMarker() when the map is clicked.
        map.addListener('click', function(event) {
            addMarker(event.latLng);
        });

        // Adds a marker at the center of the map.
        //addMarker(haightAshbury);
    }
    
    // Adds a marker to the map and push to the array.
    function addMarker(location) {
      var marker = new google.maps.Marker({
        position: location,
        map: map
      });
      clearMarkers();
      markers = [];
      markers.push(marker);

      var infowindow = new google.maps.InfoWindow({
        content: location.lat() + ", " + location.lng()
      });

      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });
    }

    // Sets the map on all markers in the array.
    function setMapOnAll(map) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
    }

    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
      setMapOnAll(null);
    }*/
}]);