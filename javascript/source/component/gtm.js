!function ($) {
	/**
	* Component: GTM
	* @requires class.gtm
	**/

	App._component.gtm = {
		// Private properties
		_options: {
			'selector': '.btn'
		},
		_name: 'gtm',		
		// Methods
		init: function () {
			var self = this;
		
			if(!$(self._options.selector).length) return;

			self._bind();
		},
		/**
		* Bind
		* Bind basic event for handling communication with GTM
		**/
		_bind: function () {
			 $('.btn').on('click.track', function () {
        var options = App.getOptions(self._name);
        objGTM.track(this, 'event fired');
      });
		}
	};

	// Add private key to app.components to prevent this from loading when executed on load
	// Psydo code
}(jQuery);