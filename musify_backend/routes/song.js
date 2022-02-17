'user strict'

//Creamos el route
var express = require('express');
var api = express.Router();

//Importar el Controladro
var SongController = require('../controllers/song');

//Importar middleware
var md = require('../middleware/authenticated');

//Para manejo de archivo
var multipart = require('connect-multiparty');
//Importar middleware para Archivo
var md_upload = multipart({uploadDir: './uploads/song'});



api.get('/test-song', md.ensureAuth, SongController.test);
api.post('/song', md.ensureAuth, SongController.saveSong);
api.get('/song/:id', md.ensureAuth, SongController.getSong);
api.get('/songs/:page?', md.ensureAuth, SongController.getSongs);
api.put('/song/:id', md.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md.ensureAuth,  SongController.deleteSong);
api.post('/update-file/:id', [md.ensureAuth, md_upload], SongController.uploadFile);
api.get('/get-imagen.song/:imageFile', SongController.getImagenFile);


module.exports = api;