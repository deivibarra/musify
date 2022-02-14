'use strict'

var express = require('express');
var bodyParse = require('body-parser');

var app = express();

app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());

//Solo para probar el server
app.get('/test',function(req, res){
    res.status(200).send({message:"Bienvenido a MUSIFY"});
});


//Routes
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');

//Headers HTTP

//Middleware

//Base
app.use('/api', user_routes);
app.use('/api', artist_routes);


module.exports = app;