const generatePaletteBtn = $('#generate-palette-btn');
const lockBtn = $('.lock-btn');
const savePaletteBtn = $('#save-palette-btn');
const saveProjectBtn = $('#save-project-btn');
const deleteBtn = $('.projects');
const showCase = $('.projects');

generatePaletteBtn.on('click', generatePalette);
lockBtn.on('click', toggleLock);
savePaletteBtn.on('click', savePalette);
saveProjectBtn.on('click', saveProject);
deleteBtn.on('click', '.delete-btn', deletePalette);
showCase.on('click', '.mini-card', showCasePalette);

let colors = [];

$(document).ready(() => {
  generatePalette(),
  getProjects()
})

function toggleLock() {
  $(this).closest('article').toggleClass('locked');
}

function generateSingleColor(id) {
  if ($(id).closest('article').hasClass('locked')) { return }

  const nums = '0123456789abcdef';
  let color = ['#'];
  for(let i = 0; i < 6; i++) {
    let index = Math.floor(Math.random() * 15);
    color.push(nums[index]);
  }
  color = color.join('')
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
  const project = {project_name: inputVal}
  postProject(project)
}

function savePalette(e) {
  e.preventDefault()
  $('.hex').each(function() {
    colors.push($(this).text());
  });

  let inputVal = $('#palette-input').val();
  let id = $('select option:selected').val();
  let paletteToSave = { palette_name: inputVal, hexCodes: [...colors], project_id: id }
  colors = []
  postPalette(paletteToSave);
}

function postPalette(palette) {
  return fetch('http://localhost:3000/api/v1/palettes/', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      palette_name: palette.palette_name,
      color_1: palette.hexCodes[0],
      color_2: palette.hexCodes[1],
      color_3: palette.hexCodes[2],
      color_4: palette.hexCodes[3],
      color_5: palette.hexCodes[4],
      project_id: palette.project_id
    })
  })
  .then(response => response.json())
  .then(() => getProjects())

}

function postProject(project) {
  console.log(project)
  return fetch('http://localhost:3000/api/v1/projects/', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project)
  })
  .then(response => response.json())
  .then(id => {
    $('.dropdown-menu').append(`
    <option value='${JSON.stringify(id.id)}'>${project.project_name}</option>
    `)
  })
}

function getProjects() {
  $('.projects').empty()
  return fetch('http://localhost:3000/api/v1/projects/')
    .then(response => response.json())
    .then(results => projectFetch(results))
    .catch(err => console.log(err))
}

function projectFetch(projects) {
  let unresolvedPromises = projects.map(project => {
    let palettes = getPalettes(project.id).then(pal => {

      let projectToDisplay = {
      id: project.id,  
      name: project.project_name,
      palettes: pal
      }

    displayProjects(projectToDisplay)
    })
  })

  populateSelect(projects)
  return Promise.all(unresolvedPromises)
}

function populateSelect(projects) {
  projects.forEach(project => {
    $('.dropdown-menu').append(`
    <option value='${project.id}'>${project.project_name}</option>
    `)
  })
}

function getPalettes(project_id) {
  return fetch(`http://localhost:3000/api/v1/palettes/${project_id}`)
    .then(response => response.json())
    .then(results => results)
    .catch(err => console.log(err))
}

function deletePalette() {
  let id = $(this).attr('id')
  console.log( $(`#${id}`) )
  
  let project_id = $('.mini-palettes').attr('id')
  fetch(`http://localhost:3000/api/v1/palettes/${id}`, {
    method: 'DELETE'
  });

  $(this).closest('div').remove()
  if (!$(`#${id}`).length()) {
}
}

function showCasePalette() {
    let one = $('.one').css('background-color');
    let two = $('.two').css('background-color');
    let three = $('.three').css('background-color');
    let four = $('.four').css('background-color');
    let five = $('.five').css('background-color');

    $('#card-1').css('background-color', one);
    $('#card-2').css('background-color', two);
    $('#card-3').css('background-color', three);
    $('#card-4').css('background-color', four);
    $('#card-5').css('background-color', five);
}

function displayProjects(projects) {
  if (!projects) { return }

  $('.projects').prepend(`
    <article class='saved-palettes'>
      <h2 class='project-name'>${projects.name}</h2>
      <section class='mini-palettes' id='${projects.id}'></section>
    </article>
  `)
  
  projects.palettes.forEach(palette => {
      $(`#${projects.id}`).prepend(`
      <div>
        <p>
          <span class='palette-name-span'>Palette Name:</span class='name'> ${palette.palette_name}
          <button class='delete-btn' id='${palette.id}'></button>
        </p>
        <article class='mini-card one' style='background-color:${palette.color_1}'></article>
        <article class='mini-card two' style='background-color:${palette.color_2}'></article>
        <article class='mini-card three' style='background-color:${palette.color_3}'></article>
        <article class='mini-card four' style='background-color:${palette.color_4}'></article>
        <article class='mini-card five' style='background-color:${palette.color_5}'></article>
      </div>
    `)
  })
}























