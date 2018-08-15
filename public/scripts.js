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
  // getPalettes(),
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
    .then(results => projectFetch(results))
    // .then(a => displayProjects(a))
    .catch(err => console.log(err))
}

function projectFetch(projects) {
  let unresolvedPromises = projects.map(project => {
    let palettes = getPalettes(project.id).then(pal => {
      let projectToDisplay = {
      name: project.project_name,
      palettes: pal
    }
    displayProjects(projectToDisplay)
    })
  })
  return Promise.all(unresolvedPromises)
}

function getPalettes(project_id) {
  return fetch(`http://localhost:3000/api/v1/palettes/${project_id}`)
    .then(response => response.json())
    .then(results => results)
    .catch(err => console.log(err))
}

function postProject(data = {}) {
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
  $('.projects').prepend(`
    <li>
      <h3>${results.name}</h3>
      <section class='mini-palettes'></section>
    </li>
  `)
  
  results.palettes.forEach(palettes => {
    $('.mini-palettes').prepend(`
      <p>Palette Name: ${palettes.palette_name}</p>
      <article class='mini-card' style='background-color:${palettes.color_1}'></article>
      <article class='mini-card' style='background-color:${palettes.color_2}'></article>
      <article class='mini-card' style='background-color:${palettes.color_3}'></article>
      <article class='mini-card' style='background-color:${palettes.color_4}'></article>
      <article class='mini-card' style='background-color:${palettes.color_5}'></article>
    `)
  })
}























