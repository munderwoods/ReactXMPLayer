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
  sequelize
    .authenticate()
    .then(() => {
      SongsModel.findAll().then(songs => {
        if (songs) {
          res.send(songs);
        } else {
          res.send(null);
        };
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
    .then(() => {
      console.log(req.body.id);
      res.send(JSON.stringify(req.body.id))
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
});

router.post('/upload', function(req, res) {
  sequelize
    .authenticate()
    .then(() => {
      return SongsModel.create({
        fileName: req.body.name,
      });
    })
    .then((sqlres) =>res.send(JSON.stringify(sqlres)))
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
});


module.exports = router
