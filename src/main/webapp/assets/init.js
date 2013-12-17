head.load('assets/lib/jquery-1.10.2.min.js', function() {

	function BootstrapException(message, cause) {
		this.name = 'BootstrapException';
		this.message = message;
		this.cause = cause;
		this.toString = function() {
			return this.name + ": " + this.message + "\nCaused By: " + cause.stack;
		}
	}

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

	var assetRepository = new AssetRepository();

	function Bootstrap(response) {
		console.debug('response',response);
		var imports = null;

		try {
			imports = $.parseJSON(response.responseText);
		} catch(e) {
			console.warn('JSON Parse error, falling back to eval');
			try {
				imports = eval('('+response.responseText+')');
			} catch(e) {
				err = new BootstrapException("Could not load 'import.json', make sure it contians valid javascript/JSON", e);
				console.error(err);
				document.write('<h2>Failed to bootstrap application</h2><pre style="color: red">'+err+'</pre>');
			}
		}

		assetRepository.importFromJSON(imports);
		head.load(assetRepository.assets, function() {
			try {
				angular.bootstrap(document, ['app']);
			} catch(e) {
				console.error(e.message);
				var htmlMessage = $('<div/>').text(e.message).html();
				document.write("<div style='color:red'><h2>Failed to bootstrap application</h2><pre>"+htmlMessage+"</pre></div>");
			}
		});
	}

	$.ajax({
		url: 'assets/import.json',
		complete: Bootstrap
	});
});
