angular.module('app').config(function(ComponentFactoryProvider) {
	var ComponentFactory = ComponentFactoryProvider.$get();
	ComponentFactory.build('navbar', {
		templateUrlBase: 'layout',
		controller: function() {
		}
	});
});
