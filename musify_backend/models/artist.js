'use strict'

var mongose = require('mongoose');
var Schema = mongose.Schema;

var ArtistSchema = Schema({
    name: String,
    description: String,
    image: String
});

module.exports = mongose.model('Artist', ArtistSchema);