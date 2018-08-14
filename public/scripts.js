const generatePaletteBtn = document.querySelector('#generate-palette-btn');
// const hexDisplay = document.querySelectorAll('.hex-display');

const generateSingleColor = (id) => {
  let color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
  let hexDisplay = document.querySelector(id);
  hexDisplay.innerText = color
  return color;
}

const generatePalette = () => {
  document.querySelector('#card-1').style.backgroundColor = generateSingleColor('#card-1');
  document.querySelector('#card-2').style.backgroundColor = generateSingleColor('#card-2');
  document.querySelector('#card-3').style.backgroundColor = generateSingleColor('#card-3');
  document.querySelector('#card-4').style.backgroundColor = generateSingleColor('#card-4');
  document.querySelector('#card-5').style.backgroundColor = generateSingleColor('#card-5');
}

window.onload = generatePalette;
generatePaletteBtn.addEventListener('click', generatePalette);