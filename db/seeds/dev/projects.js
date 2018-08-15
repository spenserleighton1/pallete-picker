
exports.seed = function(knex, Promise) {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      return Promise.all([
        knex('projects').insert({
          project_name: 'Weatherly'
        }, 'id')
        .then(project => {
          return knex('palettes').insert([
            { palette_name: 'neat palette', 
              color_1:'#3676e4', 
              color_2:'#f61ec8', 
              color_3:'#726650', 
              color_4:'#d7d714', 
              color_5:'#c663e7', 
              project_id: project[0]
            },{palette_name: 'cool CD', 
              color_1:'#3676e4', 
              color_2:'#f61ec8', 
              color_3:'#726650', 
              color_4:'#d7d714', 
              color_5:'#c663e7', 
              project_id: project[0]}
          ])
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};
