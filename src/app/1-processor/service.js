const { parseString } = require('xml2js')
const { allSettled, denodeify } = require('q')
const { getDbInstance } = require('../../util/db')
const { getValueFromPropertyPath } = require('../../util/object')

const _parseString = denodeify(parseString)

const parseToXml = async(rawXmls) => {
  const _parserOptions = { explicitArray: false, trim: true }
  const xmls = await allSettled(rawXmls.map(x => _parseString(x.raw, _parserOptions)))
  const successfulXmls = xmls.filter(x => x.state === 'fulfilled')
  const xmlsValues = successfulXmls.map(x => x.value)
  return xmlsValues
}

const getLastRawXml = async() => {
  const database = getDbInstance()

  return database
    .table('xmls')
    .orderBy('id')
    .last()
}

const pluckXmls = (xmls, options) => {
  const optionsValues = options
    .map(x => x.value)

  const unormalizedXmls = xmls
  .map(x => {
    const body = {}

    optionsValues
    .forEach(y => getValueFromPropertyPath(y, x, body))

    return body
  })

  return unormalizedXmls
}

const updateXmls = (id, xmls) => {
  const database = getDbInstance()
  const query = { plucked: xmls }

  return database
  .table('xmls')
  .update(id, query)
}

module.exports = {
  getLastRawXml,
  parseToXml,
  pluckXmls,
  updateXmls
}
