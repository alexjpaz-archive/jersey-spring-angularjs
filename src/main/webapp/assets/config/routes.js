angular.module('app').config(function(RouteBuilderProvider){
	var RouteBuilder = RouteBuilderProvider.$get();
	RouteBuilder.redirect('/', '/dashboard');
	RouteBuilder.when('/dashboard', 'dashboard');
});

