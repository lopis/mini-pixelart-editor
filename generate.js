function generateCode () {
  const colorLength = colorFormat.checked ? 3 : 6
  const str = 
`const palette = '${getPaletteString()}';
const icons = ${getIconsString()};

const drawIcon = (ctx, icon, x, y) => {
  const imageData = [];

  [...icon].map(c => {
    const z = c.charCodeAt(0);
    ${paletteSize.value === '3' ? `
    imageData.push(z&7);
    imageData.push((z>>3)&7);
    ` : paletteSize.value === '2' ? `
    imageData.push(z&3);
    imageData.push((z>>2)&3);
    imageData.push((z>>4)&3);  
    ` : `
    imageData.push(z&1);
    imageData.push((z>>1)&1);
    imageData.push((z>>2)&1);  
    imageData.push((z>>3)&1);  
    imageData.push((z>>4)&1);  
    imageData.push((z>>5)&1);  
    `}
  });

  console.log(imageData);

  const size = Math.sqrt(icon.length * 2)
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      if (imageData[j * size + i]) {
        const index = ${colorLength} * (imageData[j * size + i]-1);
        ctx.fillStyle = '#' + palette.substring(index, index + ${colorLength});
        ctx.fillRect(x + i, y + j, 1, 1);
      }
    }
  }
}
`
  generatedCode.innerHTML = str
  codeModal.classList.remove('hidden')
  eval(str.replaceAll('const', 'var'))
  const ctx = testCanvas.getContext('2d')
  testCanvas.height = canvasSize.value
  testCanvas.width = canvasSize.value
  drawIcon(ctx, icons[Object.keys(icons)[0]], 0, 0)
}

const getPaletteString = () => {
  if (colorFormat.checked) {
    return colorPalette
      .slice(1, 9)
      .map(c => c.replace(/#(.).(.).(.)./, "#$1$2$3"))
      .join('').replaceAll('#', '')
  }

  return colorPalette.join('').replaceAll('#', '')
}

generate.addEventListener('click', () => {
  generateCode()
})

help.addEventListener('click', () => {
  helpModal.classList.remove('hidden')
})

document.addEventListener('click', event => {
  if (event.target.id === 'closeButton') {
    codeModal.classList.add('hidden')
    helpModal.classList.add('hidden')
  }
})