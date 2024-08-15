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
  cellSize = ~~(HEIGHT / canvasSize.value)
  updateGrid()
})

canvasSize.addEventListener('update', event => {
  event.preventDefault();
  size.innerHTML = event.target.value
  cellSize = ~~(HEIGHT / canvasSize.value)
  updateGrid(false)
})

canvas.addEventListener('mousemove', event => {
  const { clientX, clientY } = event
  const { offsetLeft, offsetTop } = event.target
  const x = clientX - offsetLeft
  const y = clientY - offsetTop
  selectedCell = [
    ~~(x / cellSize),
    ~~(y / cellSize),
  ]

  if (mouseDown) {
    const [row, col] = selectedCell
    if (canvasGrid[col] != undefined && canvasGrid[col][row] != undefined) {
      canvasGrid[col][row] = selectedColor
    }
  }
})

canvas.addEventListener('mouseout', () => {
  selectedCell = []
})

canvas.addEventListener('mousedown', () => {
  mouseDown = true
  const [row, col] = selectedCell
  canvasGrid[col][row] = selectedColor
})

canvas.addEventListener('mouseup', () => {
  mouseDown = false
})

colorFormat.addEventListener('change', event => {
  if (event.target.checked) {
    reply = confirm('Changing this setting to 3-char color format may cause loss of precision on all colors. Continue?')
    if (!reply) return
    // Shorten each value from #FFFFFF to #FFF
    colorPalette = [undefined]
    document.querySelectorAll('.palette input[type=color]').forEach(swatch => {
      const value = swatch.value
      swatch.value = value.replace(/#(.).(.).(.)./, "#$1$1$2$2$3$3")
      colorPalette.push(swatch.value)
      swatch.nextElementSibling.style.color = swatch.value
    })
  }
})

paletteSize.addEventListener('input', event => {
  const value = event.target.value
  const size = Math.pow(2, value)
  Array.from(palette.children).forEach((child, i) => {
    child.classList.toggle('hidden', i >= size)
  })
})

document.addEventListener('keydown', ({ key, target }) => {
  if (target.id === 'filename') return

  const keystr = 'cqweasdzx'
  let color = isNaN(key) ? keystr.indexOf(key) : parseInt(key)
  // if (color >= Math.pow(2, paletteSize.value)) {
  //   console.log(color);
  //   return
  // }

  if (Number.isInteger(color) && color >= 0 && color <= 8) {
    selectedColor = color
    document.querySelector(`[data-color="${selectedColor}"] [name="brush-color"]`).checked = true
  }

  if (key == 'Escape') {
    codeModal.classList.add('hidden')
    helpModal.classList.add('hidden')
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

clear.addEventListener('click', () => {
  updateGrid()
})

const drawGrid = () => {
  const size = canvasSize.value;
  for(let col = 0; col < size; col++) {
    for(let row = 0; row < size; row++) {
      const fill = colorPalette[canvasGrid[row][col]]
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
      if (selectedCell[1] == row && selectedCell[0] == col) {
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
        canvasGrid[col][row] = 0
      }
    }
  }
  canvas.height = canvasSize.value * cellSize
  canvas.width = canvasSize.value * cellSize
  canvas.style.height = canvas.height
  canvas.style.width = canvas.width
}

const updatePalette = () => {
  colorPalette = [undefined]
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