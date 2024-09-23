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