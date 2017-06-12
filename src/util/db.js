const Dexie = require('dexie')
const xmlSchema = require('../schemas/xml')
const { instance, version } = require('../config/indexedDb')

let database = {}

const bootstrap = () => {
  database = new Dexie(instance.name)

  const tables = _createTables([
    xmlSchema
  ])

  database
  .version(version)
  .stores(tables)
}

const getDbInstance = () => {
  if (!Object.keys(database).length) {
    bootstrap()
  }

  return database
}

const _createTables = (schemas) => schemas
  .reduce((tables, schema) => {
    const keys = schema.keys.join(',')
    tables[schema.name] = `++${schema.primaryKey},${keys}`
    return tables
  }, {})

module.exports = {
  bootstrap,
  getDbInstance
}
