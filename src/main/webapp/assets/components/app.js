angular.module('app').config(function(ComponentFactoryProvider) {
	var ComponentFactory = ComponentFactoryProvider.$get();

	console.log('hi');
	ComponentFactory.build('app', function() {
	});
});
