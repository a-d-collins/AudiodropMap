var app = angular.module('dropMapApp',['uiGmapgoogle-maps']);

app.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBn-hzp1y730IWw6Zo-fTGZtMYbcbJitTQ',
        v: '3.exp', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
});