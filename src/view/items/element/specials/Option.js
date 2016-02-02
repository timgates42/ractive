import Element from '../../Element';
import { removeFromArray } from '../../../../utils/array';
import { isArray } from '../../../../utils/is';

function findParentSelect ( element ) {
	while ( element ) {
		if ( element.name === 'select' ) return element;
		element = element.parent;
	}
}

export default class Option extends Element {
	constructor ( options ) {
		super( options );

		this.select = findParentSelect( this.parent );
	}

	bind () {
		if ( !this.select ) {
			super.bind();
			return;
		}

		// If the select has a value, it overrides the `selected` attribute on
		// this option - so we delete the attribute
		const selectedAttribute = this.attributeByName.selected;
		if ( selectedAttribute && this.select.getAttribute( 'value' ) !== undefined ) {
			const index = this.attributes.indexOf( selectedAttribute );
			this.attributes.splice( index, 1 );
			delete this.attributeByName.selected;
		}

		super.bind();
		this.select.options.push( this );
	}

	getAttribute ( name ) {
		const attribute = this.attributeByName[ name ];
		return attribute ? attribute.getValue() : name === 'value' && this.fragment ? this.fragment.valueOf() : undefined;
	}

	isSelected () {
		const optionValue = this.getAttribute( 'value' );

		if ( optionValue === undefined || !this.select ) {
			return false;
		}

		const selectValue = this.select.getAttribute( 'value' );

		if ( selectValue == optionValue ) {
			return true;
		}

		if ( this.select.getAttribute( 'multiple' ) && isArray( selectValue ) ) {
			let i = selectValue.length;
			while ( i-- ) {
				if ( selectValue[i] == optionValue ) {
					return true;
				}
			}
		}
	}

	render ( target, occupants ) {
		super.render( target, occupants );

		if ( !this.attributeByName.value ) {
			this.node._ractive.value = this.getAttribute( 'value' );
		}
	}

	unbind () {
		super.unbind();

		if ( this.select ) {
			removeFromArray( this.select.options, this );
		}
	}
}
