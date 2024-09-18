const fontCanvasData = []

const fontEditorInit = () => {
  for (let index = 0; index < 60; index++) {
    const canvas = document.createElement('canvas')
    canvas.id = `canvas${index}`
    canvas.classList.add('checkered')
    canvasContainer.appendChild(canvas)
    fontCanvasData[index] = []
    editorInit(canvas)
    initControls(canvas, fontCanvasData[index])
    updateGrid(canvas, fontCanvasData[index], true)
    initCanvas(canvas, fontCanvasData[index])
  }
}

fontEditorInit()
updateSelectedColor()
updatePalette()
