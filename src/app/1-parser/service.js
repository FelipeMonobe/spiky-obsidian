const { parseString } = require('xml2js')
const { bootstrap } = require('../../util/db')
const { allSettled, denodeify } = require('q')

const _parseString = denodeify(parseString)

const parseToXml = async (rawXmls) => {
  const _parserOptions = { explicitArray: false, trim: true }
  const xmls = await allSettled(rawXmls.map(x => _parseString(x.content, _parserOptions)))
  const successfulXmls = xmls.filter(x => x.state === 'fulfilled')
  const xmlsValues = successfulXmls.map(x => x.value)
  return xmlsValues
}

const getLastRawXml = async () => {
  const db = await bootstrap()
  const lastRawXmls = db
    .table('rawXml')
    .orderBy('id')
    .last()
  return lastRawXmls
}

module.exports = {
  getLastRawXml,
  parseToXml
}
