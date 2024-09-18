let HEIGHT = 0
let cellSize = 0
let colorPalette = []
let selectedColor
let mouseDown = false
let isRightButton = false
let hasUnsavedChanged = false

const editorInit = (state) => {
  HEIGHT = state.canvas.clientHeight
  state.canvas.height = HEIGHT
  state.canvas.width = HEIGHT
  state.ctx = state.canvas.getContext('2d')
  cellSize = Math.round(HEIGHT / canvasSize.value)
}

const initControls = (state) => {
  canvasSize.addEventListener('input', event => {
    size.innerHTML = event.target.value
    cellSize = ~~(HEIGHT / canvasSize.value)
    updateGrid(state, true)
  })
  
  canvasSize.addEventListener('update', event => {
    event.preventDefault();
    size.innerHTML = event.target.value
    cellSize = ~~(HEIGHT / canvasSize.value)
    updateGrid(state, false)
  })
  
  state.canvas.addEventListener('mousemove', event => {
    const { clientX, clientY } = event
    const { offsetLeft, offsetTop, parentElement } = event.target
    const x = clientX - offsetLeft + parentElement.scrollLeft
    const y = clientY - offsetTop + parentElement.scrollTop
    state.selectedCell = [
      ~~(x / cellSize),
      ~~(y / cellSize),
    ]
  
    if (mouseDown) {
      const [row, col] = state.selectedCell
      if (state.canvasGrid[col] != undefined && state.canvasGrid[col][row] != undefined) {
        state.canvasGrid[col][row] = isRightButton ? 0 : selectedColor
        event.preventDefault();
        event.stopPropagation();
        setUnsavedChanges(true)
      }
    }
  })
  
  state.canvas.addEventListener('mouseout', () => {
    state.selectedCell = []
  })
  
  state.canvas.addEventListener('mousedown', (event) => {
    isRightButton = event.button === 2;
    mouseDown = true
    const [row, col] = state.selectedCell
    state.canvasGrid[col][row] = isRightButton ? 0 : selectedColor
    setUnsavedChanges(true)
  })
  
  state.canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  })
  
  state.canvas.addEventListener('mouseup', () => {
    mouseDown = false
  })
  
  colorFormat.addEventListener('change', event => {
    if (event.target.checked) {
      reply = confirm('Changing this setting to 3-char color format may cause loss of precision on all colors. Continue?')
      if (!reply) {
        event.preventDefault()
        return false
      }
      // Shorten each value from #FFFFFF to #FFF
      colorPalette = [undefined]
      document.querySelectorAll('.palette input[type=color]').forEach(swatch => {
        const value = swatch.value
        swatch.value = value.replace(/#(.).(.).(.)./, "#$1$1$2$2$3$3")
        colorPalette.push(swatch.value)
        swatch.parentElement.style.color = swatch.value
      })
    }
  })
  
  paletteSize.addEventListener('input', event => {
    const value = event.target.value
    const size = Math.pow(2, value)
    Array.from(palette.children).forEach((child, i) => {
      child.classList.toggle('hidden', i != 7 && i >= size-1)
    })
    if (selectedColor >= size) {
      selectedColor = 1
      document.querySelector(`[data-color="${selectedColor}"] [name="brush-color"]`).checked = true
    }
    savePalette();
  })
  
  document.addEventListener('keydown', ({ key, target }) => {
    if (target.id === 'filename') return
  
    const keystr = 'cqweasdzx'
    let color = isNaN(key) ? keystr.indexOf(key) : parseInt(key)
  
    if (Number.isInteger(color) && color >= 0 && color <= 8) {
      const colorControl = document.querySelector(`[data-color="${color}"]`)
      if (!colorControl.classList.contains('hidden')) {
        selectedColor = color
        colorControl.querySelector('[name="brush-color"]').checked = true
      }
    }
  
    if (key == 'Escape') {
      codeModal.classList.add('hidden')
      helpModal.classList.add('hidden')
    }
  })
  
  palette.addEventListener('input', event => {
    if (event.target.name === 'brush-color') {
      selectedColor = event.target.parentElement.parentElement.dataset.color
    } else {
      const color = event.target.dataset.color
      colorPalette[color] = event.target.value
      updatePalette()
      savePalette()
    }
  })
  
  if (typeof clear !== 'undefined') {
    clear.addEventListener('click', () => {
      updateGrid(canvas, state.canvasGrid)
      setUnsavedChanges(true)
    })
    up.addEventListener('click', () => {
      state.canvasGrid.push(state.canvasGrid.shift())
      setUnsavedChanges(true)
    })
    down.addEventListener('click', () => {
      state.canvasGrid.unshift(state.canvasGrid.pop())
      setUnsavedChanges(true)
    })
    right.addEventListener('click', () => {
      state.canvasGrid.forEach(row => row.push(row.shift()))
      setUnsavedChanges(true)
    })
    left.addEventListener('click', () => {
      state.canvasGrid.forEach(row => row.unshift(row.pop()))
      setUnsavedChanges(true)
    })
  }
}

const setUnsavedChanges = (value) => {
  hasUnsavedChanged = value
  indicator.classList.toggle('unsaved', value)
}

const drawGrid = (state) => {
  const size = canvasSize.value;
  for(let col = 0; col < size; col++) {
    for(let row = 0; row < size; row++) {
      const fill = colorPalette[state.canvasGrid[row][col]]
      if (fill) {
        state.ctx.fillStyle = fill
        state.ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize)
      }
    }
  }
  for(let col = 0; col < size; col++) {
    for(let row = 0; row < size; row++) {
      state.ctx.strokeStyle = '#615d83'
      state.ctx.lineWidth = 1
      if (state.selectedCell[1] == row && state.selectedCell[0] == col) {
        state.ctx.lineWidth = 5
      }
      state.ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize)
    }
  }
}

const initCanvas = (state) => {
  state.ctx.clearRect(0, 0, state.canvas.height, state.canvas.width)
  drawGrid(state)
  requestAnimationFrame(() => initCanvas(state))
}

const updateGrid = ({canvas, canvasGrid}, resetGrid = true) => {
  if (resetGrid) {
    canvasGrid.splice(0, canvasGrid.length)
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
    swatch.parentElement.style.color = swatch.value
  })
}

const updateSelectedColor = () => {
  selectedColor = document.querySelector('.palette input[type=radio]:checked')
  .parentElement.parentElement.dataset.color
}