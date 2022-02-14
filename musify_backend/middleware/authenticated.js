'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'key_secret_misify';

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({
            message: "No esta autorizado para usar el API debe enviar un Token valido"
        });
    }
    var token = req.headers.authorization.replace(/['"]+/g,'');

    try{
        var payload = jwt.decode(token, secret);
        if(payload.exp <= moment.unix()){
            res.status(401).send({
                message: "El Token ha expirado"
            });
        }
    }catch(ex){
        return res.status(403).send({
            message:"Token invalido"
        });
    }

    req.user = payload;
    next();

};