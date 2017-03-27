'use strict';

  var _ = require('source/app.js');

var w = window,
			d = document; 
     
/** 
* Default app container
**/
var App = {
	// placeholder for registered plugins
	_components: {}, 
	// Enable/Disable internal debugging
	debug: false,
	register: function (component, name, opts) {
		var className = this.dataattr(name);
    
    this._components[className] = this[className] = component;

    var objComponent = new component;
    
    // initialize component
    objComponent.init(); 
	},
	/**
	* Generate correct data-attribute based on a componentname
	**/
	dataattr: function (str) {
		return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	},
  /*
  * Custom DOM Selector
  **/
  locate: (element) => {
    let search = d.querySelectorAll(element);
    return search;
  },   
  /**
  * Event handling
  **/
  event: {
    on: function (event, fn) {
      
    },
    off: function () {
      
    }        
  }
};

w.App = App;