angular.module('app', ['helpers','ngRoute'])
.config(function($controllerProvider, $provide, $compileProvider, $filterProvider, ScreenFactoryProvider, ComponentFactoryProvider) {
	angular.module('app').lazy = {
		screen: ScreenFactoryProvider.$get().build,
		component: ComponentFactoryProvider.$get().build,
        controller: $controllerProvider.register,
        directive: $compileProvider.directive,
        filter: $filterProvider.register,
        factory: $provide.factory,
        service: $provide.service,
//        animation: $animationProvider.register
    };
});
