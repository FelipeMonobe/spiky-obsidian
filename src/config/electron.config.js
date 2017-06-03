const path = require('path')
const url = require('url')

const mainController = url.format({
  pathname: path.join(__dirname, 'index.html'),
  protocol: 'file:',
  slashes: true
})

module.exports = {
  windows: {
    main: {
      size: { width: 800, height: 600 },
      controller: mainController
    }
  }
}
