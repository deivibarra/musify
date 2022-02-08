'use strict'

var mongoose = require('mongoose');
var app = require('./app');

//Setear puerto para servidor web
var port = process.env.port || 3977;

//Conexion a la base de datos
mongoose.Promise=global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/musifydb',(err, res)=>{
    if(err)
    {
        throw err;
        console.log(err);
    }
    else{
        console.log("Conexion a base de datos exitosa");
        app.listen(port, function(){
            console.log("MUSIFY web server esta escuchando por el puerto 3977");
        });
    }
});