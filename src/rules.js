export const Rule = (appliesTo) => (materialize) => [appliesTo, materialize]

export default {
  HASH_AS_ATRIBUTES: Rule(a => typeof a === 'object')(a => [ a, [] ]),
  STRING_AS_CLASS: Rule(a => typeof a === 'string' && a.trim().startsWith('.'))(a => [ {className: a.split('.').join(' ').trim()}, [] ]),
  STRING_AS_CHILD: Rule(a => typeof a === 'string')(a => [ {}, [a] ]),
  NUMBER_AS_CHILD: Rule(a => typeof a === 'number')(a => [ {}, [a.toString()] ]),
  BOOLEAN_AS_CHILD: Rule(a => typeof a === 'boolean')(a => [ {}, [a.toString()] ]),
  NJSX_COMPONENT_AS_CHILD: Rule(a => a.isNJSXComponent)(a => [ {}, [a()] ]),
  REACT_COMPONENT_AS_CHILD: Rule(a => typeof a === 'object' && a.props)(a => [ {}, [a] ]),
  IGNORE_NULL: Rule(a => a === null)(a => [ {}, [] ]),
  IGNORE_UNDEFINED: Rule(a => a === undefined)(a => [ {}, [] ])
}