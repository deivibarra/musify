'user strict'

//Creamos el route
var express = require('express');
var api = express.Router();

//Importar el Controladro
var AlbumController = require('../controllers/album');

//Importar middleware
var md = require('../middleware/authenticated');

//Para manejo de archivo
var multipart = require('connect-multiparty');
//Importar middleware para Archivo
var md_upload = multipart({uploadDir: './uploads/album'});


api.get('/test-album', md.ensureAuth, AlbumController.test);
api.post('/album', md.ensureAuth, AlbumController.saveAlbum);
api.get('/album/:id', md.ensureAuth, AlbumController.getAlbum);
api.get('/albums/:page?', md.ensureAuth, AlbumController.getAlbums);
api.put('/album/:id', md.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', md.ensureAuth,  AlbumController.deleteAlbum);
api.post('/update-imagen/:id', [md.ensureAuth, md_upload], AlbumController.uploadImagen);
api.get('/get-imagen.album/:imageFile', AlbumController.getImagenFile);


module.exports = api;