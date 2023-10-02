const LOCALSTORAGE_SAVE = 'pixeart_save'
const LOCALSTORAGE_PALETTE = 'pixeart_palette'

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
  localStorage.setItem(LOCALSTORAGE_SAVE, JSON.stringify(data))
  renderSavedFiles()
})

icons.addEventListener('click', event => {
  const key = event.target?.dataset?.key
  if (key) {
    let data = JSON.parse(localStorage.getItem(LOCALSTORAGE_SAVE) || '{}')
    canvasGrid = data[key]
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

reset.addEventListener('click', () => {
  resetPalette();
})

const renderSavedFiles = () => {
  let data = JSON.parse(localStorage.getItem(LOCALSTORAGE_SAVE) || '{}')
  let html = ''
  Object.entries(data).forEach(([key, value]) => {
    html += `<div data-key="${key}" class="label"><span class="filename">${key}</span><span class="icon-delete">✕</span></div>`
  })
  icons.innerHTML = html || 'No saved projects.'
}

const getIconsString = () => {
  const data = JSON.parse(localStorage.getItem(LOCALSTORAGE_SAVE) || '{}')
  const stringData = {}
  Object.entries(data).forEach(([key, value]) => {
    let str = ''
    const flatArray = value.flat().map(n => parseInt(n))
    for(let i = 0; i < flatArray.length; i += 2) {
      // Encode 2 pixels together
      str += String.fromCharCode(0b1000000 + (flatArray[i] || 0) + ((flatArray[i+1] || 0) << 3));
    }
    stringData[key] = str
  })
  return JSON.stringify(stringData, null, '  ')
}

const savePalette = () => {
  localStorage.setItem(LOCALSTORAGE_PALETTE, JSON.stringify(colorPalette))
}

const loadPalette = () => {
  const data = JSON.parse(localStorage.getItem(LOCALSTORAGE_PALETTE) || '[]')
  if (data.length === 9) {
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
}

const resetPalette = () => {
  localStorage.setItem(LOCALSTORAGE_PALETTE, JSON.stringify([
    null,
    "#1c130a",
    "#f0ebea",
    "#939190",
    "#0f1945",
    "#376ed6",
    "#5d8f24",
    "#eda20c",
    "#eb6320",
  ]))
  loadPalette();
}

const loadFirstFile = () => {
  const data = JSON.parse(localStorage.getItem(LOCALSTORAGE_SAVE))
  if (data) {
    const key = Object.keys(data)[0]
    canvasGrid = data[key]
    filename.value = key
    canvasSize.value = canvasGrid.length
    canvasSize.dispatchEvent(new Event('update'))
  }
}

loadFirstFile()
renderSavedFiles()
loadPalette()