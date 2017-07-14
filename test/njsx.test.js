import { expect, assert } from 'chai'
import mock from 'mock-require'
import React, { Component as ReactComponent } from 'react'
import njsx from '../src/index.js'
import Rules from '../src/rules.js'

const { keys, assign, defineProperty } = Object

mock('react-native', {
	StyleSheet: {
		create: (styleDefinition) => keys(styleDefinition).reduce((acum, key) => assign(acum, { [key]: 1 }), {})
	}
})
const { StyleSheet } = require("../src/react-native.js")

describe('NJSX', () => {

	describe('components', () => {
		it('should be creatable from a type name', () => {
			const component = njsx('foo')()

			expect(component).to.deep.equal(<foo />)
		})

		it('should be creatable from a React component', () => {
			class Component extends ReactComponent { render() { return <foo /> } }
			const component = njsx(Component)()

			expect(component).to.deep.equal(<Component />)
		})

		it('should be creatable from a React functional component', () => {
			const FunctionalComponent = () => createReactElement('foo')
			const component = njsx(FunctionalComponent)()

			expect(component).to.deep.equal(<FunctionalComponent />)
		})

		it('should be refinable by passing attributes as a hash', () => {
			njsx.rules = [Rules.HASH_AS_ATRIBUTES]
			const component = njsx('foo')({ bar: 'baz' })()

			expect(component).to.deep.equal(<foo bar='baz' />)
		})

		it('should be refinable by passing a string representing a class name', () => {
			njsx.rules = [Rules.STRING_AS_CLASS]
			const component = njsx('foo')('.bar.baz')('.qux')()

			expect(component).to.deep.equal(<foo className="bar baz qux" />)
		})

		it('should be refinable by passing a string representing content', () => {
			njsx.rules = [Rules.STRING_AS_CHILD]
			const component = njsx('foo')('bar')()

			expect(component).to.deep.equal(<foo>bar</foo>)
		})

		it('should be refinable by passing a number representing content', () => {
			njsx.rules = [Rules.NUMBER_AS_CHILD]
			const component = njsx('foo')(5)()

			expect(component).to.deep.equal(<foo>5</foo>)
		})

		it('should be refinable by passing a boolean representing content', () => {
			njsx.rules = [Rules.BOOLEAN_AS_CHILD]
			const component = njsx('foo')(false)()

			expect(component).to.deep.equal(<foo>false</foo>)
		})

		it('should be refinable by passing other React components as children', () => {
			njsx.rules = [Rules.REACT_COMPONENT_AS_CHILD]
			const component = njsx('foo')(<bar />, <baz />)()

			expect(component).to.deep.equal(<foo><bar /><baz /></foo>)
		})

		it('should be refinable by passing other NJSX components as children', () => {
			njsx.rules = [Rules.NJSX_COMPONENT_AS_CHILD]
			const component = njsx('foo')(njsx('bar'), njsx('baz'))()

			expect(component).to.deep.equal(<foo><bar /><baz /></foo>)
		})

		it('should be refinable by passing an array of children', () => {
			njsx.rules = [Rules.NJSX_COMPONENT_AS_CHILD]
			const component = njsx('foo')([njsx('bar'), njsx('baz')])()

			expect(component).to.deep.equal(<foo><bar /><baz /></foo>)
		})

		it('should ignore null arguments', () => {
			njsx.rules = [Rules.IGNORE_NULL]
			const component = njsx('foo')(null, [null])()

			expect(component).to.deep.equal(<foo />)
		})

		it('should ignore null, even if it can be refined by other objects', () => {
			njsx.rules = [Rules.REACT_COMPONENT_AS_CHILD, Rules.HASH_AS_ATRIBUTES, Rules.STYLE_AS_STYLE, Rules.IGNORE_NULL]
			const component = njsx('foo')(null, [null])()

			expect(component).to.deep.equal(<foo></foo>)
		})

		it('should ignore undefined arguments', () => {
			njsx.rules = [Rules.IGNORE_UNDEFINED]
			const component = njsx('foo')(undefined, [undefined])()

			expect(component).to.deep.equal(<foo />)
		})

		it('should not be refinable by invalid arguments', () => {
			const component = njsx('foo')

			expect(() => component("unsupported argument")).to.throw(TypeError)
		})

		it('should be refinable by dynamic messages if a handler is defined', () => {
			njsx.dynamicSelectorHandler = Rules.STRING_AS_CLASS.apply
			const component = njsx('foo').bar.baz.qux()

			expect(component).to.deep.equal(<foo className="bar baz qux" />)
		})

		it('should be refinable by property key accessing if a handler is defined', () => {
			njsx.dynamicSelectorHandler = Rules.STRING_AS_CLASS.apply
			const component = njsx('foo')['.bar']['baz qux']()

			expect(component).to.deep.equal(<foo className="bar baz qux" />)
		})

		it('should not be refinable by dynamic messages if a handler is not defined', () => {
			njsx.dynamicSelectorHandler = undefined
			const component = njsx('foo').bar

			expect(component).to.deep.equal(undefined)
		})

		it('should not be refinable by dynamic messages after the component is built', () => {
			njsx.dynamicSelectorHandler = assert.fail
			const component = njsx('foo')().bar
		})

		describe('should be refinable by njsx styles when', () => {
			const styleSheet = StyleSheet.create({ style: { bar: "baz" } })

			it('no previous style is defined', () => {
				njsx.rules = [Rules.STYLE_AS_STYLE]
				const component = njsx('foo')(styleSheet.style)()

				expect(component).to.deep.equal(<foo style={1} />)
			})

			it('style is already defined as array', () => {
				njsx.rules = [Rules.STYLE_AS_STYLE, Rules.HASH_AS_ATRIBUTES]
				const component = njsx('foo')({ style: [5] })(styleSheet.style)()

				expect(component).to.deep.equal(<foo style={[5, 1]} />)
			})

			it('style is already defined as object', () => {
				njsx.rules = [Rules.STYLE_AS_STYLE, Rules.HASH_AS_ATRIBUTES]
				const component = njsx('foo')({ style: { bar: "baz" } })(styleSheet.style)()

				expect(component).to.deep.equal(<foo style={[{ bar: "baz" }, 1]} />)
			})

			it('style is already defined as id', () => {
				njsx.rules = [Rules.STYLE_AS_STYLE, Rules.HASH_AS_ATRIBUTES]
				const component = njsx('foo')({ style: 5 })(styleSheet.style)()

				expect(component).to.deep.equal(<foo style={[5, 1]} />)
			})

			it('style is already defined and a new style is set as hash attribute', () => {
				njsx.rules = [Rules.STYLE_AS_STYLE, Rules.HASH_AS_ATRIBUTES]
				const component = njsx('foo')(styleSheet.style)({ style: 5 })()

				expect(component).to.deep.equal(<foo style={[1, 5]} />)
			})

		})

	})

})