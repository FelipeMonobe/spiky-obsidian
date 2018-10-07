const { flatten, head, keys, map, path, pipe } = require('ramda')

const getLastNodes = (node, nodePath = 'obj') => {
  const recurseChildren = map(prop => {
    if (typeof node[prop] !== 'object') return `${nodePath}.${prop}`
    if (node[prop].length) return `${nodePath}.${prop}`

    return getLastNodes(node[prop], `${nodePath}.${prop}`)
  })

  return pipe(keys, recurseChildren, flatten)(node)
}

const getSampleProperties = (arr) => {
  const sample = head(arr)
  return keys(sample)
}

// [String] -> Object -> [String]
const getValueFromPropertyPath = (fullPath, source, target) => {
  const pathSegments = fullPath.split('.')
  let pathValue = null

  pathSegments
  .forEach((segment, index, segments) => {
    const value = path(segment, source)
    if (Array.isArray(value)) {
      const restPath = segments.slice(index + 1, segments.length)
      pathValue = value
      .map(x => path(restPath, x))
    }
  })

  target[fullPath] = pathValue && pathValue.length
  ? pathValue
  : path(fullPath.split('.'), source)
}

module.exports = {
  getValueFromPropertyPath,
  getLastNodes,
  getSampleProperties
}
