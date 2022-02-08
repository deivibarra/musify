'use strict'

var mongose = require('mongoose');
var Schema = mongose.Schema;

var AlbumSchema = Schema({
    title: String,
    description: String,
    year: Number,
    Imagen: String,
    artist:{type: Schema.ObjectId, ref:'Artist'}
});

module.exports = mongose.model('Album', AlbumSchema);
