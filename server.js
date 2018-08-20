const bodyParser = require('body-parser');
//require body parser
const express = require('express');
//require express
const app = express();
//assigning app the value of express

const environment = process.env.NODE_ENV || 'development';
//setting the default environment to dev
const configuration = require('./knexfile')[environment];
//configuring the environment
const database = require('knex')(configuration);
//configuring the database

app.use(express.static('public'));
//serving static files
app.use(bodyParser.json());
//telling app to use body parser
app.use(bodyParser.urlencoded({ extended: true }));

//route handlers below...
app.get('/api/v1/projects', (request, response) => {
  //make a requesst to projects table
  database('projects').select()
  //selecting all projects from projects table
    .then((projects) => {
      response.status(200).json(projects);
      //responding with happy path
    })
    .catch((error) => {
      response.status(500).json({ error });
      //responding with sad path
    });
});

app.get('/api/v1/palettes', (request, response) => {
  //making request to palettes table
  database('palettes').select()
  //selecting all palettes from palettes table
    .then((palettes) => {
      response.status(200).json(palettes);
      //happy path
    })
    .catch((error) => {
      response.status(500).json({ error });
      //sad path
    });
});

app.post('/api/v1/projects', (request, response) => {
  //making post request to projects table
  const project = request.body;
  //assigning project the value of the body of the response from post

  for (let requireParameter of ['project_name']) {
    if (!project[requireParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { project_name: <STRING> }. You're missing a "${requireParameter}" property.`});
      //error handling 
    }
  }
  database('projects').insert(project, 'id')
    .then(project => {
      response.status(201).json({ id: project[0] });
      //happy path: adding project to projects table
    })
    .catch(error => {
      response.status(500).json({ error });
      //sad path
    });
});

app.post('/api/v1/palettes', (request, response) => {
  //making post request to palettes table
  const palette = request.body;
  //assigning the value of the request body to palette variable

  for (let requireParameter of ['palette_name', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5', 'project_id']) {
    if (!palette[requireParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { palette_name: <STRING>, 'color_1' <STRING>, 'color_2' <STRING>, 'color_3' <STRING>, 'color_4' <STRING>, 'color_5' <STRING>, 'project_id <STRING>' }. You're missing a "${requireParameter}" property.`});
      //error handling
    }
  }
  database('palettes').insert(palette, 'id')
    .then(palette => {
      response.status(201).json({ id: palette[0]});
      //happy path: adding palette to palette table
    })
    .catch(error => {
      response.status(500).json({ error });
      //sad path
    });
});

app.get('/api/v1/projects/:id', (request, response) => {
  //make request to projects with specific id
  database('projects').where('id', request.params.id).select()
  //selecting project where id matches id from request
    .then(projects => {
      if (projects.length) {
        response.status(200).json(projects);
        //happy path: responding with specific project
      } else {
        response.status(404).json({
          error: `Could not find project with id ${request.params.id}`
          //sad path: error handling
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
      //error handling
    });
});

app.get('/api/v1/palettes/:id', (request, response) => {
  //making request to palettes table
  database('palettes').where('id', request.params.id).select()
  //selecting all palettes where id matches id from request
    .then(palettes => {
      if (palettes.length) {
        response.status(200).json(palettes);
        //happy path: send back palette
      } else {
        response.status(404).json({
          error: `Could not find project with id ${request.params.id}`
          //sad path: error handling
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
      //error handling
    });
});

app.delete('/api/v1/palettes/:id', (request, response) => {
  //making request to palettes table
  database('palettes').where('id', request.params.id).del()
  //remove palette where id matches id from request
    .then(() => {
      response.status(202).json({
        'id': request.params.id
        //happy path: respond with id of removed palette
      });
    });
});

app.delete('/api/v1/palettes/delete/:id', (request, response) => {
  //making request to palettes table
  database('palettes').where('project_id', request.params.id).del()
  //removing palettes where the palettes foreign id matches id passed in from request
    .then(() => {
      response.status(202).json({
        'id': request.params.id
        //happy path: respond with id of removed palettes
      });
    });
});

app.delete('/api/v1/projects/:id', (request, response) => {
  //make request to projects table
  database('projects').where('id', request.params.id).del()
  //remove project where id matches id passed in from request
    .then(() => {
      response.status(202).json({
        'id': request.params.id
        //happy path: respond with id of removed project
      });
    });
});

app.set('port', process.env.PORT || 3000);
//set default port
app.locals.title = 'Palette Picker';
//set title

app.get('/', (request, response) => {
  response.send('Welcome to Palette Picker');
  //set root route handler
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  //tell app where to 'listen' and console log the port app is running on
});

module.exports = app;
//export app
