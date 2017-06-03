const path = require('path')
const url = require('url')

const mainController = url.format({
  pathname: path.resolve('src/app/reader/template.html'),
  protocol: 'file:',
  slashes: true
})

module.exports = {
  windows: {
    main: {
      shape: { width: 800, height: 600, frame: false },
      controller: mainController
    }
  }
}
