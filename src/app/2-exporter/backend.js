const { denodeify } = require('q')
const { build } = require('node-xlsx')
const { ipcMain } = require('electron')
const { prepend, values } = require('ramda')
const { writeFile } = require('graceful-fs')

const _writeFile = denodeify(writeFile)

const _prependHeaders = (props, data) => prepend(props, data)

const _setListeners = () => {
  ipcMain.on('xlsx', async (e, { path, body }) => {
    const pathArr = path.split('/')
    const filename = pathArr[pathArr.length - 1]
    const xlsxBuffer = _buildXlsx(filename, null, body)
    await _saveXlsx(path, xlsxBuffer)
  })
}

const _buildXlsx = (name, header, body) => {
  let data = body.map(x => values(x))

  if (header) data = _prependHeaders(header, body)

  return build([{ name, data }])
}

const _saveXlsx = (path, xlsxBuffer) => {
  return _writeFile(path, xlsxBuffer)
}

_setListeners()
