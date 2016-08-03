'use strict';

!(function () {
	
	var tagmanager = function () {

		this.elm = '';

		var __constructor	= function (that) {
			that.elm = 'body';
		}(this)

		this.init = function () {
			console.log("init");
		}
		
		
		this.init();

		App.register(this, 'tagmanager');

	};	

	// Subsribe to events
	var TagManager = new tagmanager();


	// Export current component go global namespace
	App.exports(tagmanager, 'tagmanager');
})();
