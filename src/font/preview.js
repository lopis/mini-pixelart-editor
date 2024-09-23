const setDefaultFont = () => {
  '6v7ic,2rwzo,6nvic,58jgo,55eyo,jz6bo,933m7,3ugt8,34ao,7k,b28,m0,20o0o,9a7vy,jbmjj,jf63j,ivhmn,etrs7,ju8e7,jalrz,jeyks,jwdj3,jwdlv,2t8g,2t8s,34yo,lskg,m2yo,jf4lo,jysjy,98ruh,j8htq,9v7zj,j8d32,ju78f,ju8t4,9ul2n,g44e1,jykrj,jewdq,g4rbt,fgsgv,hha5t,g6xgz,98rou,j8d7c,98uwe,j8d7d,9xgxq,jykqs,g3zn2,g3z9g,b1ipn,h4qu3,c8oz2,jhyfz,,,,'
  .split(',')
  .map(n => parseInt(n, 36).toString(2).padStart(Math.pow(canvasSize.value, 2), '0').split('').map(v => v == '1'))
  .forEach((letterData, index) => {
    const gridSize = 5;
    const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    letterData.forEach((value, i) => {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      grid[row][col] = value ? 1 : 0;
    });
    states[index].canvasGrid = grid;
    requestAnimationFrame(() => updateCanvas(states[index]))
  })
}

const updateFontPreview = () => {
  const fontString = states.map(({canvasGrid}) => (parseInt(canvasGrid.flat().map(v => v ? 1 : 0).join(''), 2) || '').toString(36) || '').join(',')
  const text = previewInput.value

  if (text.length === 0) {
    return
  }

  const fontSize = 1
  const letterWidth = canvasSize.value * fontSize
  const spacing = 1 * fontSize
  const spaced = letterWidth + spacing
  const width = spaced * text.length - spacing
  const imageData = new ImageData(width, letterWidth)

  const font = fontString.split(',')
  const [r, g, b, a] = [0, 0, 0, 255];
  text
  .replace('!', '@') // Necessary because ! is out of the unicode block we're using
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
    previewCtx.reset()
    previewCtx.drawImage(bitmap, 0, 0)
  })
}

previewInput.addEventListener('input', () => {
  updateFontPreview();
})

canvasSize.addEventListener('input', () => {
  preview.height = canvasSize.value
})