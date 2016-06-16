app.controller('InfoController', function ($scope) {
    $scope.templateValue = 'hello from the template itself';
    $scope.clickedButtonInWindow = function () {
        var msg = 'clicked a window in the template!';
        alert(msg);
    }
});