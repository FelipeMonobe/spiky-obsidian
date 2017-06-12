const { getSampleProperties } = require('../../util/object')
const { getPluckedXmls, openDirectoryDialog } = require('./service')

const vm = {}

vm.selectDirectory = async () => {
  const selection = await openDirectoryDialog(vm.pluckedXmls)

  return selection
}

const _modelPhase = async () => {
  const pluckedXmls = await getPluckedXmls()
  return { pluckedXmls }
}

const _viewPhase = ({ pluckedXmls }) => {
  const selectModel = document.querySelector('#pluckedProperties')

  vm.pluckedXmls = pluckedXmls

  getSampleProperties(pluckedXmls)
    .forEach(x => {
      const selectOption = document.createElement('option')
      selectOption.text = selectOption.value = x
      selectModel.add(selectOption)
    })
}

const init = async () => {
  const model = await _modelPhase()
  _viewPhase(model)
}

window.onload = init
