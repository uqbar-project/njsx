import {createElement} from 'react'

const {isArray} = Array

const flatten = (array) => array.reduce((acum, elem) => [...acum, ...isArray(elem) ? elem : [elem]], [])
const asDynamic = (component) => !Proxy ? component : new Proxy(component, {
	get(target, name) {
		const {type, props: {children = [], ...props}} = component()
		const next = njsx.dynamicSelectorHandler(name, {props, children})
		return asDynamic( njsx(type, next.props, next.children) )
	}
})

export default function njsx(type, props={}, children=[]) {
	const component = (...args) => {
		const {props: finalProps, children: finalChildren} = flatten(args).reduce((previous, arg) =>
			njsx.rules.find(rule => rule.appliesTo(arg)).apply(arg, previous)
		, {props,children})

		return args.length === 0
			? createElement(type, finalProps, ...finalChildren)
			: njsx(type, finalProps, finalChildren)
	}

	component.isNJSXComponent = true

	return njsx.dynamicSelectorHandler ? asDynamic(component) : component
}