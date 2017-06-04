const { flatten, keys, map, pipe } = require('ramda')

const getLastNodes = (node, path = 'obj') => {
  const recurseChildren = map(prop => {
    if (typeof node[prop] !== 'object') return `${path}.${prop}`
    return getLastNodes(node[prop], `${path}.${prop}`)
  })

  return pipe(keys, recurseChildren, flatten)(node)
}

module.exports = {
  getLastNodes
}
