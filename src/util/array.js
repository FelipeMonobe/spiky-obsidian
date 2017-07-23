const { filter, groupBy, head, keys } = require('ramda')

const groupByFirstProperty = groupBy(x => head(keys(x)))
const getListedValuesFromObjects = (propertiesList, objectList) => objectList
  .map(x => propertiesList
    .reduce((a, c) => {
      a.push(x[c])
      return a
    }, []))
const filterByObjectPropertyName = (property) => filter(x => x.hasOwnProperty(property))

module.exports = {
  filterByObjectPropertyName,
  getListedValuesFromObjects,
  groupByFirstProperty
}
