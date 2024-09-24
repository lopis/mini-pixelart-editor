const getParsingFunctionString = (iconString) => {
  return `const fontString = '${iconString}';

const drawText = (ctx, text, x, y, color, fontSize) => {
  const font = fontString.split(',')
  const [r, g, b, a] = [0, 0, 0, 255];
  const letterWidth = canvasSize.value * fontSize
  const spacing = 1 * fontSize
  const spaced = letterWidth + spacing
  const width = spaced * text.length - spacing
  const imageData = new ImageData(width, letterWidth)
  const fontData = text
  .toUpperCase()
  .split('')
  .forEach((character, i) => {
    const letterData = character === ' ' ? '0' : font[character.charCodeAt(0) - 35] || 0
    const paddedBinary = String(parseInt(letterData, 36).toString(2)).padStart(Math.pow(canvasSize.value, 2), '0')
    paddedBinary.split('').forEach((bit, j) => {
      if (bit !== '0') {
        for (let q = 0; q < fontSize; q++) {
          const jSize = j * fontSize
          const baseIndex = (
            (i * spaced) + // character
            (jSize % (letterWidth)) + // pixel
            (fontSize * width * Math.floor(jSize / letterWidth)) + // line
            (width * q)
          ) * 4

          // Draw 1 pixel (4 channels)
          for (let p = 0; p < fontSize; p++) {
            const index = p*4 + baseIndex
            imageData.data[index] = r
            imageData.data[index + 1] = g
            imageData.data[index + 2] = b
            imageData.data[index + 3] = a || 255
          }
        }
      }
    })
  })
  
  createImageBitmap(imageData)
  .then(bitmap => {
    ctx.reset()
    ctx.drawImage(bitmap, 0, 0)
  })
}`
}

function generateCode () {
  const str = getParsingFunctionString(getFontString())
  console.log(str);

  generatedCode.innerHTML = str
  codeModal.classList.remove('hidden')
  eval(str.replaceAll('const', 'var'))
  const ctx = testCanvas.getContext('2d')
  testCanvas.height = canvasSize.value
  testCanvas.width = canvasSize.value * ('Hello'.length + 1)
  drawText(ctx, 'Hello', 0, 0, '#000000', 1)
}