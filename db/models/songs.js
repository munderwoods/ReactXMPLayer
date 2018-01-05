'use strict'

const Sequelize = require('sequelize');
const db = require('../index.js');

const SongsModel = db.define('songs', {
  fileName: {
  	type: Sequelize.STRING,
  	allowNull: false
  },

});

module.exports = SongsModel;
