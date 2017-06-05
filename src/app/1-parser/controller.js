const { getLastNodes } = require('../../util/object')
const { getLastRawXml, parseToXml, pluckXmls, updateXml } = require('./service')
const { groupByFirstProperty, filterByObjectPropertyName } = require('../../util/array')

const vm = {}

vm.xmls = []
vm.xmlsByModel = []

vm.previewXmlModel = () => {
  const xmlModel = document.querySelector('#xmlModel').value

  vm.xmlsByModel = filterByObjectPropertyName(xmlModel)(vm.xmls)

  const sampleXml = vm.xmlsByModel[0][xmlModel]
  const xmlProperties = getLastNodes(sampleXml, xmlModel)
  const selectProperties = document.querySelector('#xmlProperties')

  if (selectProperties.options.length > 0) {
    selectProperties.options.forEach((x, index) => selectProperties.remove(index))
  }

  xmlProperties.forEach(x => {
    const selectOption = document.createElement('option')
    selectOption.text = selectOption.value = x
    selectProperties.add(selectOption)
  })
}

vm.pluckProperties = () => {
  const willProcess = document.querySelector('willProcess')
  const selectProperties = document.querySelector('#xmlProperties')
  const selectedOptions = Array.from(selectProperties.options)
    .filter(x => x.selected)
  const nextURL = willProcess
    ? '../2-processor/template.html'
    : '../3-exporter/template.html'

  const pluckedXmls = pluckXmls(vm.xmlsByModel, selectedOptions)

// TODO
  vm.lastRawXmls
    .update()

  window.location.href = nextURL
}

const _modelPhase = async () => {
  const lastRawXmls = await getLastRawXml()
  const xmls = await parseToXml(lastRawXmls)
  const xmlsGroupedByModel = groupByFirstProperty(xmls)
  const xmlModelKeys = Object.keys(xmlsGroupedByModel)
  const xmlModels = xmlModelKeys.map(x => ({ name: `${x} (${xmlsGroupedByModel[x].length})`, value: x }))
  return { xmlModels, xmls, lastRawXmls }
}

const _viewPhase = ({ xmlModels, xmls, lastRawXmls }) => {
  const selectModel = document.querySelector('#xmlModel')

  vm.xmls = xmls
  vm.lastRawXmls = lastRawXmls

  xmlModels.forEach(x => {
    const selectOption = document.createElement('option')
    selectOption.text = x.name
    selectOption.value = x.value
    selectModel.add(selectOption)
  })
}

const init = async () => {
  const model = await _modelPhase()
  _viewPhase(model)
}

window.onload = init
