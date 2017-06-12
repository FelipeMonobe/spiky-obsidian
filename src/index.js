const { app } = require('electron')
const { windows } = require('./config/electron')
const { cleanup, destroyWindow, makeWindow } = require('./util/window')(app)

require('./app/2-exporter/backend')

let mainWindow = {}

const bootstrap = (mainSettings) => {
  mainWindow = makeWindow(mainSettings)
  const closeMain = () => destroyWindow(mainWindow)
  mainWindow.on('closed', closeMain)
}

const main = () => {
  const bootstrapMain = () => bootstrap(windows.main)
  app.on('ready', bootstrapMain)
  app.on('window-all-closed', cleanup)
}

main()
