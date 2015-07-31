var app =angular.module('WIP', ['ui.router','ngTable']);


app.config(function($stateProvider) {
    // Now set up the states
    $stateProvider
        .state('orders', {
            templateUrl: './modules/common/partials/ordersNew.html',
            controller: 'OrdersCtrl'
        });


});

app.run(function($state){
    $state.go('orders');
});

