/**
 * Makes sure we have all the required levels on the Tribe Object
 *
 * @since TBD
 *
 * @type   {PlainObject}
 */
tribe.events = tribe.events || {};
tribe.events.views = tribe.events.views || {};

/**
 * Configures Breakpoints Object in the Global Tribe variable
 *
 * @since TBD
 *
 * @type   {PlainObject}
 */
tribe.events.views.breakpoints = {};

/**
 * Initializes in a Strict env the code that manages the Event Views
 *
 * @since  TBD
 *
 * @param  {PlainObject} $   jQuery
 * @param  {PlainObject} obj tribe.events.views.breakpoints
 *
 * @return {void}
 */
( function( $, obj ) {
	'use strict';
	var $document = $( document );
	var $window = $( window );

	/**
	 * Selectors used for configuration and setup
	 *
	 * @since TBD
	 *
	 * @type {PlainObject}
	 */
	obj.selectors = {
		container: '[data-js="tribe-events-view"]',
		dataScript: '[data-js="tribe-events-view-data"]',
		breakpointClassPrefix: 'tribe-common--breakpoint-',
	};

	/**
	 * Sets container classes based on breakpoint
	 *
	 * @since  TBD
	 *
	 * @param  {jQuery}  $container jQuery object of view container.
	 * @param  {object}  data       data object passed from 'afterSetup.tribeEvents' event.
	 *
	 * @return {void}
	 */
	obj.setContainerClasses = function( $container, data ) {
		var breakpoints = Object.keys( data.breakpoints );

		breakpoints.forEach( function( breakpoint ) {
			var className = obj.selectors.breakpointClassPrefix + breakpoint;

			if ( $container.outerWidth() < data.breakpoints[ breakpoint ] ) {
				$container.removeClass( className );
			} else {
				$container.addClass( className );
			}
		} );
	};

	/**
	 * Handles resize event for window
	 *
	 * @since  TBD
	 *
	 * @param  {Event} event event object for 'resize' event
	 *
	 * @return {void}
	 */
	obj.handleResize = function( event ) {
		obj.setContainerClasses( event.data.container, event.data.data );
	};

	/**
	 * Unbinds events for container
	 *
	 * @since  TBD
	 *
	 * @param  {jQuery} $container jQuery object of view container
	 *
	 * @return {void}
	 */
	obj.unbindEvents = function( $container ) {
		$container.off( 'beforeAjaxSuccess.tribeEvents', obj.deinit );
		$window.off( 'resize', obj.handleResize );
	};

	/**
	 * Binds events for container
	 *
	 * @since  TBD
	 *
	 * @param  {jQuery}  $container jQuery object of view container.
	 * @param  {object}  data       data object passed from 'afterSetup.tribeEvents' event.
	 *
	 * @return {void}
	 */
	obj.bindEvents = function( $container, data ) {
		$container.on( 'beforeAjaxSuccess.tribeEvents', { container: $container }, obj.deinit );
		$window.on( 'resize', { container: $container, data: data }, obj.handleResize );
	};

	/**
	 * Deinitialize breakpoints JS
	 *
	 * @since  TBD
	 *
	 * @param  {Event}       event    event object for 'beforeAjaxSuccess.tribeEvents' event
	 * @param  {jqXHR}       jqXHR    Request object
	 * @param  {PlainObject} settings Settings that this request was made with
	 *
	 * @return {void}
	 */
	obj.deinit = function( event, jqXHR, settings ) {
		obj.unbindEvents( event.data.container );
	};

	/**
	 * Common initialization tasks
	 *
	 * @since  TBD
	 *
	 * @param  {jQuery}  $container jQuery object of view container.
	 * @param  {object}  data       data object passed from 'afterSetup.tribeEvents' event.
	 *
	 * @return {void}
	 */
	obj.initTasks = function( $container, data ) {
		obj.bindEvents( $container, data );
		obj.setContainerClasses( $container, data );

		var state = { initialized: true };
		$container.data( 'tribeEventsBreakpoints', state );
	};

	/**
	 * Initialize breakpoints JS
	 *
	 * @since  TBD
	 *
	 * @param  {Event}   event      event object for 'afterSetup.tribeEvents' event
	 * @param  {integer} index      jQuery.each index param from 'afterSetup.tribeEvents' event.
	 * @param  {jQuery}  $container jQuery object of view container.
	 * @param  {object}  data       data object passed from 'afterSetup.tribeEvents' event.
	 *
	 * @return {void}
	 */
	obj.init = function( event, index, $container, data ) {
		var state = $container.data( 'tribeEventsBreakpoints' );
		if ( state && state.initialized ) {
			return;
		}

		obj.initTasks( $container, data );
	};

	/**
	 * Setup breakpoints JS
	 *
	 * @since  TBD
	 *
	 * @param  {HTMLElement} script HTML element of the script tag calling setup
	 *
	 * @return {void}
	 */
	obj.setup = function( script ) {
		var $container = $( script ).prev( obj.selectors.container );
		var $data = $container.find( obj.selectors.dataScript );
		var data = {};

		// If we have data element set it up.
		if ( $data.length ) {
			data = JSON.parse( $.trim( $data.text() ) );
		}

		obj.initTasks( $container, data );
	};

	/**
	 * Handles the initialization of breakpoints when Document is ready
	 *
	 * @since  TBD
	 *
	 * @return {void}
	 */
	obj.ready = function() {
		$document.on( 'afterSetup.tribeEvents', obj.selectors.container, obj.init );
	};

	// Configure on document ready
	$document.ready( obj.ready );
} )( jQuery, tribe.events.views.breakpoints );
