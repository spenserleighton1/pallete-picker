generatePalleteBtn = document.querySelector('#generate-pallete-btn');
cardOne = document.querySelector('#card-1');


const generateSingleColor = () => {
  let color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
  return color;
}

const generatePallete = () => {
  document.querySelector('#card-1').style.backgroundColor = generateSingleColor();
  document.querySelector('#card-2').style.backgroundColor = generateSingleColor();
  document.querySelector('#card-3').style.backgroundColor = generateSingleColor();
  document.querySelector('#card-4').style.backgroundColor = generateSingleColor();
  document.querySelector('#card-5').style.backgroundColor = generateSingleColor();
}

generatePalleteBtn.addEventListener('click', generatePallete);