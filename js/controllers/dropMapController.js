app.controller('dropMapController', ['$scope', function($scope) {
    // Form data
    // TODO -- Get form from Seth
    $scope.formData = [
        {dataType: "Longitude", value: 50.0000},
        {dataType: "Latitude", value: 50.0000},
        {dataType: "Album Name", value: "Abbey Road"},
        {dataType: "In your opinion, is Paul dead?", value: "Yes"}
    ];
    
    // Insert AJS-adapted google maps stuff below...
    
    /*
    GENERAL IDEA...
    NOT READY TO BE INTEGRATED YET
    
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