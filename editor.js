let canvasGrid = []

editorInit(canvas)
initControls(canvas, canvasGrid)
initStorageControls(canvasGrid)
updateSelectedColor()
updatePalette()
updateGrid(canvas, canvasGrid, true)
initCanvas(canvas, canvasGrid)

loadFirstFile(canvasGrid)
renderSavedFiles()
loadPalette()