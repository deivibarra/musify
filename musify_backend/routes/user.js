'user strict'

//Creamos el route
var express = require('express');
var api = express.Router();

//Importar el Controladro
var UserController = require('../controllers/user');

//Importar middleware
var md = require('../middleware/authenticated');

//Para manejo de archivo
var multipart = require('connect-multiparty');
//Importar middleware para Archivo
var md_upload = multipart({uploadDir: './uploads/users'});



api.get('/test-controller', UserController.test);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md.ensureAuth, UserController.updateUser);
api.delete('/delete-user/:id', md.ensureAuth,  UserController.deleteUser);
api.post('/update-imagen/:id', [md.ensureAuth, md_upload], UserController.uploadImagen);
api.get('/get-imagen.user/:imageFile', UserController.getImagenFile);


module.exports = api;