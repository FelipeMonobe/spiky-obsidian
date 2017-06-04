const { BrowserWindow } = require('electron')

const cleanupIncomplete = (app) => () => { if (process.platform !== 'darwin') app.quit() }
const destroyWindow = (browserWindow) => { browserWindow = null }
const makeWindow = ({ shape, controller }) => {
  const newWindow = new BrowserWindow(shape)
  newWindow.loadURL(controller)
  return newWindow
}

module.exports = (app) => ({
  cleanup: cleanupIncomplete(app),
  destroyWindow,
  makeWindow
})
