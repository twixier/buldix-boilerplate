'use strict';

/*
* Tagmanager
* Class for handling event-based tracking directly trough Google Tag Manager
**/

!(function () {
	
  class Tagmanager {
    constructor() {
     
    }
    
    init () {
      var $body = App.locate('body');
      $body.event.add('click', function () {});
    }
  }
  
  App.register(Tagmanager, 'tagmanager');
})();
