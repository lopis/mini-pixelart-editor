const LOCALSTORAGE_FONT_SAVE = 'pixeart_save_font'

save.addEventListener('click', () => {
  let data = JSON.parse(localStorage.getItem(LOCALSTORAGE_FONT_SAVE) || '{}')
  const name = filename.value
  if (data[name]) {
    const reply = confirm(`"${name}" already exists in local storage. Do you want to overwrite it?`)
    if (reply) {
      data[name] = states.map(({canvasGrid}) => canvasGrid)
    }
  } else {
    data[name] = states.map(({canvasGrid}) => canvasGrid)
  }
  setUnsavedChanges(false)
  localStorage.setItem(LOCALSTORAGE_FONT_SAVE, JSON.stringify(data))
  renderSavedFiles()
})

const renderSavedFiles = () => {
  let data = JSON.parse(localStorage.getItem(LOCALSTORAGE_FONT_SAVE) || '{}')
  let html = ''
  Object.entries(data).forEach(([key]) => {
    html += `<div data-key="${key}" class="label"><span class="filename">${key}</span><span class="icon-delete">✕</span></div>`
  })
  iconsList.innerHTML = html || 'No saved projects.'
}

const setFirstSavedFont = () => {
  return loadFont(0)
}

const loadFont = (key) => {
  const data = JSON.parse(localStorage.getItem(LOCALSTORAGE_FONT_SAVE))
  if (data && Object.values(data).length > 0) {
    const firstFont = key ? data[key] : Object.values(data)[0]
    if (firstFont.length != 60) {
      console.error('The stored font is invalid.', firstFont.length);
      return false;
    }
    setCanvasSize(firstFont[0].length)
    states.forEach((state, i) => {
      state.canvasGrid = firstFont[i]
      console.log('update canvas', state);
      requestAnimationFrame(() => {
        updateCanvas(state)
        preview.height = canvasSize.value
        updateFontPreview()
      });
    })
    return true
  }

  updateFontPreview()

  return false
}

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
    loadFont(key)
  } else if (event.target.classList.contains('icon-delete')) {
    const key = event.target.parentElement?.dataset?.key
    const reply = confirm(`Delete saved project "${key}"?`)
    if (reply) {
      let data = JSON.parse(localStorage.getItem(LOCALSTORAGE_FONT_SAVE) || '{}')
      delete data[key]
      localStorage.setItem(LOCALSTORAGE_FONT_SAVE, JSON.stringify(data))
    }
    renderSavedFiles()
  }
})