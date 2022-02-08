'use strict'

var mongose = require('mongoose');
var Schema = mongose.Schema;

var SongSchema = Schema({
    number: String,
    name: String,
    duration: String,
    file: String,
    album:{type: Schema.ObjectId, ref:'Album'}
});

module.exports = mongose.model('Song', SongSchema);
