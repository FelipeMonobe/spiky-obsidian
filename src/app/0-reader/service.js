const glob = require('glob')
const { readFile } = require('graceful-fs')
const { bootstrap } = require('../../util/db')
const { all, defer, denodeify } = require('q')
const { remote: { dialog } } = require('electron')

const _readFile = denodeify(readFile)
const _glob = denodeify(glob)

const _getXmlPaths = (cwd, selectedGlob) => _glob(selectedGlob, { cwd })
const _readXmlContent = (cwd, xmlPaths) => all(xmlPaths
  .map(xmlPath => _readFile(`${cwd}/${xmlPath}`, 'utf-8')))

const insertXmlEntries = async (xmls) => {
  const date = new Date()
  const entries = xmls.map(content => ({ date, content }))
  const db = await bootstrap()
  return db.rawXml.put(entries)
}

const openDirectoryDialog = () => {
  const deferred = defer()

  dialog
    .showOpenDialog({ properties: ['openDirectory'] }
      , (selection) => {
        if (!selection) return deferred.reject()
        return deferred.resolve(selection)
      })

  return deferred.promise
}

const readXmlFrom = async (selectedPath, selectedGlob) => {
  const cwd = selectedPath
    .trim()
    .replace(/\s/, '\ ')
  const xmlPaths = await _getXmlPaths(cwd, selectedGlob)
  const xmlContent = await _readXmlContent(cwd, xmlPaths)
  return xmlContent
}

module.exports = {
  insertXmlEntries,
  openDirectoryDialog,
  readXmlFrom
}
