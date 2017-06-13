const { flatten, head, last, keys, map, path, pipe } = require('ramda')

const getLastNodes = (node, nodePath = 'obj') => {
  const recurseChildren = map(prop => {
    if (typeof node[prop] !== 'object') return `${nodePath}.${prop}`
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
  const prop = last(pathSegments)
  let pathValue = null

  pathSegments
  .forEach((segment, index, segments) => {
    const currPath = segments.slice(0, index + 1)
    const value = path(currPath, source)
    if (Array.isArray(value)) {
      const restPath = segments.slice(index + 1, segments.length)
      pathValue = value
      .map(x => path(restPath, x))
    }
  })

  target[prop] = pathValue && pathValue.length
  ? pathValue
  : path(fullPath.split('.'), source)
}

module.exports = {
  getValueFromPropertyPath,
  getLastNodes,
  getSampleProperties
}
