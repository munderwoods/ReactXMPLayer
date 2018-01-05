const db = require('../db') //this is required
const SongsModel = require('../db/models/songs');

const router = require('express').Router()
const Busboy = require('busboy');

const Sequelize = require('sequelize');
const sequelize = new Sequelize('reactxmplayer', 'postgres', null, {
  host: 'localhost',
  dialect: 'postgres',
});

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

router.post('/upload', function(req, res) {
	const busboy = new Busboy({headers: req.headers });
	busboy.on('file', function(file, filename,) {
		console.log(file, filename);
	});
	busboy.on('finish', function() {
		console.log(file, filename)
	});
  console.log(req.files);
	console.log(req.body);
  sequelize
    .authenticate()
    .then(() => {
      return SongsModel.create({
        fileName: req.files[0],
      });

    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
});


module.exports = router
