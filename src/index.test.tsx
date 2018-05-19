import { assert, expect } from 'chai'
import * as React from 'react'
import njsx, { NJSXConfig } from './index'
import { BuilderState } from './index'

// TODO: test argument transformation for every possible type return

describe('NJSX', () => {

  describe('components', () => {
    it('should be creatable from a type name', () => {
      const component = njsx('div')()

      expect(component).to.deep.equal(<div />)
    })

    it('should be creatable from a React component', () => {
      class Component extends React.Component {
        render() { return <div /> }
      }
      const component = njsx(Component)()

      expect(component).to.deep.equal(<Component />)
    })

    it('should be creatable from a React functional component', () => {
      const FunctionalComponent = () => <div />
      const component = njsx(FunctionalComponent)()

      expect(component).to.deep.equal(<FunctionalComponent />)
    })

    it('should be refinable by passing attributes as a hash', () => {
      const component = njsx('div')({ className: 'none' })()

      expect(component).to.deep.equal(<div className='none' />)
    })

    it('should be refinable by passing a string representing content', () => {
      const component = njsx('div')('bar')()

      expect(component).to.deep.equal(<div>bar</div>)
    })

    it('should be refinable by passing a number representing content', () => {
      const component = njsx('div')(5)()

      expect(component).to.deep.equal(<div>{5}</div>)
    })

    it('should be refinable by passing other React components as children', () => {
      const component = njsx('div')(<span />, <p />)()

      expect(component).to.deep.equal(<div><span /><p /></div>)
    })

    it('should be refinable by passing other NJSX components as children', () => {
      const component = njsx('div')(njsx('span'), njsx('p'))()

      expect(component).to.deep.equal(<div><span /><p /></div>)
    })

    it('should be refinable by passing an array of children', () => {
      const component = njsx('div')([njsx('span'), njsx('p')])()

      expect(component).to.deep.equal(<div><span /><p /></div>)
    })

    it('should ignore null arguments', () => {
      const component = njsx('div')(null, [null])()

      expect(component).to.deep.equal(<div />)
    })

    it('should ignore undefined arguments', () => {
      const component = njsx('div')(undefined, [undefined])()

      expect(component).to.deep.equal(<div />)
    })

    it('should ignore boolean arguments', () => {
      const component = njsx('div')(false)()

      expect(component).to.deep.equal(<div />)
    })

    it('should be refinable by functional refinements', () => {
      const foo = ({ props }: BuilderState<any>) => ({ ...props, className: 'foo' })
      const component = njsx('div')(foo)()

      expect(component).to.deep.equal(<div className='foo' />)
    })

    it('should be refinable by dynamic messages if a handler is defined', () => {
      NJSXConfig.dynamicSelectorHandler = (arg: string) => <span>{arg}</span>
      const component = njsx('div').foo.bar.baz()

      expect(component).to.deep.equal(<div><span>foo</span><span>bar</span><span>baz</span></div>)
    })

    it('should be refinable by property key accessing if a handler is defined', () => {
      NJSXConfig.dynamicSelectorHandler = (arg: string) => <span>{arg}</span>
      // tslint:disable-next-line:no-string-literal
      const component = njsx('div')['foo']['bar']['baz']()

      expect(component).to.deep.equal(<div><span>foo</span><span>bar</span><span>baz</span></div>)
    })

    it('should not be refinable by dynamic messages after the component is built', () => {
      NJSXConfig.dynamicSelectorHandler = (_) => { assert.fail(); throw new Error('Test failed') }
      expect(() => njsx('div')().key).to.not.throw()
    })

  })

})
