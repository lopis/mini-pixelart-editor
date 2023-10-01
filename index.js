const HEIGHT = canvas.clientHeight
canvas.height = HEIGHT
canvas.width = HEIGHT
const ctx = canvas.getContext('2d')
let selectedCell = []
let cellSize = Math.round(HEIGHT / canvasSize.value)
let canvasGrid = []
let colorPalette = []
let selectedColor
let mouseDown = false

canvasSize.addEventListener('input', event => {
  size.innerHTML = event.target.value
  cellSize = Math.floor(HEIGHT / canvasSize.value)
  updateGrid()
})

canvasSize.addEventListener('update', event => {
  event.preventDefault();
  size.innerHTML = event.target.value
  cellSize = Math.floor(HEIGHT / canvasSize.value)
  updateGrid(false)
})

canvas.addEventListener('mousemove', event => {
  const { clientX, clientY } = event
  const { offsetLeft, offsetTop } = event.target
  const x = clientX - offsetLeft
  const y = clientY - offsetTop
  selectedCell = [
    Math.floor(x / cellSize),
    Math.floor(y / cellSize),
  ]

  if (mouseDown) {
    const [row, col] = selectedCell
    if (canvasGrid[row] != undefined && canvasGrid[row][col] != undefined) {
      canvasGrid[row][col] = selectedColor
    }
  }
})

canvas.addEventListener('mouseout', () => {
  selectedCell = []
})

canvas.addEventListener('mousedown', () => {
  mouseDown = true
  const [row, col] = selectedCell
  canvasGrid[row][col] = selectedColor
})

canvas.addEventListener('mouseup', () => {
  mouseDown = false
})

document.addEventListener('keydown', ({ key }) => {
  const keystr = 'cqweasdzx'
  let color = isNaN(key) ? keystr.indexOf(key) : parseInt(key)
  if (Number.isInteger(color) && color >= 0 && color <= 8) {
    selectedColor = color
    document.querySelector(`[data-color="${selectedColor}"] [name="brush-color"]`).checked = true
  }

  if (key == 'Escape') {
    codeModal.classList.add('hidden')
  }
})

palette.addEventListener('input', event => {
  if (event.target.name === 'brush-color') {
    selectedColor = event.target.parentElement.dataset.color
  } else {
    const color = event.target.dataset.color
    colorPalette[color] = event.target.value
    updatePalette()
    savePalette()
  }
})

const drawGrid = () => {
  const size = canvasSize.value;
  for(let col = 0; col < size; col++) {
    for(let row = 0; row < size; row++) {
      const fill = colorPalette[canvasGrid[col][row]]
      if (fill) {
        ctx.fillStyle = fill
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize)
      }
    }
  }
  for(let col = 0; col < size; col++) {
    for(let row = 0; row < size; row++) {
      ctx.strokeStyle = '#615d83'
      ctx.lineWidth = 1
      if (selectedCell[0] == col && selectedCell[1] == row) {
        ctx.lineWidth = 5
      }
      ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize)
    }
  }
}

const initCanvas = () => {
  ctx.clearRect(0, 0, canvas.height, canvas.width)
  drawGrid()
  requestAnimationFrame(initCanvas)
}

const updateGrid = (resetGrid = true) => {
  if (resetGrid) {
    canvasGrid = []
    for(let col = 0; col < canvasSize.value; col++) {
      canvasGrid.push([])
      for(let row = 0; row < canvasSize.value; row++) {
        canvasGrid[col][row] = 8
      }
    }
  }
  canvas.height = canvasSize.value * cellSize
  canvas.width = canvasSize.value * cellSize
  canvas.style.height = canvas.height
  canvas.style.width = canvas.width
}

const updatePalette = () => {
  colorPalette = []
  document.querySelectorAll('.palette input[type=color]').forEach(swatch => {
    colorPalette.push(swatch.value)
    swatch.nextElementSibling.style.color = swatch.value
  })
}

const updateSelectedColor = () => [
  selectedColor = document.querySelector('.palette input[type=radio]:checked')
  .parentElement.dataset.color
]

updateSelectedColor()
updatePalette()
updateGrid()
initCanvas()