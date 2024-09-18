const LOCALSTORAGE_SAVE = 'pixeart_save'
const LOCALSTORAGE_PALETTE = 'pixeart_palette'
const LOCALSTORAGE_PALETTE_SIZE = 'pixeart_palette_size'

const initStorageControls = (canvasGrid) => {
  save.addEventListener('click', () => {
    let data = JSON.parse(localStorage.getItem(LOCALSTORAGE_SAVE) || '{}')
    const name = filename.value
    if (data[name]) {
      const reply = confirm(`"${name}" already exists in local storage. Do you want to overwrite it?`)
      if (reply) {
        data[name] = canvasGrid
      }
    } else {
      data[name] = canvasGrid
    }
    setUnsavedChanges(false)
    localStorage.setItem(LOCALSTORAGE_SAVE, JSON.stringify(data))
    renderSavedFiles()
  })
  
  iconsList.addEventListener('click', event => {
    if (hasUnsavedChanged) {
      reply = confirm('Your unsaved changes will be lost, continue?')
      if (!reply) {
        event.preventDefault()
        return false
      }
    }
  
    setUnsavedChanges(false)
    const key = event.target?.dataset?.key
    if (key) {
      let data = JSON.parse(localStorage.getItem(LOCALSTORAGE_SAVE) || '{}')
      canvasGrid.splice(0, canvasGrid.length, ...data[key])
      filename.value = key
      canvasSize.value = canvasGrid.length
      canvasSize.dispatchEvent(new Event('update'))
    } else if (event.target.classList.contains('icon-delete')) {
      const key = event.target.parentElement?.dataset?.key
      const reply = confirm(`Delete saved project "${key}"?`)
      if (reply) {
        let data = JSON.parse(localStorage.getItem(LOCALSTORAGE_SAVE) || '{}')
        delete data[key]
        localStorage.setItem(LOCALSTORAGE_SAVE, JSON.stringify(data))
      }
      renderSavedFiles()
    }
  })
}

const renderSavedFiles = () => {
  let data = JSON.parse(localStorage.getItem(LOCALSTORAGE_SAVE) || '{}')
  let html = ''
  Object.entries(data).forEach(([key, value]) => {
    html += `<div data-key="${key}" class="label"><span class="filename">${key}</span><span class="icon-delete">✕</span></div>`
  })
  iconsList.innerHTML = html || 'No saved projects.'
}

const getIconsString = () => {
  const data = JSON.parse(localStorage.getItem(LOCALSTORAGE_SAVE) || '{}')
  const stringData = {}
  Object.entries(data).forEach(([key, value]) => {
    let str = ''
    const flatArray = value.flat().map(n => parseInt(n))

    pSize = parseInt(paletteSize.value)
    inc = pSize == 3 ? 2 : pSize == 2 ? 3 : 6
    for(let i = 0; i < flatArray.length; i += inc) {
      // Encode multiple pixels together
      // pallete size 8 -> 3 bits -> 2 pixels per char
      //              4 -> 2 bits -> 3 pixels per char
      //              2 -> 1 bit  -> 6 pixels per char
      if (paletteSize.value === '3') {
        str += String.fromCharCode(0b1000000 + (flatArray[i] || 0) + ((flatArray[i+1] || 0) << 3));
      } else if (paletteSize.value === '2') {
        str += String.fromCharCode(
          0b1000000 +
          (flatArray[i] || 0) +
          ((flatArray[i+1] || 0) << 2) +
          ((flatArray[i+2] || 0) << 4)
        )
      } else {
        str += String.fromCharCode(
          0b1000000 +
          (flatArray[i] || 0) +
          ((flatArray[i+1] || 0) << 1) +
          ((flatArray[i+2] || 0) << 2) +
          ((flatArray[i+3] || 0) << 3) +
          ((flatArray[i+4] || 0) << 4) +
          ((flatArray[i+5] || 0) << 5)
        )
      }
    }
    stringData[key] = str
  })
  return JSON.stringify(stringData, null, '  ')
}

const savePalette = () => {
  localStorage.setItem(LOCALSTORAGE_PALETTE, JSON.stringify(colorPalette))
  localStorage.setItem(LOCALSTORAGE_PALETTE_SIZE, paletteSize.value)
}

const loadPalette = () => {
  const data = JSON.parse(localStorage.getItem(LOCALSTORAGE_PALETTE) || '[]')
  if (data.length === 8) {
    colorPalette = []
    data.forEach((color, i) => {
      if (color === null) {
        colorPalette.push(null)
      } else {
        const label = document.querySelector(`[data-color="${i}"]`)
        label.querySelector('[type="color"]').value = color
        colorPalette.push(color)
        label.querySelector('.color-swatch').style.color = color
      }
    })
  } else {
    resetPalette()
  }

  const size = localStorage.getItem(LOCALSTORAGE_PALETTE_SIZE)
  if (size) {
    paletteSize.value = size
    paletteSize.dispatchEvent(new Event('input'))
  }
}

const resetPalette = () => {
  localStorage.setItem(LOCALSTORAGE_PALETTE, JSON.stringify([
    null,
    "#1c130a",
    "#f0ebea",
    "#939190",
    "#0f1945",
    "#d63737",
    "#5d8f24",
    "#eda20c",
  ]))
  loadPalette();
}

const loadFirstFile = (canvasGrid) => {
  const data = JSON.parse(localStorage.getItem(LOCALSTORAGE_SAVE))
  if (data && Object.keys(data).length > 0) {
    const key = Object.keys(data)[0]
    canvasGrid.splice(0, canvasGrid.length, ...data[key])
    filename.value = key
    canvasSize.value = canvasGrid.length
    canvasSize.dispatchEvent(new Event('update'))
  }
}