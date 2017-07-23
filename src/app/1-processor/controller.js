const R = require('ramda')
const { getLastNodes } = require('../../util/object')
const { getLastRawXml, parseToXml, pluckXmls, updateXmls } = require('./service')
const { groupByFirstProperty, filterByObjectPropertyName } = require('../../util/array')

const vm = {}

vm.xmls = []
vm.xmlsByModel = []
vm.setLoading = (isLoading) => {
  const loading = document.querySelector('#loading')
  const display = isLoading
    ? 'inherit'
    : 'none'

  loading.style.display = display
}

vm.previewXmlModel = () => {
  const xmlModel = document.querySelector('#xmlModel').value

  vm.xmlsByModel = filterByObjectPropertyName(xmlModel)(vm.xmls)

  const xmlSamples = vm.xmlsByModel.map(x => x[xmlModel])
  const xmlSamplesProps = xmlSamples.map(x => getLastNodes(x, xmlModel))
  const xmlSamplesPropsFlattened = xmlSamplesProps.reduce((x, y) => x.concat(y), [])
  const uniqueXmlSamplesProps = R.uniq(xmlSamplesPropsFlattened)

  const selectProperties = document.querySelector('#xmlProperties')

  selectProperties.style.display = 'inherit'
  selectProperties.style.height = '400px'

  if (selectProperties.options.length > 0) {
    selectProperties.options.forEach((x, index) => selectProperties.remove(index))
  }

  uniqueXmlSamplesProps.forEach(x => {
    const selectOption = document.createElement('option')
    selectOption.text = selectOption.value = x
    selectProperties.add(selectOption)
  })
}

vm.pluckProperties = async () => {
  // const willProcess = document.querySelector('willProcess')
  const selectProperties = document.querySelector('#xmlProperties')
  const selectedOptions = Array.from(selectProperties.options)
    .filter(x => x.selected)
  const nextURL = '../2-exporter/template.html'
  const pluckedXmls = pluckXmls(vm.xmlsByModel, selectedOptions)

// /////////////////////////////////////////////////////////////////////////////////////////////////
  const [multiple, single] = R
  .partition(x => Object
  .keys(x)
  .map(y => x[y])
  .some(y => Array.isArray(y))
  , pluckedXmls)

  const replicated = multiple
  .map(x => {
    const [arrayProps, otherProps] = R.partition(y => Array.isArray(x[y]), Object.keys(x))
    const sample = arrayProps[0]
    const result = []
    let qty = x[sample].length

    R.times(n => {
      const body = {}

      otherProps.forEach(y => {
        body[y] = x[y]
      })

      arrayProps.forEach(y => {
        body[y] = x[y][n]
      })

      result.push(body)
    }, qty)

    return result
  })

  const final = replicated
  .reduce((acc, curr) => acc.concat(curr), [])
  .concat(single)
// /////////////////////////////////////////////////////////////////////////////////////////////////

  const lastRawXmlsId = vm.lastRawXmls.id

  await updateXmls(lastRawXmlsId, final)

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

  vm.setLoading(false)
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
