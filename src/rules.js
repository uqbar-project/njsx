const {isArray} = Array

function mergedStyle(props, style) {
  if(!props.style && !style) return {}
  if(!style) return {style: props.style}

  const newStyle = style.styleId ? style.styleId : style
  if(!props.style) return {style: newStyle}
  if(isArray(props.style)) return {style: [...props.style, newStyle]}
  return {style: [props.style, newStyle]}
}

export default {
  
  HASH_AS_ATRIBUTES: {
    appliesTo(arg) { return typeof arg === 'object' },
    apply(arg, {props, children}) {
      return {props: {...props, ...arg, ...mergedStyle(props, arg.style)}, children}
    }
  },
  
  STRING_AS_CLASS: {
    appliesTo(arg) { return typeof arg === 'string' && arg.trim().startsWith('.') },
    apply(arg, {props: {className = '', otherProps}, children}) { return {props: {...otherProps, className: [...className.split(' '), ...arg.split('.')].map(c=> c.trim()).filter(String).join(' ')} , children } }
  },

  STYLE_AS_STYLE: {
    appliesTo(arg) { return typeof arg === 'object' && arg.styleId },
    apply(arg, {props, children}) { return { props:{...props, ...mergedStyle(props,arg)}, children } }
  },
  
  STRING_AS_CHILD: {
    appliesTo(arg) { return typeof arg === 'string' },
    apply(arg, {props, children}) { return {props, children: [...children, arg] }}
  },
  
  NUMBER_AS_CHILD: {
    appliesTo(arg) { return typeof arg === 'number' },
    apply(arg, {props, children}) { return { props, children: [...children, arg.toString()] }}
  },
  
  BOOLEAN_AS_CHILD: {
    appliesTo(arg) { return typeof arg === 'boolean' },
    apply(arg, {props, children}) { return {props, children: [...children, arg.toString()] }}
  },
  
  NJSX_COMPONENT_AS_CHILD: {
    appliesTo(arg) { return typeof arg === 'function' && arg.isNJSXComponent },
    apply(arg, {props, children}) { return {props, children: [...children, arg()] }}
  },
  
  REACT_COMPONENT_AS_CHILD: {
    appliesTo(arg) { return typeof arg === 'object' && arg.props },
    apply(arg, {props, children}) { return {props, children: [...children, arg] }}
  },
  
  IGNORE_NULL: {
    appliesTo(arg) { return arg === null },
    apply(arg, previous) { return previous }
  },
  
  IGNORE_UNDEFINED: {
    appliesTo(arg) { return arg === undefined },
    apply(arg, previous) { return previous }
  }

}