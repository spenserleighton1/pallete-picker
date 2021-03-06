const generatePaletteBtn = $('#generate-palette-btn');
const lockBtn = $('.lock-btn');
const savePaletteBtn = $('#save-palette-btn');
const saveProjectBtn = $('#save-project-btn');
const deletePaletteBtn = $('.projects');
const showCase = $('.projects');
const deleteProjectBtn = $('.projects');


generatePaletteBtn.on('click', displayFeaturePalette);
lockBtn.on('click', toggleLock);
savePaletteBtn.on('click', savePalette);
saveProjectBtn.on('click', saveProject);
deletePaletteBtn.on('click', '.delete-btn', deletePalette);
deleteProjectBtn.on('click', '.delete-project-btn', deleteProject);
showCase.on('click', '.display-btn', showCasePalette);


let colors = [];

$(document).ready(() => {
  displayFeaturePalette(),
  getProjects(),
  getPalettes();
});

function toggleLock() {
  let lockBtn = $(this);
  $(this).closest('article').toggleClass('locked');

  if (lockBtn.hasClass('lock-btn')) {
    lockBtn.removeClass('lock-btn').addClass('unlock-btn');
  } else {
    lockBtn.removeClass('unlock-btn').addClass('lock-btn');
  }
}

function generateSingleColor(id) {
  if ($(id).closest('article').hasClass('locked')) {
    return;
  }

  const nums = '0123456789abcdef';
  let color = ['#'];
  for (let i = 0; i < 6; i++) {
    let index = Math.floor(Math.random() * 15);
    color.push(nums[index]);
  }
  color = color.join('');
  let hexDisplay = $(id);
  hexDisplay.text(color);

  return color;
}

function displayFeaturePalette(palette) {
  $('.card').each(function(i) {
    return $(this).css('background-color', generateSingleColor(`.card-${i+1}`));
  });

  if (palette) {
    let colors = palette[0];
    $('.card').each(function(i) {
      let hexDisplay = $(`.card-${i+1}`);
      hexDisplay.text(colors[`color_${i+1}`]);
      return $(this).css('background-color', colors[`color_${i+1}`]);
    });
  }
}

function saveProject(e) {
  e.preventDefault();
  let inputVal = $('#project-input').val();
  const project = {
    project_name: inputVal
  };

  let existingProject = $.find('.project-name').find(project => {
    return project.innerText === inputVal;
  });
  if (existingProject) {
    alert(`Oops! "${inputVal}" already exists in your project directory. Try a different name.`);
  } else {
    postProject(project);
  }
}

function savePalette(e) {
  e.preventDefault();
  let existingProject = $.find('.project-name').length;
  let inputVal = $('#palette-input').val();
  let id = $('select option:selected').val();

  if (!existingProject) {
    alert('Uh oh! One must create or select a project to save a palette.')
  } else if (!inputVal) {
    alert('Invalid or empty palette name.');
  } else if (id === 'Select a project') {
    alert('You forgot to select a project');
  } else {
    $('.hex').each(function() {
      colors.push($(this).text());
      $(this).parent('article').removeClass('locked');
    });

    $('.unlock-btn').removeClass('unlock-btn').addClass('lock-btn');
    let paletteToSave = {
      palette_name: inputVal,
      hexCodes: [...colors],
      project_id: id
    };
    colors = [];
    postPalette(paletteToSave);
  }
}

function postProject(project) {
  return fetch('/api/v1/projects/', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(project)
  })
    .then(response => response.json())
    .then(id => {
      $('.dropdown-menu').append(
        `
    <option value='${JSON.stringify(id.id)}'>${project.project_name}</option>
    `);
    })
    .then(() => getProjects())
    .then(() => getPalettes());
}

function postPalette(palette) {
  return fetch('/api/v1/palettes/', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
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
    .then(() => getPalettes());
}

function getProjects() {
  $('.projects').empty();
  return fetch('/api/v1/projects/')
    .then(response => response.json())
    .then(results => displayProjects(results))
    .catch(err => console.log(err));

  getPalettes();
}

function getPalettes() {
  return fetch('/api/v1/palettes/')
    .then(response => response.json())
    .then(results => displayPalettes(results))
    .catch(err => console.log(err));
}

function getPaletteById(id) {
  return fetch(`/api/v1/palettes/${id}`)
    .then(response => response.json())
    .then(results => displayFeaturePalette(results))
    .catch(err => console.log(err));
}

function deletePalette() {
  let deleteId = $(this).closest('div').attr('class');
  let projectName = $(this).closest('article').attr('id');
  let projectId = $(this).closest('.mini-palettes').attr('id');
  let id = $(this).attr('id');

  fetch(`/api/v1/palettes/${id}`, {
    method: 'DELETE'
  });

  $(this).closest('div').remove();

  let sectionLength = $(`.${deleteId}`).length;

  if (!sectionLength) {
    $(`#${projectName}`)
      .children('section')
      .prepend(`<p id='no-palettes-${projectId}'>No palettes to display.</p>`);
  }
}

function deleteProject() {
  let projectId = $(this).attr('id');
  $(`select option[value='${projectId}']`).remove();

  fetch(`/api/v1/palettes/delete/${projectId}`, {
    method: 'DELETE'
  });

  fetch(`/api/v1/projects/${projectId}`, {
    method: 'DELETE'
  });

  $(`#saved-${projectId}`).remove();

  if (!$('.projects').children().length) {
    $('.no-projects').text('No projects to display. Create and Save a new project to add palettes.');
  }
}

function populateSelect(projects) {
  $('select').empty().append(`<option default>Select a project</option>`);

  projects.forEach(project => {
    $('.dropdown-menu').append(`
    <option value='${project.id}'>${project.project_name}</option>
    `);
  });
}

function showCasePalette() {
  let paletteId = $(this).attr('id');
  getPaletteById(paletteId);
}


function displayProjects(projects) {
  if (!projects.length) {
    $('.no-projects').text('No projects to display. Create and Save a new project to add palettes.');
    return;
  }
  $('.no-projects').text('');
  populateSelect(projects);

  projects.forEach(project => {
    $('.projects').prepend(
      `
      <article class='saved-palettes' id='saved-${project.id}'>
        <h2 class='project-name ${project.project_name}'>${project.project_name}</h2>
        <section class='mini-palettes ${project.id}' id='${project.id}'>
        <p class='no-palettes' id='no-palettes-${project.id}'>No palettes to display.</p>
        </section>
        <button class='delete-project-btn' id='${project.id}'>remove project</button>
      </article>
    `
    );
  });
}

function displayPalettes(palettes) {
  palettes.forEach(palette => {
    $(`#no-palettes-${palette.project_id}`).empty();

    $(`#${palette.project_id}`).prepend(
      `
      <div class='delete-${palette.project_id}'>
        <p>
          <span class='palette-name-span'>Palette Name:</span class='name'> ${palette.palette_name}
          <button class='delete-btn' id='${palette.id}'></button>
          <button class='display-btn' id='${palette.id}'></button>
        </p>
        <article class='mini-card one' style='background-color:${palette.color_1}'></article>
        <article class='mini-card two' style='background-color:${palette.color_2}'></article>
        <article class='mini-card three' style='background-color:${palette.color_3}'></article>
        <article class='mini-card four' style='background-color:${palette.color_4}'></article>
        <article class='mini-card five' style='background-color:${palette.color_5}'></article>
      </div>
    `
    );
  });
}