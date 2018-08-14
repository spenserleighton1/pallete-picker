const generatePaletteBtn = $('#generate-palette-btn');
const lockBtn = $('.lock-btn');

generatePaletteBtn.on('click', generatePalette);
lockBtn.on('click', toggleLock);


$(document).ready(() => {
  getProjects(),
  generatePalette()
})

function toggleLock() {
  $(this).closest('article').toggleClass('locked');
  // $(this).closest('button').toggleClass('btn-locked');
}

function generateSingleColor(id) {
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

//FETCH

function getProjects() {
  fetch('http://localhost:3000/api/v1/projects/')
    .then(response => response.json())
    .then(results => displayProjects(results))
}

function displayProjects(results) {
  if(!results) { return }

  results.forEach(result => {
    return $('.projects').prepend(`
    <li>
      <h3>${result.project}</h3>
      <section>
        <article class='mini-card' style='background-color:${result.palettes[0].hexCodes[0]}'></article>
        <article class='mini-card' style='background-color:${result.palettes[0].hexCodes[1]}'></article>
        <article class='mini-card' style='background-color:${result.palettes[0].hexCodes[2]}'></article>
        <article class='mini-card' style='background-color:${result.palettes[0].hexCodes[3]}'></article>
        <article class='mini-card' style='background-color:${result.palettes[0].hexCodes[4]}'></article>
      </section>
    </li>
  `)
  })
  
}































