const generatePaletteBtn = $('#generate-palette-btn');
const lockBtn = $('.lock-btn');

generatePaletteBtn.on('click', generatePalette);
lockBtn.on('click', toggleLock);

window.onload = generatePalette;

function toggleLock() {
  $(this).closest('article').toggleClass('locked');
}

function generateSingleColor(id) {
  console.log(id)
  if ($(id).closest('article').hasClass('locked')) { return }

  let color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
  let hexDisplay = $(id);
  hexDisplay.text(color);
  return color;
}

function generatePalette() {
  $('#card-1').css('background-color', generateSingleColor('.card-1'));
  $('#card-2').css('background-color', generateSingleColor('.card-2'));
  $('#card-3').css('background-color', generateSingleColor('.card-3'));
  $('#card-4').css('background-color', generateSingleColor('.card-4'));
  $('#card-5').css('background-color', generateSingleColor('.card-5'));
}
