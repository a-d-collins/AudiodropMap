app.controller('dropMapController', ['$scope', 'uiGmapLogger', 'uiGmapGoogleMapApi', function($scope, $log, uiGmapGoogleMapApi) {
    // Form data
    // TODO -- Get form from Seth
    
    // General data for the form
    
    // User data for the form that appears next to the map
    $scope.userFormData = [
        {dataLabel: "Name:", value: undefined, type: "text", name: "label"},
        {dataLabel: "Latitude:", value: undefined, type: "number", name: "lat"},
        {dataLabel: "Longitude:", value: undefined, type: "number", name: "long"},
        {dataLabel: "Album Name:", value: "Abbey Road", type: "text", name: "album"},
        {dataLabel: "Comment: ", value: "My client prefers not to comment at this time", type: "text", name: "comment"}
    ];
    
    $scope.mapCenter = {latitude: 40.738341, longitude: -73.961062};
    
    // Main map object. Contains all marker, shape, and other map-related data
    $scope.map= {
        center: $scope.mapCenter,
        zoom: 12,
        clickedMarker: {
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
    });
    
    // Functions
    // deleteMarker -- Arguments: none; Return: none; Role: Deletes the 'clickedMarker' and the circle associated with it.
    $scope.deleteMarker = function () {
        $scope.map.clickedMarker = null;
        $scope.map.circles[0].center = {};
        $scope.userFormData.forEach(function (el) {
            el.value = undefined;
        });
        $scope.$apply();
    };
    
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
        clickedMarker: {
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
                
                $scope.map.clickedMarker = {
                    latitude: lat,
                    longitude: lon,
                    options: {
                        animation: 2
                    }
                };
                
                // Set center of circles[0] with radius 100ft(~30.48m)
                $scope.map.circles[0].center = new google.maps.LatLng(lat, lon);
                
                // Update $scope.userFormData lat and lng with marker position
                $scope.userFormData[1].value = $scope.map.clickedMarker.latitude;
                $scope.userFormData[2].value = $scope.map.clickedMarker.longitude;
                //scope apply required because this event handler is outside of the angular domain
                $scope.$evalAsync();
            }
            
        }
    });
    
}]);