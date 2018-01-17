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
AWS.config.update(
  {
    acessKeyId: 'AKIAI5YIXD65G4VGIP4Q',
    secretAccessKey: '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',
    subregion: 'us-east-1',
  });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {fileSize: 52428800 },
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

router.post('/upload', upload.single('song'), (req, res) => {
  let sqlid = 0;
  sequelize
    .authenticate()
    .then(() => {
      return SongsModel.create({
        fileName: req.file.originalname,
      });
    })
      .then((sqlres) => {
        sqlid = sqlres.id;
        res.send(JSON.stringify(sqlres))
      })
      .then(() => {
        s3.putObject({
          Bucket: 'reactxmplayer',
          Key: sqlid + req.file.originalname,
          Body: req.file.buffer,
          ACL: 'public-read',
        }, (err) => {
          if (err) return res.status(400).send(err);
          res.send('File uploaded to S3');
        }
        )
      })
});
  //const file = req.body;
  //sequelize
  //  .authenticate()
  //  .then(() => {
  //    return SongsModel.create({
  //      fileName: req.body.name,
  //    });
  //  })
  //  .then((sqlres) =>{
  //    res.send(JSON.stringify(sqlres));
  //    console.log(file);
  //  })
  //  .catch(err => {
  //    console.error('Unable to connect to the database:', err);
  //  });
//});


module.exports = router
