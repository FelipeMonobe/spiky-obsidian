const { denodeify } = require('q')
const { prepend } = require('ramda')
const { build } = require('node-xlsx')
const { writeFile } = require('graceful-fs')

const _writeFile = denodeify(writeFile)

const _prependHeaders = (props, data) => prepend(props, data)

const buildXlsx = (name, header, body) => {
  const data = _prependHeaders(header, body)
  return build([{ name, data }])
}

const saveXlsx = (fileName, savePath, xlsxBuffer) => {
  return _writeFile(fileName, xlsxBuffer)
}

module.exports = {
  buildXlsx,
  saveXlsx
}
