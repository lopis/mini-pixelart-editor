const states = []
let previewCtx

const fontEditorInit = () => {
  for (let index = 0; index < 60; index++) {
    const canvas = document.createElement('canvas')
    canvas.id = `canvas${index}`
    canvas.classList.add('checkered')
    canvasContainer.appendChild(canvas)
    const canvasLabel = document.createElement('span')
    canvasLabel.innerText = String.fromCharCode(index + 35)
    canvasLabel.classList.add('canvas-label')
    canvasContainer.appendChild(canvasLabel)
    const state = {
      canvasGrid: [],
      canvas: canvas,
      selectedCell: [],
    }
    states.push(state)
    editorInit(state)
    initControls(state)
    updateGrid(state, true)
    renderCanvas(state);

    ['click', 'mousemove', 'mouseout'].forEach(e => {
      state.canvas.addEventListener(e, () => {
        renderCanvas(state)
        updateFontPreview()
      });
    })
  }

  previewCtx = preview.getContext('2d')
}

fontEditorInit()
setFirstSavedFont() || setDefaultFont()
updateSelectedColor()
updatePalette()
renderSavedFiles()

generate.addEventListener('click', () => {
  if (hasUnsavedChanged) {
    alert('You seem to have forgotten to save your changes.');
    return
  }
  generateCode()
})