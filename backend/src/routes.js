const { Router } = require('express');

const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

const routes = Router();

routes.get('/devs',DevController.index);

// routes.delete('/devs/:id', (req, res) => {
//     console.log(req.params);
//     return res.json({ message: '0k' });
// });

routes.post('/devs/', DevController.store);

routes.get('/search', SearchController.index);  

module.exports = routes;