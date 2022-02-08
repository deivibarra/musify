'user strict'

//Creamos el route
var express = require('express');
var api = express.Router();

//Importar el Controladro
var UserController = require('../controllers/user');

api.get('/test-controller', UserController.test);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);


module.exports = api;