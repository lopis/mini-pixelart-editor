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

loadFirstFile(state)
renderSavedFiles()
loadPalette()

updateCanvas(state)
state.canvas.addEventListener('click', () => {
  updateCanvas(state);
});
state.canvas.addEventListener('mousemove', () => {
  updateCanvas(state);
});