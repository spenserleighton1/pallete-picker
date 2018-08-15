const generatePaletteBtn = $('#generate-palette-btn');
const lockBtn = $('.lock-btn');
const savePaletteBtn = $('#save-palette-btn')
const saveProjectBtn = $('#save-project-btn')

generatePaletteBtn.on('click', generatePalette);
lockBtn.on('click', toggleLock);
savePaletteBtn.on('click', savePalette)
saveProjectBtn.on('click', saveProject)

let colors = [];

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
  $('.card').each(function(i) {
    $(this).css('background-color', generateSingleColor(`.card-${i+1}`))
  })
}

function saveProject(e) {
  e.preventDefault()
  let inputVal = $('#project-input').val();
  $('.dropdown-menu').append(`
    <option value='${inputVal}'>${inputVal}</option>
  `)
}

function savePalette(e) {
  e.preventDefault()
  $('.hex').each(function() {
    colors.push($(this).text());
  });
    let inputVal = $('#palette-input').val();
    let paletteToSave = { name: inputVal, hexCodes: [...colors] }
    console.log(paletteToSave)
    colors = []
    postPalettes(paletteToSave)
}

function getProjects() {
  return fetch('http://localhost:3000/api/v1/projects/')
    .then(response => response.json())
    .then(results => displayProjects(results))
    .catch(err => console.log(err))
}

function postPalettes(data = {}) {
  return fetch('http://localhost:3000/api/v1/projects/', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(a => console.log(a))
}

function displayProjects(results) {
  if(!results) { return }

  results.forEach(result => {
    $('.projects').prepend(`
    <li>
      <h3>${result.project}</h3>
      <section class='mini-palettes'>
        ${result.palettes.forEach(palette => {
          $('.mini-palettes').prepend(`
            <p>Palette Name: ${palette.name}</p>
            <article class='mini-card' style='background-color:${palette.hexCodes[0]}'></article>
            <article class='mini-card' style='background-color:${palette.hexCodes[1]}'></article>
            <article class='mini-card' style='background-color:${palette.hexCodes[2]}'></article>
            <article class='mini-card' style='background-color:${palette.hexCodes[3]}'></article>
            <article class='mini-card' style='background-color:${palette.hexCodes[4]}'></article>
            `)
        })}
      </section>
    </li>
  `)
  })
  
}































