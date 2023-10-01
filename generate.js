const generateCode = () => {
  const str = 
`const palette = ${JSON.stringify(colorPalette, null, '  ')}
`
  console.log(str);
}

generate.addEventListener('click', () => {
  generateCode()
})