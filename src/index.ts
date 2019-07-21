import { createElement, ReactChild, ReactElement, ReactNode, ReactType } from 'react'

// TODO: Perhaps we could add an example project
// TODO: Replace with spread operator once Typescript suports spread of generics (https://github.com/Microsoft/TypeScript/pull/13288)
const { assign } = Object
const { isArray } = Array

// ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export type ArgumentTransformation = (arg: any) => any

export const NJSXConfig: {
  argumentTransformations: ArgumentTransformation[],
  dynamicSelectorHandler?: (name: string) => any,
} = {
    argumentTransformations: [],
    dynamicSelectorHandler: (name: string) => {
      throw new TypeError(`Can't refine by ${name}: No handler for dynamic selector was provided`)
    },
  }

// ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// BUILDERS
// ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export interface Builder<P> {
  (): ReactElement<P>,
  (head: BuilderArgument<P>, ...tail: BuilderArgument<P>[]): Builder<P>
  readonly [key: string]: Builder<P>
}

export type BuilderArgument<P>
  = BuilderRefinement<P>
  | undefined
  | null
  | boolean
  | ReactChild
  | (() => ReactElement<any>)
  | Partial<P>
  | BuilderArgumentArray<P>
export interface BuilderArgumentArray<P> extends Array<BuilderArgument<P>> { }


export type BuilderState<P> = Partial<P & { children: ReactNode[] }>

export type BuilderRefinement<P> = (state: BuilderState<P>) => BuilderState<P>

// ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// FACADE
// ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export type NJSX = <P>(type: ReactType<P>) => Builder<P>
const njsx = <P>(type: ReactType<P>, baseState: BuilderState<P> = {}): Builder<P> => {
  const builder = (
    (...args: BuilderArgument<P>[]) => !args.length
      ? createElement(type, baseState as P, ...baseState.children || [])
      : njsx(type, args.reduce<BuilderState<P>>(applyArgument, baseState))
  ) as Builder<P>

  (builder as any).__isNJSXBuilder__ = true

  return !NJSXConfig.dynamicSelectorHandler ? builder : new Proxy(builder, {
    get(target, name) {
      if (name === '__isNJSXBuilder__') return target.__isNJSXBuilder__
      return target(NJSXConfig.dynamicSelectorHandler!(name.toString()))
    },
  })
}

function applyArgument<P>(state: BuilderState<P>, baseArg: BuilderArgument<P>): BuilderState<P> {
  const arg = NJSXConfig.argumentTransformations.reduce((s, tx) => tx(s), baseArg)

  if (isIgnored(arg)) return state
  if (isArray(arg)) return arg.reduce(applyArgument, state)
  if (isBuilder(arg)) return addChild(state, arg())
  if (isChild(arg)) return addChild(state, arg)
  if (typeof arg === 'object') return assign({}, state, arg)
  if (typeof arg === 'function') return arg(state)

  throw new TypeError(`Unsupported NJSX argument: ${arg}`)
}

function isBuilder(target: any): target is () => ReactElement<any> {
  return target.__isNJSXBuilder__
}

function isIgnored(target: any): target is null | undefined | boolean {
  return target === null || target === undefined || typeof target === 'boolean'
}

function isChild(target: any): target is number | string | ReactElement<any> {
  return typeof target === 'number' || typeof target === 'string' || typeof target === 'object' && !!target.type
}

function addChild<P>(state: BuilderState<P>, child: ReactNode) {
  return assign({}, state, { children: [...state.children || [], child] })
}

// ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// Compose
// ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════

const err = 'compose: Functions required'

const isFunction = (val: any): val is Function => typeof val === 'function'

function applyPipe(f: any, g: any) {
  if (!isFunction(g)) {
    throw new TypeError(err)
  }

  return (...args: any[]) => g.call(null, f.apply(null, args))
}

// compose :: ((y -> z), (x -> y), ..., (a -> b)) -> a -> z
export function compose(...args: any[]) {
  if (!arguments.length) {
    throw new TypeError(err)
  }

  const fns = args.slice().reverse()

  const head = fns[0]

  if (!isFunction(head)) {
    throw new TypeError(err)
  }

  const tail = fns.slice(1).concat((x: any) => x)

  return tail.reduce(applyPipe, head)
}

export default njsx as NJSX
