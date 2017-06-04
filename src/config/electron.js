const { format } = require('url')
const { resolve } = require('path')

const mainShapeWidth = 800
const mainShapeHeight = 600
const mainShapeFrame = false
const mainShape = { width: mainShapeWidth, height: mainShapeHeight, frame: mainShapeFrame }
const mainCtrlPath = resolve('src/app/0-reader/template.html')
const mainCtrlProtocol = 'file:'
const mainCtrlSlashes = true
const mainController = format({
  pathname: mainCtrlPath,
  protocol: mainCtrlProtocol,
  slashes: mainCtrlSlashes
})

module.exports = {
  windows: {
    main: { shape: mainShape, controller: mainController }
  }
}
