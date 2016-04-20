/**
 * License: MIT.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 */
( function( window ) {

	var viewElm = document.querySelector( '.view' ),
		gridElm = viewElm.querySelector( '.grid' ),
		items = [].slice.call( gridElm.querySelectorAll( '.product' ) ),
		bag;

	// The Compare Bag
	function CompareBag() {
		this.elm = document.querySelector( '.compare-bag' );
		this.compareCtrl = this.elm.querySelector( '.action--compare' );
		this.compareWrapper = document.querySelector( '.compare' ),
		this.closeCompareCtrl = this.compareWrapper.querySelector( '.action--close' )
		
		this.itemsAllowed = 5;
		this.totalItems = 0;
		this.items = [];

		// Compares Items in the Compare Bag:
        
        // Open Compare Products Wrapper
		this.compareCtrl.addEventListener( 'click', this._compareItems.bind( this ) );
        
		// Close Compare Products Wrapper
		var self = this;
        
		this.closeCompareCtrl.addEventListener( 'click', function() {
			// Toggle Compare Bag
			classie.add( self.elm, 'compare-bag--active' );
            
			// Animate Compare Bag
			classie.remove( viewElm, 'view--compare' );
		} );
	}

	CompareBag.prototype.add = function( item ) {
		if ( this.isFull() ) {
			return false;
		}

		classie.add( item, 'product--selected' );

		// Create Item Preview
		var preview = this._createItemPreview( item );
        
		// Prepend it to Bag
		this.elm.insertBefore( preview, this.elm.childNodes[ 0 ] );
        
		// Insert Item
		this.items.push( preview );

		this.totalItems++;
        
		if ( this.isFull() ) {
			classie.add( this.elm, 'compare-bag--full' );
		}

		classie.add( this.elm, 'compare-bag--active' );
	};

	CompareBag.prototype._createItemPreview = function( item ) {
		var self = this;

		var preview = document.createElement( 'div' );
        
		preview.className = 'product-icon';
		preview.setAttribute( 'data-idx', items.indexOf( item ) );
		
		var removeCtrl = document.createElement( 'button' );
        
		removeCtrl.className = 'action action--remove';
		removeCtrl.innerHTML = '<i class="fa fa-remove"></i><span class="action__text action__text--invisible">Remove product</span>';
		
        removeCtrl.addEventListener( 'click', function() {
			self.remove( item );
		} );
		
		var productImageElm = item.querySelector( 'img.product__image' ).cloneNode( true );

		preview.appendChild( productImageElm );
		preview.appendChild( removeCtrl );

		var productInfo = item.querySelector( '.product__info' ).innerHTML;
		
        preview.setAttribute( 'data-info', productInfo );

		return preview;
	};

	CompareBag.prototype.remove = function( item ) {
		classie.remove( this.elm, 'compare-bag--full' );
		classie.remove( item, 'product--selected' );
		
        var preview = this.elm.querySelector( '[data-idx = "' + items.indexOf( item ) + '"]' );
		
        this.elm.removeChild( preview );
		this.totalItems--;

		var indexRemove = this.items.indexOf( preview );
		
        this.items.splice( indexRemove, 1 );

		if ( this.totalItems === 0 ) {
			classie.remove( this.elm, 'compare-bag--active' );
		}

		// Compare Selection Checkbox
		var checkbox = item.querySelector( '.action--compare-add > input[type = "checkbox"]' );
		
        if ( checkbox.checked ) {
			checkbox.checked = false;
		}
	};

	CompareBag.prototype._compareItems = function() {
		var self = this;

		// Remove all previous Items from compareWrapper
		[].slice.call( this.compareWrapper.querySelectorAll( 'div.compare__item' ) ).forEach( function( item ) {
			self.compareWrapper.removeChild( item );
		} );

		for ( var i = 0; i < this.totalItems; ++i ) {
			var compareItemWrapper = document.createElement( 'div' );
			
            compareItemWrapper.className = 'compare__item';

			var compareItemEffectElm = document.createElement( 'div' );
			
            compareItemEffectElm.className = 'compare__effect';
			compareItemEffectElm.innerHTML = this.items[ i ].getAttribute( 'data-info' );
			compareItemWrapper.appendChild( compareItemEffectElm );

			this.compareWrapper.insertBefore( compareItemWrapper, this.compareWrapper.childNodes[ 0 ] );
		}

		setTimeout( function() {
			// Toggle Compare Bag
			classie.remove( self.elm, 'compare-bag--active' );
			
            // Animate Compare Bag
			classie.add( viewElm, 'view--compare' );
		}, 25 );
	};

	CompareBag.prototype.isFull = function() {
		return this.totalItems === this.itemsAllowed;
	};

	function init() {
		// Initialize an empty Bag
		bag = new CompareBag();
		initEvents();
	}

	function initEvents() {
		items.forEach( function( item ) {
			var checkbox = item.querySelector( '.action--compare-add > input[type = "checkbox"]' );
			
            checkbox.checked = false;

			// Add to the Compare Bag
			checkbox.addEventListener( 'click', function( ev ) {
				if ( ev.target.checked ) {
					if ( bag.isFull() ) {
						ev.preventDefault();
						return false;
					}
                    
					bag.add( item );
                    
				} else {
					bag.remove( item );
				}
			} );
		} );
	}

	init();

} ) ( window );