const state = {
  canvasGrid: [],
  canvas,
  selectedCell: [],
}

editorInit(state)
initControls(state)
initStorageControls(state)
updateSelectedColor()
updatePalette()
updateGrid(state, true)
initCanvas(state)

loadFirstFile(state)
renderSavedFiles()
loadPalette()