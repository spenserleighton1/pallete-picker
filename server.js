const express = require('express');
const app = express();

app.use(express.static('public'))


app.locals.projects = []
app.locals.projects = [{id: '1', name: 'ppicker'},{id: '2', name: 'wow'}]

app.get('/api/v1/projects', (request, response) => {
  const projects = app.locals.projects;
  response.status(200).json(projects);
});

app.get('/api/v1/projects/:id', (request, response) => {
  const { id } = request.params;
  const project = app.locals.projects.find(project => project.id === id);
  return response.status(200).json(project);
});

app.post('/api/v1/projects', (request, response) => {
  const id = Date.now();
  const { project } = request.body;

  app.locals.projects.push(project)

  response.status(201).json({ id, project })
})

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.get('/', (request, response) => {
  response.send('Welcome to Palette Picker');
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});