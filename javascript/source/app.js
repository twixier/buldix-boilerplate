'use strict';
	
	var w = window,
			d = document;

/**
* Default app container
**/
var App = {
	// placeholder for registered plugins
	_components: {},
	_topics: {}, // Mediator placeholder
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
	register: function (component, name) {
		var className = this.dataattr(name);
		
		console.log(component);

		component.elm.publish('init.' + className);
	},
	/**
	* Generate correct data-attribute based on a componentname
	**/
	dataattr: function (str) {
		return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	},
	/**
	* @function
	* Mediator implementation of a broadcast system
	**/
	subscribe: function (topic, cb) {
		if(!this._topics.hasOwnProperty(topic)) {
			this._topics[topic] = [];
		}
	
		this._topics[topic].push(cb);
	
		return true;
	},
	unsubscribe: function (topic, cb) {
		if( ! this._topics.hasOwnProperty( topic ) ) {
			return false;
		}

		for( var i = 0, len = this._topics[ topic ].length; i < len; i++ ) {
			if( this._topics[ topic ][ i ] === cb) {
				this._topics[ topic ].splice( i, 1 );
				return	 true;
			}
		}

		return false;
	},
	publish: function () {
		var args = Array.prototype.slice.call( arguments );
		var topic = args.shift();

		if( ! this._topics.hasOwnProperty( topic ) ) {
			return false;
		}

		for( var i = 0, len = this._topics[ topic ].length; i < len; i++ ) {
			this._topics[ topic ][ i ].apply( undefined, args );
		}
		return true;
	} 
};

w.App = App;