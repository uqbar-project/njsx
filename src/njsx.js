import {createElement} from 'react'

const {isArray} = Array

export default function njsx(type, props={}, children=[]) {
	const component = (...args) => {
		const [finalProps, finalChildren] = args
		.reduce((acum, arg) => [...acum, ...isArray(arg) ? arg : [arg]], [])
		.reduce(([oldProps, oldChildren], arg) => {
			const [,materialize] = njsx.rules.find(([appliesTo,]) => appliesTo(arg))
			const [newProps, newChildren] = materialize(arg)

			return [{...oldProps, ...newProps}, [...oldChildren, ...newChildren]]
		}, [props,children])

		return args.length === 0
			? createElement(type, finalProps, ...finalChildren)
			: njsx(type, finalProps, finalChildren)
	}

	component.isNJSXComponent = true

	return component
}