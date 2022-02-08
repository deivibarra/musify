'use strict'

var mongose = require('mongoose');
var Schema = mongose.Schema;

var ArtistSchema = Schema({
    title: String,
    description: String,
    Imagen: String
});

module.exports = mongose.model('Artist', ArtistSchema);