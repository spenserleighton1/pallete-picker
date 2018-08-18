const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then((projects) => {
      response.status(200).json(projects)
    })
    .catch((error) => {
      response.status(500).json({ error })
    })
});

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then((palettes) => {
      response.status(200).json(palettes)
    })
    .catch((error) => {
      response.status(500).json({ error })
    })
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requireParameter of ['project_name']) {
    if (!project[requireParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { project_name: <STRING> }. You're missing a "${requireParameter}" property.`})
    }
  }
  database('projects').insert(project, 'id')
    .then(project => {
      response.status(201).json({ id: project[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;

  for (let requireParameter of ['palette_name', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5', 'project_id']) {
    if (!palette[requireParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { palette_name: <STRING>, 'color_1' <STRING>, 'color_2' <STRING>, 'color_3' <STRING>, 'color_4' <STRING>, 'color_5' <STRING>, 'project_id <STRING>' }. You're missing a "${requireParameter}" property.`})
    }
  }
  database('palettes').insert(palette, 'id')
    .then(palette => {
      response.status(201).json({ id: palette[0]})
    })
    .catch(error => {
      response.status(500).json({ error })
    });
});

app.get('/api/v1/projects/:id', (request, response) => {
  database('projects').where('id', request.params.id).select()
    .then(projects => {
      if (projects.length) {
        response.status(200).json(projects);
      } else {
        response.status(404).json({
          error: `Could not find project with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    });
});

app.get('/api/v1/palettes/:id', (request, response) => {
  database('palettes').where('id', request.params.id).select()
    .then(palettes => {
      if (palettes.length) {
        response.status(200).json(palettes);
      } else {
        response.status(404).json({
          error: `Could not find project with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    });
});

app.delete('/api/v1/palettes/:id', (request, response) => {
  database('palettes').where('id', request.params.id).del()
  .then(d => d)
})

app.delete('/api/v1/projects/:id', (request, response) => {
  database('palettes').where('id', request.params.id).del()
  .then(d => d)
})

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.get('/', (request, response) => {
  response.send('Welcome to Palette Picker');
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
