angular.module('helpers')
.config(function($provide, $compileProvider, $routeProvider) { 
	$provide.provider('AssetLoader', function() {

		function AssetRepository() {
			this.assets = [];

			this.importFromJSON = function(tree, basepath) {
				if(typeof basepath === 'undefined') {
					basepath = ['assets'];
				}

				for(var node in tree) {
					basepath.push(node)
					if(typeof tree[node] === 'object') {
						this.importFromJSON(tree[node], basepath);
					} else {
						var path = basepath.join('/');
						this.add(node, path+'.js')
					}

					basepath.pop();
				}

			};

			this.add = function(assetName, asset) {
				var aa = {};
				aa[asset] = asset;
				this.assets.push(aa);
			};
		};

		function AssetLoader() {

			this.importFromJSON = function(tree, basepath) {

			};

			this.load = function(headPackage, callback) {
				if(angular.isUndefined(callback)) {
					 callback = angular.noop;
				}
				head.load(headPackage, callback);
			};

			this.screen = function(screenName, callback) {
				var _this = this;

				$.ajax({
					url: 'assets/screen/'+screenName+'.json',
					dataType: 'json',
					success: function(data) {
						var assetRepository = new AssetRepository();
						assetRepository.importFromJSON(data);
						assetRepository.add(screenName, 'assets/screen/'+screenName+'.js');
						_this.load(assetRepository.assets, callback);
						_this.load('assets/screen/'+screenName+'.css'); // Asyncronous
					},
					error: function() {
						console.error('Unable to load dependecies for screen.', arguments);
					}
				});

			};
		}

		this.$get = function() {
			return new AssetLoader();
		};
	});
	$provide.provider('TemplateResolver', function() {
		function TemplateResolver() {
			this.screen = function(screenName) {
				return 'assets/screen/'+screenName+'.html';
			};
		}

		this.$get = function() {
			return new TemplateResolver();
		};
	});

	$provide.provider('RouteBuilder', function(TemplateResolverProvider, AssetLoaderProvider) {
		var TemplateResolver = TemplateResolverProvider.$get();
		var AssetLoaderProvider = AssetLoaderProvider.$get();

		function RouteBuilder() {
			this.redirect = function(urlPattern, redirectUrl) {
				var routeConfigObj = {
					redirectTo: redirectUrl	
				};
				$routeProvider.when(urlPattern, routeConfigObj);
			};

			this.when = function(urlPattern, screenName) {
				var routeConfigObj = {
					templateUrl: TemplateResolver.screen(screenName),
					resolve: {
						load: function ($q, $rootScope, AssetLoader) {
							var deferred = $q.defer();

							AssetLoader.screen(screenName, function() {

								if ($rootScope.$$phase) { 
									return deferred.resolve();
								} else {
									$rootScope.$apply(function () {
										deferred.resolve();
									});
								}

							});

							return deferred.promise;
						},
					}
				};
				$routeProvider.when(urlPattern, routeConfigObj);
			};
		}

		this.$get = function() {
			return new RouteBuilder();
		};
	});

	$provide.provider('ResourceFactory', function() {
		function ResourceFactory() {

			this.build = function(resouceName, rurl, paramDefaultsExtend, actionsExtend) {
				var resourceFactoryFn = function ($resource) {
					var  paramDefaults = {};
					var  actions = {

					};


					return $resource(rurl, paramDefaults, actions);
				};
				$provide.factory(resouceName, resourceFactoryFn);
			};
		}

		this.$get = function() {
			return new ResourceFactory();
		};
	});

	$provide.provider('DirectiveFactory', function() {
		function ComponentFactory() {
			this.build = function(component_name, controllerDef) {

				var componentFactoryObjFn = function() {
					var componentFactoryObj = {
						restrict: 'EA',
						template: 'assets/components/'+component_name+'.html',
						controller: controllerDef,
					};

					return componentFactoryObj;
				};

				var componentName = component_name.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase() });
				$compileProvider.directive(componentName, componentFactoryObjFn);
			}
		}

		this.$get = function() {
			return new ComponentFactory();
		};
	});

	$provide.provider('ComponentFactory', function() {
		function ComponentFactory() {
			this.build = function(component_name, controllerDef) {
				console.debug("Building component '%s'",component_name);

				var componentTemplateUrl = component_name;

				if(angular.isObject(controllerDef) && controllerDef.templateUrlBase) {
					componentTemplateUrl = [controllerDef.templateUrlBase,component_name].join('/');
				}

				var componentFactoryObjFn = function() {
					var defaultComponentFactoryObj = {
						restrict: 'EA',
						templateUrl: 'assets/components/'+componentTemplateUrl+'.html',
						scope: true,
						compile: function() {
							head.load('assets/components/'+componentTemplateUrl+'.css');
						},
					};

					var componentFactoryObj = {'derp':'haha'};


					if(!angular.isObject(controllerDef)) {
						componentFactoryObj.controller = controllerDef;
						angular.extend(componentFactoryObj, defaultComponentFactoryObj);
					} else {
						angular.extend(componentFactoryObj, defaultComponentFactoryObj, controllerDef);
					}

					return componentFactoryObj;
				};

				var componentName = component_name.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase() });
				$compileProvider.directive(componentName, componentFactoryObjFn);
			}
		}

		this.$get = function() {
			return new ComponentFactory();
		};
	});

	$provide.provider('ScreenFactory', function() {
		function ScreenFactory() {
			this.build = function(screen_name, controllerDef) {

				var screenFactoryObjFn = function() {
					var screenFactoryObj = {
						restrict: 'C',
						controller: controllerDef,
						compile: function() {
							head.load('assets/components/'+screen_name+'.css');
						},
					};

					return screenFactoryObj;
				};

				var screenName = screen_name.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase() });
				$compileProvider.directive(screenName, screenFactoryObjFn);
			}
		}

		this.$get = function() {
			return new ScreenFactory();
		};
	});
})

