const { denodeify } = require('q')
const { build } = require('node-xlsx')
const { writeFile } = require('graceful-fs')
const { prepend, values } = require('ramda')
const { getDbInstance } = require('../../util/db')
const { remote: { dialog } } = require('electron')

const _writeFile = denodeify(writeFile)
const _prependHeaders = (props, data) => prepend(props, data)

const _buildXlsx = (name, header, body) => {
  let data = body.map(x => values(x))

  if (header) data = _prependHeaders(header, body)

  return build([{ name, data }])
}

const _exportToXlsx = async (path, body) => {
  const pathArr = path.split('/')
  const filename = pathArr[pathArr.length - 1]
  const xlsxBuffer = _buildXlsx(filename, null, body)
  await _saveXlsx(path, xlsxBuffer)
}

const openDirectoryDialog = (body) => {
  const filters = [{
    name: 'Microsoft Excel Open XML Format Spreadsheet',
    extensions: ['xlsx']
  }]

  dialog
    .showSaveDialog({ filters }, (path) => _exportToXlsx(path, body))
}

const getPluckedXmls = async () => {
  const database = getDbInstance()

  const data = await database
    .table('xmls')
    .orderBy('id')
    .last()

  return data.plucked
}

const _saveXlsx = (path, xlsxBuffer) => {
  return _writeFile(path, xlsxBuffer)
}

module.exports = {
  getPluckedXmls,
  openDirectoryDialog
}
