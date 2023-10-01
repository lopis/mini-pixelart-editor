const generateCode = () => {
  const str = 
`const palette = '${colorPalette.join('').replaceAll('#', '')}';
const icons = ${getIconsString()};

drawIcon(icon, x, y) {
  const imageData = [];

  [...icon.data].map(c => {
    const z = c.charCodeAt(0);
    imageData.push(z&7);
    imageData.push((z>>3)&7);
  });

  for (let j = 0; j < icon.size; j++) {
    for (let i = 0; i < icon.size; i++) {
      if (imageData[j * icon.size + i]) {
        const index = 3 * (imageData[j * icon.size + i]-1);
        this.context.fillStyle = '#' + PALETTE.substring(index, index + 3);
        this.context.fillRect(x + i, y + j, 1, 1);
      }
    }
  }
}
`
  generatedCode.innerHTML = str
  codeModal.classList.remove('hidden')
}

generate.addEventListener('click', () => {
  generateCode()
})

closeButton.addEventListener('click', () => {
  codeModal.classList.add('hidden')
})