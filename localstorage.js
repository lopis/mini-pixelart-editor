const LOCALSTORAGE_KEY = 'pixeart_save'

save.addEventListener('click', () => {
  let data = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) || '{}')
  const name = filename.value
  if (data[name]) {
    const reply = confirm(`"${name}" already exists in local storage. Do you want to overwrite it?`)
    if (reply) {
      data[name] = canvasGrid
    }
  } else {
    data[name] = canvasGrid
  }
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(data))

  renderSavedFiles()
})

icons.addEventListener('click', event => {
  const key = event.target?.dataset?.key
  if (key) {
    let data = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) || '{}')
    canvasGrid = data[key]
    filename = key
    canvasSize.value = canvasGrid.length
    canvasSize.dispatchEvent(new Event('update'))
  } else if (event.target.classList.contains('icon-delete')) {
    const key = event.target.parentElement?.dataset?.key
    const reply = confirm(`Delete saved project "${key}"?`)
    if (reply) {
      let data = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) || '{}')
      delete data[key]
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(data))
    }
    renderSavedFiles()
  }
})

const renderSavedFiles = () => {
  let data = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) || '{}')
  let html = ''
  Object.entries(data).forEach(([key, value]) => {
    html += `<div data-key="${key}" class="label"><span class="filename">${key}</span><span class="icon-delete">✕</span></div>`
  })
  icons.innerHTML = html || 'No saved projects.'
}

renderSavedFiles()