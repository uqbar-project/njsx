# No-JSX

[![Build Status](https://travis-ci.org/uqbar-project/njsx.svg?branch=master)](https://travis-ci.org/uqbar-project/njsx)
[![npm version](https://badge.fury.io/js/njsx.svg)](https://badge.fury.io/js/njsx)

A pure function based interface for creating [React](https://facebook.github.io/react/) and [React Native](https://facebook.github.io/react-native/) components without *JSX* tags.

If you love *React* but don't quite like the embeded *HTML* tags this library may be what you are looking for. Construct your components with code only in a clean, declarative way.

```js
const myView = () =>
  div.app(
    div.header(
      img({src: logo, alt:'logo'}),
      h2('Welcome to NJSX')
    )
  )()
```
-------------------------------------------------

#### Table of Content

- [Installation](#installation)
- [Usage](#usage)
  - [Getting a Builder](#getting-a-builder)
    - [Default Component Builders](#default-component-builders)
    - [Third-Party Component Builders](#third-party-component-builders)
  - [Creating Elements](#creating-elements)
  - [Refining Builders](#refining-builders)
    - [Builder Arguments](#builder-arguments)
    - [Dynamic Selectors](#dynamic-selectors)
  - [Argument Transformation](#argument-transformation)
  - [Point-free](#point-free)
- [Working with older versions](#working-with-older-versions)
- [Contributions](#contributions)
- [License](#license)

-------------------------------------------------

## Installation

*NJSX* is available on [npm](https://www.npmjs.com), just pick between the *React* and *React Native* flavours and add it to your project's dependencies.

**For React Projects:**
```bash
npm install njsx-react --save
```

**For React Native Projects:**
```bash
npm install njsx-react-native --save
```


## Usage

*NJSX* is super easy to use: It's all about **Builder Functions**.

You can use *Builders* to to cleanly instantiate *React* and *React Native* elements, or further refine your component configuration just by applying them.


### Getting a Builder

#### Default Component Builders

*NJSX* provides *Builder Functions* for all the default *React* and *React Native* components. Just import whatever element you need from the `react` or `react-native` modules and you are ready to go:

```js
// React project
import {div, p} from 'njsx-react'

// React Native project
import {View, Text} from 'njsx-react-native'
```

#### Third-Party Component Builders

NJSX is not just for default components! You can get a builder for **any** component just by wrapping it with the `njsx` adapter.

```js
// This is NJSX core. Both njsx-react and njsx-react-native use it to define their builders.
import njsx from 'njsx'
import {SomeThirdPartyComponent} from 'someLibrary'

const SomeFunctionalComponent = (props) => ...
class SomeStatefulComponent extends React.Component {
  render() { ... }
}

// These are all valid Component Builders.
const someComponent = njsx(SomeComponent)            
const someFunctionalComponent = njsx(SomeFunctionalComponent)
const someStatefulComponent = njsx(SomeFunctionalComponent)

// You can even use a string as component type (although it's not recommended):
const aDivBuilder = njsx('div')
```

### Creating Elements

Each *NJSX* builder, once **applied with no arguments**, will return a **ReactElement** just as if you had used the component inside a *JSX* tag:

```jsx
import {div} from 'njsx-react'

// These two lines are equivalent.
<div></div>
div()
```

This means that *JSX* and *NJSX* elements are completely interchangeable. You can use components created from builders as children for *JSX*'s tags, or refine a builder with tag shaped children, so you can try *NJSX* on any react based project and integrate it gradually.

### Refining Builders

Of course, an empty element is not that useful, so how do you customize it?

When a *Builder* is applied with **one or more arguments**, these will be used to configure the building component. Refining a *Builder* this way returns another ***Builder***, so you can keep refining your component any number of times.

```jsx
import {p} from 'njsx-react'

p('some text')
p('some', ' ', 'text')
p('some')(' ')('text')
p(['some', ' ', 'text'])

// All these lines build the same:
<p>some text</p>
```

It's important to note that refining a builder causes **no side effects or state changes at all**. This means you can safely reuse *Builders*, or partially refine one and pass it forward.

#### Builder Arguments

*Builders* will get refined in a different way, depending on what arguments you apply them with:

  - `Basic Objects` are treated as **Component Properties**. Refining a builder with a second set of properties will result in the merge of both, favoring the later in case of repetition.
  
    ```jsx
    img({src: path, onClick: cb})
    img({src: path}, {onClick: cb})
    img({src: thisWillBeLost, onClick: cb})({src: path})

    // All these lines build the same:
    <img src={path} onClick:{cb}></img>
    ```


  - `Strings`, `Numbers`, `React Elements` and even other `Builders` will become **Component Children**.

    ```jsx
    div(
      div('the answer is ', 42)  // <- No need for building it.
    )

    // This line builds:
    <div><div>the answer is 42</div></div>
    ```

    Notice that, since *Builders* can be children too, most of the time you won't be needing to apply them with no arguments to instantiate elements.


  - `null`, `undefined` and `Booleans` will be ignored. This allows for a clean way to conditionally set properties and children using `&&` and `||`.

    ```jsx
    div(null)
    div(undefined)
    div(false && "this won't show")

    //All these lines the same:
    <div/>
    ```

  - `Arrays` of any valid argument will be handled as a sequence of refinements.

    ```jsx
    const guards = ['Nobby', 'Colon', 'Carrot']
    
    ul(guards.map(guard => li(guard)))
    ul(guards.map(li))

    //All these lines the same:
    <ul>{guards.map(guard => <li>{guard}</li>)}</ul>
    ```


  - Finally, you can also pass a `Refinement Function`, which should take the previous *Component Properties* (including the `children` field) and return the next one.

    ```jsx
    const myRefinement = (src, text) => (prev) =>
      {...prev, {src, children: text} }
    img(myRefinement(foo, bar))

    // This line builds:
    <img src={foo}>bar</img>
    ```

To wrap it all, any unsuported argument application will raise a `TypeError`.


#### Dynamic Selectors

You can also refine a *Builder* by accessing any keyword as if it was a property. A common use for this is to treat the keyword as a `className`, so you can add classes to components by just naming them:

```jsx
p.highlighted.small("Nice!")
p['highlighted']['small']("Nice!")
p['highlighted small']("Nice!")
p("Nice!").highlighted['.small']

//All these lines build the same:
<p className="highlighted small">Nice!</p>
```

Treating these selectors as class names is the default behavior of *NJSX*, but you can change it to whatever you want by changing the `NJSXConfig.  dynamicSelectorHandler` setting:

```jsx
import { NJSXConfig } from 'njsx'

// You can set any function that receives the key and returns a valid argument.
NJSXConfig.dynamicSelectorHandler = (key: string) => key

div.foo.bar
// This would yield
<div>foobar</div>


// That means you could also return a refining function!
NJSXConfig.dynamicSelectorHandler = (id: string) => (prev) =>
  {...prev, id}

div.baz
// This would yield
<div id="baz"/>


// You can also disable the whole thing by setting it to undefined.
NJSXConfig.dynamicSelectorHandler = undefined
```


Notice that this feature can only be used on [environments that support *ES6's Proxy*](https://kangax.github.io/compat-table/es6/#test-Proxy) so, sadly, it's not available on *React-Native* projects.


## Argument Transformation

You don't like the way arguments are being handled? No problem! You can customize the way *NJSX's Builders* interpret arguments to fine tune it to your needs.

The `NJSXConfig` object can be used to specify **Argument Transformations**, which are just functions that take each argument and return whatever you want that argument to be. These functions are automatically called each time a *Builder* is applied.

```jsx
import { NJSXConfig } from 'njsx'
import {p} from 'njsx-react'

const translations = {
  "this should be translated": "ook"
}

NJSXConfig.argumentTransformations.push( arg =>
  typeof arg === 'string' && arg.startsWith('!')
    ? translations[arg]
    : arg
)

p("!this should be translated")

// This build:
<p>ook</p>
```

Please take into account that **all transformations are reduced on every argument**, so don't overdo it and mind the order.

*NJSX* comes with some of these transformations set up by default:

  - In *React* projects, **Strings starting with a dot** will be interpreted as a *classNames*:

    ```jsx
    div('.foo .bar')(
      'Some content'
    )

    // This builds:
    <div className="foo bar">Some content</div>
    ```

  - In *React-Native* projects, **StyleSheet** arguments are interpreted as *styles* (Just import `StyleSheet` from `njsx-react-native` instead of `react-native`).

    ```jsx
    import {StyleSheet, View, Text} from 'njsx-react-native'

    // Same StyleSheet interface
    StyleSheet.create({
      container: { /* ...your regular react-native styles... */ }
      description: { /* ...your regular react-native styles... */ }
    })

    View(styles.container)(
      Text(style.description)("These are styled!")
    )
    ```

If you rather all your arguments to just be interpreted as they are, you can disable this feature by setting the `NJSXConfig.argumentTransformations` to an empty array.

## Point-free

Think point-free composition in your render is a `pipe` dream? Think again! You can use `njsx` to compose components in a point-free style to increase the readability of deeply nested components:

```jsx
const Root = ({ store }) => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router history={history}>
        <Route path='/' component={App} />
      </Router>
    </PersistGate>
  </Provider>
)
```

Becomes:

```js
import { nest } from 'njsx'

const Root = ({ store }) =>
  nest(
    Provider({ store }),
    PersistGate({ loading: null, persistor }),
    Router({ history }),
    Route({ path: '/', component: App })
  )()
```

## Example Refactoring
JSX:
```jsx
export const Loading = () => (
  <Row style={{marginTop: '10em'}}>
    <Col sm={7} style={{float: 'none', margin: 'auto'}}>
      <Well bsSize='lg' style={{paddingTop: '0px'}}>
        <Row style={{marginTop: 0, marginBottom: 10}}>
          <Col sm={12}>
            <h2>Welcome back!</h2>
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <p>Please hang tight while we load your app.</p>
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <div className='pull-right'>
              <Spinner style={{top: 16, width: 42}} />
            </div>
          </Col>
        </Row>
      </Well>
    </Col>
  </Row>
)
```
NJSX nested:
```js
export const Loading = () =>
  Row ({style: {marginTop: '10em'}}) (
    Col ({sm: 7, style: {float: 'none', margin: 'auto'}}) (
      Well ({bsSize: 'lg', style: {paddingTop: '0px'}}) (
        Row ({style: {marginTop: 0, marginBottom: 10}}) (
          Col ({sm: 12}) (h2 ('Welcome back!'))
        ),
        Row (Col ({sm: 12}) (p ('Please hang tight while we load your app.'))),
        Row (
          Col ({sm: 12}) (
            div ({className: 'pull-right'}) (Spinner ({style: {top: 16, width: 42}}))
          )
        )
      )
    )
  ) ()
```
NJSX composed:
```js
export const Loading = () =>
  nest (
    Row ({style: {marginTop: '10em'}}),
    Col ({sm: 7, style: {float: 'none', margin: 'auto'}}),
    Well ({bsSize: 'lg', style: {paddingTop: '0px'}}) (
      nest (
        Row ({style: {marginTop: 0, marginBottom: 10}}),
        Col ({sm: 12}),
        h2 ('Welcome back!')
      ),
      nest (Row, Col ({sm: 12}), p ('Please hang tight while we load your app.')),
      nest (
        Row,
        Col ({sm: 12}),
        div ({className: 'pull-right'}) (Spinner ({style: {top: 16, width: 42}}))
      )
    )
  ) ()

```

## Working with older versions

If you are working with an older release this documentation might not be of any use to you. We follow the [semantic versioning standard](https://semver.org/) so any difference on the Major version will probably imply some incompatibilities. Please refer to [your version's branch](https://github.com/uqbar-project/njsx/releases) README file.


## Contributions

Please report any bugs, requests or ideas on [the issues section of this repository](https://github.com/uqbar-project/njsx/issues) and we will try to see to it as soon as possible.
Pull requests are always welcome! Just try to keep them small and clean.


## License

This code is open source software licensed under the [ISC License](https://opensource.org/licenses/ISC) by [The Uqbar Foundation](http://www.uqbar-project.org/). Feel free to use it accordingly.
