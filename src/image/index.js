const state = {
  canvasGrid: [],
  canvas,
  selectedCell: [],
}

editorInit(state)
initControls(state)
initImageStorageControls(state)
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

generate.addEventListener('click', () => {
  if (hasUnsavedChanged) {
    alert('You seem to have forgotten to save your changes.');
    return
  }
  generateCode()
})