const { dialog } = require('electron').remote
const fs = require('graceful-fs')
const Dexie = require('dexie')
const _glob = require('glob')
const Q = require('q')

const readFile = Q.denodeify(fs.readFile)
const glob = Q.denodeify(_glob)

const selectDirectory = () => dialog.showOpenDialog({
  properties: ['openDirectory']
}, selection => {
  const element = document.querySelector('#selectedDirectory')
  element.innerText = selection || ''
})

const getPaths = async (cwd, pattern) => {
  const paths = await glob(pattern, { cwd })
  return paths
}

const readXmlContent = (cwd, xmlPaths) => Q
  .all(xmlPaths
    .map(xmlPath => readFile(`${cwd}/${xmlPath}`, 'utf-8')))

const readXmlFrom = async () => {
  const cwd = document.querySelector('#selectedDirectory').innerText
  const pattern = document.querySelector('#pattern').value
  const paths = await getPaths(cwd, pattern)
  const xmlContent = await readXmlContent(cwd, paths)
  return xmlContent
}

const submit = async () => {
  const db = new Dexie('Spiky-Obsidian-DB')
  const xmls = await readXmlFrom()

  db.version(1).stores({
    rawXml: '++id, date, content'
  })

  db.open()

  const date = new Date()
  const entries = xmls.map(content => ({ date, content }))
  await db.rawXml.put(entries)

  window.location.href = '../parser/template.html'
}
