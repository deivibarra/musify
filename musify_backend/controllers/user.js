'use strict'

//Imporar el modelo user
var User = require('../models/user');

//Importar Librerias para Incriptar Contraseña
var bcrypt = require('bcrypt-nodejs');

//Importar libreria JWT para tokens
var jwt = require('../services/jwt');
const { restart } = require('nodemon');

function test(req, res){
    res.status(200).send({message:"Probando controller del User"});
}

function saveUser(req, res){
    var user = new User();
    var params = req.body;

    //Mapeo de Campos
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email.toLowerCase();
    user.role = 'ROLE_ADMIN';
    user.imagen = '';

    if(params.password){
        bcrypt.hash(params.password,null,null,function(err,hash){
            user.password = hash;
            if(user.name != null && user.usrname != null && user.email != null){
                //Guardando el usuario
                user.save((err,userStore)=>{
                    if(err){
                        res.status(500).send({message:"Error guardando el usuario"});
                    }else if(!userStore){
                        res.status(404).send({message:"Error usuario no guardado"});
                    }
                    else{
                        res.status(200).send({user:userStore});
                    }
                });
            }
            else{
                res.status(201).send({message: "Todos los campos son obligatorios"});
            }
        });
    }
    else{
        res.status(201).send({message: "El password no puede ser vacio"});
    }
}

//Function para el login
function loginUser(req, res)
{
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email:email.toLowerCase()}, (err, user)=>{
        if(err){
            res.status(500).send({message: "Error en la peticion"});
        }
        else if(!user){
            res.status(404).send({message: "No se encontro el usuario"});
        }
        else{
            bcrypt.compare(password, user.password, function(err, check){
                if(check){
                    if(params.gethash){
                        res.status(200).send({token: jwt.createToken(user)});
                    }
                    else{
                        res.status(200).send({user:user});
                    }
                }
                else{
                    res.status(403).send({message:"Password invalido"});
                }
            })
        }
    })

}

function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update,(err, userUpdate)=>{
        if(err){
            res.status(500).send({
                message: "Error de servidor"
            });
        }else{
            if(!userUpdate){
                res.status(404).send({
                    message: "No se encontrol el usuario"
                });
            }
            else
            {
                restart.status(200).send({
                    user: userUpdate
                });
            }
        }
    } );

}

module.exports={ 
    test, 
    saveUser, 
    loginUser,
    updateUser
}