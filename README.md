No-JSX
------

[![Build Status](https://travis-ci.org/uqbar-project/njsx.svg?branch=master)](https://travis-ci.org/uqbar-project/njsx)

A customizable and declarative interface for creating [React](https://facebook.github.io/react/) and [React Native](https://facebook.github.io/react-native/) components without *JSX* syntax.

If you love *React* but don't quite like the embeded *HTML* tags this library may be what you are looking for.

```js
const myView () =>
  div('.App')(
    div('.App-header')(
      img('.App-logo')({src: logo, alt:'logo'}),
      h2('Welcome to NJSX')
    )
  )()
```

## Installation

*NJSX* is available as the `njsx` package on [npm](https://www.npmjs.com/njsx). Just run the following line in your project root:

```bash
npm install njsx --save
```

## Usage

*NJSX* provides a series of builder functions to cleanly instantiate *React* or *React Native* components. Just import the components you need from right module and you are ready to go.

```js
// React project
import {div, p} from 'njsx/react'

// React Native project
import {View, Text} from 'njsx/react-native'
```


### Building Components

Each imported *NJSX* builder is a function that once applied with no arguments will yield a **React Component**.

```jsx
import {div} from 'njsx/react'

const someDiv = <div></div>
const anEqualDiv = div()
// These two lines yield the same!
```

If the builders are applied with one or more arguments, these will be used to configure the generated components. Each builder can be applied any number of times (up until you apply it with no arguments to construct the component).

```jsx
import {p} from 'njsx/react'

p('some text')()
p('some', ' ', 'text')()
p('some ')('text')()
p(['some', ' '],['text'])()

//All these lines yield the same component
<p>some text</p>
```

Each argument is process by a set of configurable rules to decide what change it represents for the component. Here are some examples of argument applications you can use right out of the box:

  - **Hashes** will become component's properties.

    ```js
    img({src: somePath, onClick: someCallback})
    ```

    Applying a builder with a second hash will result in the new properties merging with the old, keeping the later in case of repetition.

    ```js
    img({src: thisWillBeLost, onClick: thisWillRemain})({src: thisWillOverrideThePreviousPath})
    ```

  - **Strings**, **Numbers**, **Booleans**, **React Components** and even other **NJSX Builders** will become childrens.

    ```js
    div(
      div('the answer is ', 42)  // <- No need for building
    )()
    ```

    Notice that, since builders can be children too, most of the time there is no need to apply them with no args to create components.

  - In *react* projects, **Strings starting with a dot** will be interpreted as a *classes*.

    ```jsx
    div('.thisIsAClass .thisIsAnotherClass')(
      'Some content'
    )
    ```

  - In *react-native* projects, **StyleSheet entries** can be interpreted as *styles*. Just import `StyleSheet` from `njsx/react-native` instead of `react-native`.

    ```jsx
    import {StyleSheet, View, Text} from 'njsx/react-native'

    // Same StyleSheet interface
    StyleSheet.create({
      container: { /* ...your regular react-native styles... */ }
      description: { /* ...your regular react-native styles... */ }
    })

    View(styles.container)(
      Text(style.description)("These are styled!")
    )
    ```

  - **Null** and **Undefined** arguments are ignored.


Any unsuported argument application will raise a `TypeError`.


If the running environment [supports ES6's Proxy](https://kangax.github.io/compat-table/es6/#test-Proxy), component's property access can be used to further refine an existing component. By default, in *react* projects, this is set to make each property access yield a new component with the property name as a class:

```jsx
//all these yield the same component
p.highlighted.small("hello!")
p['highlighted small']("hello!")
p("hello!").highlighted['.small']
<p className="highlighted small">hello!</p>
```


### Building Third-Party Components

NJSX is not just for default components! You can get a builder for **any** *React* or *React-Native* component by applying it to the `njsx` function.

```js
import njsx from 'njsx' // This is NJSX core. Booth React and ReactNative use it to define their builders.
import {SomeComponent} from 'someOtherModule'

const SomeFunctionalComponent = (props) => //...whatever you want to render 
class SomeStatefulComponent extends React.Component {
  render() {
    return //...whatever you want to render 
  }
}

const someComponent = njsx(SomeComponent)                     // This is a NJSX builder for SomeComponent
const someFunctionalComponent = njsx(SomeFunctionalComponent) // This is a NJSX builder for SomeFunctionalComponent
const someStatefulComponent = njsx(SomeFunctionalComponent)   // This is a NJSX builder for SomeStatefulComponent
```


### Advanced Customization

You don't like the way arguments are being handled? No problem! You can customize the rules *NJSX* uses for interpreting arguments to fine tune it to your needs. Add or remove supported argument applications, change the way they are processed or throw all away and start from scratch!

```js
import njsx from 'njsx'        
import Rules from 'njsx/rules' // This module exports some common rule examples.
```

Each *rule* is just an object with two methods:
  - `appliesTo(argument)`: Tells if the rule can handle an argument applied to a component builder.
  - `apply(argument, {props,children})`: Takes the argument applied to a component builder and the curent state of the builder (denoted by an object containing a `props` hash and a `children` array) and returns the next builder state.

```js
Rules.STRING_AS_CHILD = {
  // This rule only applies to arguments of type string.
  appliesTo(arg) { return typeof arg === 'string' },
  
  // Applying this rule adds the string to the children array (but it doesn't change the properties).
  apply(arg, {props, children}) { return {props, children: [...children, arg] }}
}
```

So you could easily create, for example, a rule that can handle anything that defines a `toString()` function and adds its result as a child.

```js
const strigableAsChild = {
  appliesTo(arg) { return arg.toString && typeof(arg.toString) === 'function' },
  apply(arg, {props, children}) { return {props, children: [...children, arg.toString()] }}
}

njsx.rules.push(stringableAsChild) // From now on, all builders will support this rule.
```

Take into account that **only one** rule will be applied to each argument, and each rule will be tested for applicability in the same order as it appears in the `njsx.rules` array, so be carefull to leave the more generic rules at the bottom.

Finally, if you want to change how property access is handled by the builders, you can do so by setting the `njsx.dynamicSelectorHandler` property to a function that takes the accessed property name and the current builder state and returns the next state. For example, if you want the accesses to be treated as class names in a *react-native* project, you can do so by adding this line:

```js
  njsx.dynamicSelectorHandler = Rules.STRING_AS_CLASS.apply
```

You can also set this property to a *falsy* value to disable the whole property access behavior for builders.


## Contributions

Please report any bugs, requests or ideas on [the issues section](https://github.com/uqbar-project/njsx/issues) and we will try to see to it as soon as possible.
Also, pull requests are always welcome! Just try to keep it small and clean.


## License

This code is open source software licensed under the [ISC License](https://opensource.org/licenses/ISC) by [The Uqbar Foundation](http://www.uqbar-project.org/). Feel free to use it accordingly.