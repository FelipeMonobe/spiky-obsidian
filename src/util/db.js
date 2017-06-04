const Dexie = require('dexie')
const rawXmlSchema = require('../schemas/rawXml')
const { instance, version } = require('../config/indexedDb')

const bootstrap = () => {
  const db = new Dexie(instance.name)
  const tables = _makeTables([
    rawXmlSchema
  ])

  db
  .version(version)
  .stores(tables)

  return db.open()
}

const _makeTables = (schemas) => schemas
  .reduce((tables, schema) => {
    const keys = schema.keys.join(',')
    tables[schema.name] = `++${schema.primaryKey},${keys}`
    return tables
  }, {})

module.exports = {
  bootstrap
}
