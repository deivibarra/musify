'use strict'

var mongose = require('mongoose');
var Schema = mongose.Schema;

var UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    role: String,
    Imagen: String
});

module.exports = mongose.model('User', UserSchema);

