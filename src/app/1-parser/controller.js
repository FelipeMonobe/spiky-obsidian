const { getLastNodes } = require('../../util/object')
const { getLastRawXml, parseToXml } = require('./service')
const { groupByFirstProperty, filterByObjectPropertyName } = require('../../util/array')

const vm = {}

vm.xmls = []

vm.previewXmlModel = () => {
  debugger

  const xmlModel = document.querySelector('#xmlModel').value
  const xmlsByModel = filterByObjectPropertyName(xmlModel)(vm.xmls)
  const sampleXml = xmlsByModel[0][xmlModel]
  const xmlProperties = getLastNodes(sampleXml, xmlModel)
}

const _modelPhase = async () => {
  const lastRawXmls = await getLastRawXml()
  const xmls = await parseToXml(lastRawXmls)
  const xmlsGroupedByModel = groupByFirstProperty(xmls)
  const xmlModelKeys = Object.keys(xmlsGroupedByModel)
  const xmlModels = xmlModelKeys.map(x => ({ name: `${x} (${xmlsGroupedByModel[x].length})`, value: x }))
  return { xmlModels, xmls }
}

const _viewPhase = ({ xmlModels, xmls }) => {
  const select = document.querySelector('#xmlModel')

  vm.xmls = xmls

  xmlModels.forEach(x => {
    const selectOption = document.createElement('option')
    selectOption.text = x.name
    selectOption.value = x.value
    select.add(selectOption)
  })
}

const init = async () => {
  const model = await _modelPhase()
  _viewPhase(model)
}

window.onload = init
