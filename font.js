const states = []

const fontEditorInit = () => {
  for (let index = 0; index < 60; index++) {
    const canvas = document.createElement('canvas')
    canvas.id = `canvas${index}`
    canvas.classList.add('checkered')
    canvasContainer.appendChild(canvas)
    const state = {
      canvasGrid: [],
      canvas: canvas,
      selectedCell: [],
    }
    states.push(state)
    editorInit(state)
    initControls(state)
    updateGrid(state, true)
    initCanvas(state)
  }
}

fontEditorInit()
updateSelectedColor()
updatePalette()
