const db = require('../db') //this is required
const SongsModel = require('../db/models/songs');
const AWS = require('aws-sdk');
const router = require('express').Router()
const Busboy = require('busboy');
const bodyParser = ('body-parser');
const multer = require('multer');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://dsnrafzmgyrabq:8c8447719e84d931202389d99a8a06854faa353e8a1f321a8ae6cc436c90ff97@ec2-54-225-230-142.compute-1.amazonaws.com:5432/dcru3dkvq749re', {});
const s3 = new AWS.S3();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {fileSize: 52428800 },
});

function fileFilter (req, file, cb) {

  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted

  // To reject this file pass `false`, like so:
  cb(null, false)

  // To accept the file pass `true`, like so:
  cb(null, true)

  // You can always pass an error if something goes wrong:
  cb(new Error('I don\'t have a clue!'))

}

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
