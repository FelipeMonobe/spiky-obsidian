const { ipcRenderer, remote: { dialog } } = require('electron')
const { getDbInstance } = require('../../util/db')

const openDirectoryDialog = (body) => {
  const filters = [{
    name: 'Microsoft Excel Open XML Format Spreadsheet',
    extensions: ['xlsx']
  }]

  dialog
    .showSaveDialog({ filters }, (path) => ipcRenderer.send('xlsx', { path, body }))
}

const getPluckedXmls = async () => {
  const database = getDbInstance()

  const data = await database
    .table('xmls')
    .orderBy('id')
    .last()

  return data.plucked
}

module.exports = {
  getPluckedXmls,
  openDirectoryDialog
}
