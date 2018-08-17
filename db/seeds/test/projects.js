exports.seed = function(knex, Promise) {
  return knex('palletes').del()
    .then( () => knex('projects').del())
    .then( () => {
      return Promise.all([
          knex('projects').insert({
            project_name: 'Weatherly'
          }, 'id')
          .then( project => {
            return knex('palletes').insert([
              { palette_name: 'Weatherly', 
              color_1: '#015', 
              color_2: '#152', 
              color_3: '#233', 
              color_4: '#222', 
              color_5: '#232', 
              project_id: project[0] },
              { palette_name: 'Headcount2.0', 
              color_1: '#f15', 
              color_2: '#f52', 
              color_3: '#f33', 
              color_4: '#f22', 
              color_5: '#f32', 
              project_id: project[0] }
            ])
          })
          .then(() => console.log('Seeding complete!'))
          .catch(error => console.log(`Error seeding data: ${error}`))
        ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};