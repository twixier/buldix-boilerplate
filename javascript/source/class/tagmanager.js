'use strict';

!function () {
	/**
	* GTM
	* Handles logic between our component-based operators and our dataLayer
	* @module app.gtm
	**/

	class gtm {
		constructor () {
			this.datalayer = window.dataLayer || {}; // Mapping for datalayer

			// Construct a placeholder for current dated sent through dataLayer
			this.data = [];
		}

		/**
		* Set
		* Build an object that can be parsed to datalayer
		* @public
		* @param {object} options - options used to build a datalayer 
		**/
		set (options) {
			var parsed = this._parse(options);

			// push parsed value into datalayer 
			this.data.push(parsed);

			
		}

		/** 
		* Issue a track through gtm
		**/
		_trackEvent () {
			
		}

		_trackPageview () {

		}

		/** 
		* Parse
		* Parse and prepare values to be inserted into datalayer
		* @private
		* @param {object} options - options to validated and parse into datalayer
		*/
		_parse (options) {
			let placeholder;
			for(var i = 0; i < options.length; i++) {
				// Iterate through properties and set them into custom event tracking properties
			}

			return placeholder;
		}

		/**
		* Reset
		* After a message has been sent through datalayer, we're gonna reset our local container
		**/
		_reset () {
			this.data = [];
		}
	}

	export default gtm;
}();