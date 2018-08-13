const generatePaletteBtn = document.querySelector('#generate-palette-btn');



const generateSingleColor = () => {
  let color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
  return color;
}

const generatePalette = () => {
  document.querySelector('#card-1').style.backgroundColor = generateSingleColor();
  document.querySelector('#card-2').style.backgroundColor = generateSingleColor();
  document.querySelector('#card-3').style.backgroundColor = generateSingleColor();
  document.querySelector('#card-4').style.backgroundColor = generateSingleColor();
  document.querySelector('#card-5').style.backgroundColor = generateSingleColor();
}

window.onload = generatePalette;
generatePaletteBtn.addEventListener('click', generatePalette);