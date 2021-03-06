const db = require('../db') //this is required
const SongsModel = require('../db/models/songs');
const AWS = require('aws-sdk');
const router = require('express').Router()
const Busboy = require('busboy');
const bodyParser = ('body-parser');
const multer = require('multer');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://matt@localhost/reactxmplayer', {});
const s3 = new AWS.S3();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {fileSize: 52428800 },
});

AWS.config.update(
  {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    subregion: 'us-east-1',
  });

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
  const params = {
    Bucket: "reactxmplayer",
    Key: JSON.stringify(req.body.id) + req.body.fileName,
  };
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
  s3.deleteObject(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data);
  })
});

function fileFilter(file) {
    if (!file.originalname.match(/\.(xm)$/)) {
        return false;
    }
		return true;
  }

router.post('/upload', upload.single('song'), (req, res) => {
	if (fileFilter(req.file)) {
		let sqlid = null;
		sequelize
			.authenticate()
			.then(() => {
				return SongsModel.create({
					fileName: req.file.originalname,
				});
			})
			.then((sqlres) => {
				sqlid = sqlres.id;
			console.log(AWS.config);
				return JSON.stringify(sqlres)
			})
			.then((sqlString) => {
				s3.putObject({
					Bucket: 'reactxmplayer',
					Key: sqlid + req.file.originalname,
					Body: req.file.buffer,
					ACL: 'public-read',
				}, (err) => {
					if (err) return res.status(400).send(err);
					res.send(sqlString);
				})
			})
	}
});


module.exports = router
