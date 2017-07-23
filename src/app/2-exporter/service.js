const { denodeify, defer } = require('q')
const { build } = require('node-xlsx')
const { writeFile } = require('graceful-fs')
const { head, keys, pipe, prepend } = require('ramda')
const { getListedValuesFromObjects } = require('../../util/array')
const { getDbInstance } = require('../../util/db')
const { remote: { dialog } } = require('electron')

const _writeFile = denodeify(writeFile)
const _showSaveDialog = filters => {
  const deferred = defer()

  dialog.showSaveDialog(filters, path => deferred.resolve(path))
  return deferred.promise
}

const _buildXlsx = (name, body) => {
  const header = pipe(head, keys)(body)
  let data = getListedValuesFromObjects(header, body)

  data = prepend(header, data)
  return build([{ name, data }])
}

const _exportToXlsx = async (path, body) => {
  const filename = path.split('/').pop()
  const xlsxBuffer = _buildXlsx(filename, body)

  await _saveXlsx(path, xlsxBuffer)
}

const openDirectoryDialog = async (body) => {
  const filters = [{
    name: 'Microsoft Excel Open XML Format Spreadsheet',
    extensions: ['xlsx']
  }]
  const path = await _showSaveDialog({ filters })

  _exportToXlsx(path, body)
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
