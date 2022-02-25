'user strict'

//Creamos el route
var express = require('express');
var api = express.Router();

//Importar el Controladro
var ArtistController = require('../controllers/artist');

//Importar middleware
var md = require('../middleware/authenticated');

//Para manejo de archivo
var multipart = require('connect-multiparty');
//Importar middleware para Archivo
var md_upload = multipart({uploadDir: './uploads/artists'});



api.get('/test-artist', md.ensureAuth, ArtistController.test);
api.post('/artist', md.ensureAuth, ArtistController.saveArtist);
api.get('/artist/:id', md.ensureAuth, ArtistController.getArtist);
api.get('/artists/:page?', md.ensureAuth, ArtistController.getArtists);
api.put('/artist/:id', md.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', md.ensureAuth,  ArtistController.deleteArtist); 
api.post('/upload-image-artist/:id', [md.ensureAuth, md_upload], ArtistController.uploadImagen);
api.get('/get-image-artist/:imageFile', ArtistController.getImagenFile);

 
module.exports = api;