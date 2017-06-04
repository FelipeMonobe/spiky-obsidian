const { keys, map, last, path, values } = require('ramda')
const utilService = require('./src/util.service')
const fileService = require('./src/file.service')
const xlsxService = require('./src/xlsx.service')
const cliService = require('./src/cli.service')
const xmlService = require('./src/xml.service')

const main = async () => {
  const { selectedPath } = await cliService.askPath()
  const { selectedGlob } = await cliService.askGlob()

  cliService.toggleSpinner()

  const rawXmls = await fileService.readXmlFrom(selectedPath, selectedGlob)
  const xmls = await xmlService.parseToXml(rawXmls)
  const xmlsGroupedByTypes = utilService.groupByTypes(xmls)
  const typesKeys = keys(xmlsGroupedByTypes)
  const types = map(t => ({ name: `${t} (${xmlsGroupedByTypes[t].length})`, value: t }), typesKeys)

  cliService.toggleSpinner()

  const { selectedType } = await cliService.askXmlType(types)
  const xmlsFilteredByType = utilService.filterByXmlType(selectedType)(xmls)
  const sampleXml = xmlsFilteredByType[0].value[selectedType]
  const xmlProps = utilService.getDeepProps(sampleXml, selectedType)
  const { selectedProps } = await cliService.askXmlProps(xmlProps)
  const { willProcess } = await cliService.askProcessing()

  // /////////////////////////// REFACTOR /////////////////////////////
  // ////////////////////////// CONSOLIDATE ///////////////////////////
  const numberPattern = /^[\d.]+$/
  const treatedXmls = xmlsFilteredByType.map(xml => {
    const body = {}

    selectedProps.forEach(propPath => {
      const pathSegments = propPath.split('.')
      const prop = last(pathSegments)
      const rawValue = path(pathSegments, xml.value)
      const value = rawValue ? rawValue.trim() : ''

      body[prop] = numberPattern.test(value) && value.length < 13
      ? parseFloat(value)
      : value
    })
    return body
  })
  const result = { list: treatedXmls }
  if (willProcess) {
    const { selectedConsolidatees } = await cliService.askConsolidate(selectedProps)
    const resultProps = selectedConsolidatees.map((consolidatee) => last(consolidatee.split('.')))

    resultProps
      .forEach(resultProp => {
        result[`${resultProp}Consolidado`] = treatedXmls.reduce((acc, curr) => {
          const value = curr[resultProp] || 0
          return acc + value
        }, 0)
      })
  }

  const xlsxHeader = selectedProps.map(x => last(x.split('.')))
  const xlsxBody = result.list.map(i => values(i))
  const xlsxBuffer = xlsxService.buildXlsx('output.xlsx', xlsxHeader, xlsxBody)
  fileService.saveXlsx('output.xlsx', '/home/xinube', xlsxBuffer)
  // ////////////////////////////////////////////////////////////////////////////
}

main()
