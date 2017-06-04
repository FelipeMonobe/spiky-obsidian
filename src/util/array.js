const { filter, groupBy, head, keys } = require('ramda')

const groupByFirstProperty = groupBy(x => head(keys(x)))
const filterByObjectPropertyName = (property) => filter(x => x.hasOwnProperty(property))

module.exports = {
  filterByObjectPropertyName,
  groupByFirstProperty
}
