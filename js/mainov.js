/**
 * License: MIT.
 * http://www.opensource.org/licenses/mit-license.php
 * blablablablab xcvxcvxvc
 */
( function( $, window, undefined ) {

	'use strict';

	// Main.
	var $body = $( 'html, body' );

	$.ETHAccordion = function( options, element ) {
		this.$elm = $( element );
		this._init( options );
	};

	// Options.
	$.ETHAccordion.defaults = {};

	$.ETHAccordion.prototype = {
		_init : function( options ) {
			// Options.
			this.options = $.extend( true, {}, $.ETHAccordion.defaults, options );
            
			// Cache elements and initialize variables.
			this._config();
            
			// Initialize / bind Events.
			this._initEvents();
		},
        
		_config : function() {
			// Clickable Items
			this.$items = this.$elm.find( '.eth-trigger' );
		},
        
		_initEvents : function() {
			this.$items.on( 'click.ethAccordion', function() {
				var $listItem = $( this ).parent();
                
				if ( $listItem.hasClass( 'eth-open' ) ) {
					$listItem.removeClass( 'eth-open' );
                    
				} else {
					$listItem.addClass( 'eth-open' );
                    // Scrolls to top
					// $body.scrollTop( $listItem.offset().top );
				}
			} );
		},
        
		destroy : function() {
			this.$items.off( '.ethAccordion' ).parent().removeClass( 'eth-open' );
		}
	};

	var logError = function( message ) {
		if ( window.console ) {
			window.console.error( message );
		}
	};

	$.fn.ethAccordion = function( options ) {
		if ( typeof options === 'string' ) {
			var args = Array.prototype.slice.call( arguments, 1 );
            
			this.each( function() {
				var instance = $.data( this, 'ethAccordion' );
                
				if ( !instance ) {
					logError( "Error:  Cannot call methods on ethAccordion before initialization. " +
					"Attempted to call method '" + options + "'." );
					return;
				}
                
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					logError( "Error:  No such method '" + options + "' for ethAccordion instance." );
					return;
				}
                
				instance[ options ].apply( instance, args );
			} );
            
		} else {
			this.each( function() {	
				var instance = $.data( this, 'ethAccordion' );
                
				if ( instance ) {
					instance._init();
                    
				} else {
					instance = $.data( this, 'ethAccordion', new $.ETHAccordion( options, this ) );
				}
			});
		}
        
		return this;
	};

} )( jQuery, window );