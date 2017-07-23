const { openDirectoryDialog, insertXmlEntries, readXmlFrom } = require('./service')

const vm = {}

vm.selectDirectory = async () => {
  const selectedDirectory = document.querySelector('#selectedDirectory')
  const selection = await openDirectoryDialog()
  selectedDirectory.innerText = selection || ''
  return selection
}

vm.readAndStoreRawXmls = async () => {
  const xmls = await _readXmlFrom()
  const nextURL = '../1-processor/template.html'

  window.localStorage['reader.caminho'] = document.querySelector('#selectedDirectory').innerText

  await insertXmlEntries(xmls)
  window.location.href = nextURL
}

const _readXmlFrom = async () => {
  const cwd = document.querySelector('#selectedDirectory').innerText
  const pattern = document.querySelector('#pattern').value
  const rawXmls = await readXmlFrom(cwd, pattern)
  return rawXmls
}

const _viewPhase = () => {
  document.querySelector('#selectedDirectory').innerText = window.localStorage['reader.caminho'] ||
  'Nenhum diretório selecionado.'
}

const init = async () => {
  _viewPhase()
}

window.onload = init
