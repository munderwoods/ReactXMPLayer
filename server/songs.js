const db = require('../db') //this is required
const songs = require('../db/models/songs');
const Review = require('../db/models/review');

const router = require('express').Router()

router.get('/', function(req, res, next) {
    songs.findAll({
            include: [Review]
        })
        .then(result => {
            res.status(200).send(result);
        })
        .catch(next);
});

router.get('/:id', function(req, res, next) {
    songs.findOne({
            where:{id:req.params.id},
            include: [Review]
        })
        .then(result => {
            res.status(200).send(result);
        })
        .catch(next);
});

module.exports = router
