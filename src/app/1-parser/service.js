const { last, path } = require('ramda')
const { parseString } = require('xml2js')
const { bootstrap } = require('../../util/db')
const { allSettled, denodeify } = require('q')

const _parseString = denodeify(parseString)

const parseToXml = async(rawXmls) => {
  const _parserOptions = { explicitArray: false, trim: true }
  const xmls = await allSettled(rawXmls.map(x => _parseString(x.content, _parserOptions)))
  const successfulXmls = xmls.filter(x => x.state === 'fulfilled')
  const xmlsValues = successfulXmls.map(x => x.value)
  return xmlsValues
}

const getLastRawXml = async() => {
  const db = await bootstrap()
  const lastRawXmls = db
    .table('rawXml')
    .orderBy('id')
    .last()
  return lastRawXmls
}

const pluckXmls = (xmls, options) => {
  const numberPattern = /^[\d.]+$/
  const optionsValues = options
    .map(x => x.value)

  return xmls
    .map(x => {
      const body = {}

      optionsValues.forEach(y => {
        const pathSegments = y.split('.')
        const prop = last(pathSegments)
        const value = path(pathSegments, x)

        body[prop] = numberPattern.test(value) && value.length < 13
          ? parseFloat(value)
          : value
      })

      return body
    })
}

// TODO
const updateXmls = (xmls) => {}

module.exports = {
  getLastRawXml,
  parseToXml,
  pluckXmls
}
