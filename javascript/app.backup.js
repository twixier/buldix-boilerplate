'use strict';
	
	var w = window,
			d = document;
  
/**
* Default app container
**/
var Application = {
	// placeholder for registered plugins
	components: {},
	// Enable/Disable internal debugging
	debug: false,
	/**
	* Register and define a component to our global handling
	**/
	exports: function (component, name) {
		var className = this.dataattr(name);
		
		// Save component into local placeholder
		this._components[className] = this[className] = component;
	},
	getOptions: function (opts) {
		let elem = opts.elem,
				name = opts.name;

		const options = this.dataattr(name + '-options');
	
		return options;
	},
	/**
	* Generate correct data-attribute based on a componentname
	**/
	dataattr: function (str) {
		return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	}             
};