// @flow
const { app } = require('electron')
const { windows } = require('./config/electron.config')
const { cleanup, destroyWindow, makeWindow } = require('./utils/window.utils')(app)

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
