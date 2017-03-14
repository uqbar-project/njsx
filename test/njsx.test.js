import { expect } from 'chai'
import React, {Component as ReactComponent} from 'react'
import njsx from '../src/njsx.js'
import Rules from '../src/rules.js'

const {defineProperty} = Object

describe('NJSX', () => {

	describe('elements', () => {
		it('should be creatable from a type name', () => {
			const element = njsx('foo')()

			expect(element).to.deep.equal(<foo/>)
		})
		
		it('should be creatable from a React component', () => {
			class Component extends ReactComponent { render() { return <foo/> } }
			const element = njsx(Component)()

			expect(element).to.deep.equal(<Component/>)
		})
		
		it('should be creatable from a React functional component', () => {
			const FunctionalComponent = () => createReactElement('foo')
			const element = njsx(FunctionalComponent)()

			expect(element).to.deep.equal(<FunctionalComponent/>)
		})

		it('should be refinable by passing attributes as a hash', () => {
			njsx.rules = [Rules.HASH_AS_ATRIBUTES]
			const element = njsx('foo')({bar: 'meh'})()

			expect(element).to.deep.equal(<foo bar='meh'/>)
		})

		it('should be refinable by passing a string representing a class name', () => {
			njsx.rules = [Rules.STRING_AS_CLASS]
			const element = njsx('foo')('.bar.meh')()

			expect(element).to.deep.equal(<foo className="bar meh"/>)
		})

		it('should be refinable by passing a string representing content', () => {
			njsx.rules = [Rules.STRING_AS_CHILD]
			const element = njsx('foo')('bar')()

			expect(element).to.deep.equal(<foo>bar</foo>)
		})

		it('should be refinable by passing a number representing content', () => {
			njsx.rules = [Rules.NUMBER_AS_CHILD]
			const element = njsx('foo')(5)()

			expect(element).to.deep.equal(<foo>5</foo>)
		})

		it('should be refinable by passing a boolean representing content', () => {
			njsx.rules = [Rules.BOOLEAN_AS_CHILD]
			const element = njsx('foo')(false)()

			expect(element).to.deep.equal(<foo>false</foo>)
		})

		it('should be refinable by passing other React elements as children', () => {
			njsx.rules = [Rules.REACT_COMPONENT_AS_CHILD]
			const element = njsx('foo')(<bar/>,<meh/>)()

			expect(element).to.deep.equal(<foo><bar/><meh/></foo>)
		})

		it('should be refinable by passing other NJSX elements as children', () => {
			njsx.rules = [Rules.NJSX_COMPONENT_AS_CHILD]
			const element = njsx('foo')(njsx('bar'), njsx('meh'))()

			expect(element).to.deep.equal(<foo><bar/><meh/></foo>)
		})

		it('should be refinable by passing an array of children', () => {
			njsx.rules = [Rules.NJSX_COMPONENT_AS_CHILD]
			const element = njsx('foo')([njsx('bar'), njsx('meh')])()

			expect(element).to.deep.equal(<foo><bar/><meh/></foo>)
		})

		it('should ignore null arguments', () => {
			njsx.rules = [Rules.IGNORE_NULL]
			const element = njsx('foo')(null, [null])()

			expect(element).to.deep.equal(<foo/>)
		})

		it('should ignore undefined arguments', () => {
			njsx.rules = [Rules.IGNORE_UNDEFINED]
			const element = njsx('foo')(undefined,[undefined])()

			expect(element).to.deep.equal(<foo/>)
		})

		it('should not be refinable by invalid arguments', () => {
			const element = njsx('foo')

			expect(() => element((invalid) => 'argument')).to.throw(TypeError)
		})
	})

})