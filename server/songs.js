const db = require('../db') //this is required
const songs = require('../db/models/songs');

const router = require('express').Router()

const Sequelize = require('sequelize');
const sequelize = new Sequelize('reactxmplayer', 'postgres', null, {
  host: 'localhost',
  dialect: 'postgres',
});

router.get('/', function(req, res, next) {
    songs.findAll({
        })
        .then(result => {
            res.status(200).send(result);
        })
        .catch(next);
});

router.post('/upload', function(req, res, next) {
  sequelize
    .authenticate()
    .then(() => {
          console.log('Connection has been established successfully.');
        })
    .catch(err => {
          console.error('Unable to connect to the database:', err);
        });
});


module.exports = router
