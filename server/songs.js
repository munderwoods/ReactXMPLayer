const db = require('../db') //this is required
const SongsModel = require('../db/models/songs');

const router = require('express').Router()
const Busboy = require('busboy');
const bodyParser = ('body-parser');

const Sequelize = require('sequelize');
/*
const sequelize = new Sequelize('reactxmplayer', 'matt', 'pass', {
  host: 'localhost',
  dialect: 'postgres',
});
*/

const sequelize = new Sequelize('postgres://matt@localhost/reactxmplayer', {});

router.get('/songnames', function(req, res) {
  let data = [];
  sequelize
    .authenticate()
    .then(() => {
      SongsModel.findAll().then(songs => {
        res.send(songs);
      });
    });
})

router.post('/delete', function(req, res) {
  sequelize
    .authenticate()
    .then(() => {
      SongsModel.destroy({
        where: {
          id: req.body.id
        }
      })
    })
    .then(() => res.send(JSON.stringify('Deleted ID# ' + req.body.id)))
});

router.post('/upload', function(req, res) {
	console.log(req.body);
  sequelize
    .authenticate()
    .then(() => {
      return SongsModel.create({
        fileName: req.body.name,
      });

    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
});


module.exports = router
