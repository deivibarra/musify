'use strict'

//Imporar el modelo user
var User = require('../models/user');

//Importar Librerias para Incriptar Contraseña
var bcrypt = require('bcrypt-nodejs');

//Importar libreria JWT para tokens
var jwt = require('../services/jwt');

//Importar libreria Manejo de Archivo
var fs = require('fs');
var path = require('path');
//const user = require('../models/user');

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
    user.image = '';

    if(params.password){
        bcrypt.hash(params.password,null,null,function(err,hash){
            user.password = hash;
           // console.log(user);
            if(user.name != null && user.surname != null && user.email != null){
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
//       console.log(user);
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
    update.email = update.email.toLowerCase();

    User.findByIdAndUpdate(userId, update,(err, userUpdate)=>{
       // console.log(userUpdate);
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
                res.status(200).send({
                    user: userUpdate
                });
            }
        }
    });

}

function uploadImagen(req,res){
    var userId = req.params.id;
    var file_name = "sin_nombre";

    //Extraer nombre de archivo y extension
    var file_path = req.files.image.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];
    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];
    //console.log(file_name);
    if(file_ext == "png" || file_ext == "gif"|| file_ext == "jpg")
    {
        User.findByIdAndUpdate(userId,{image: file_name},(err, userUpdate)=>{
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
                    res.status(200).send({
                        user: userUpdate
                    });
                }
            }
        });
    }
    else{
        res.status(201).send({
            message: "Formato de imagen invalido solo se permite jpg, gif y png"
        });
    }

}

function getImagenFile(req, res){
    var imagenFile = req.params.imageFile;
    var pathFile = './uploads/users/' + imagenFile;

    fs.exists(pathFile, function(exists){
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }
        else{
            res.status(404).send({
                message: "La imagen no se encontro"
            });
        }
    });

}

function deleteUser(req, res){
    var userId = req.params.id;
    User.findByIdAndRemove(userId, (err, userDelete)=> {
        if(err){
            res.status(500).send({
                message: "Error de servidor"
            });
        }else{
            if(!userDelete){
                res.status(404).send({
                    message: "No se encontrol el usuario"
                });
            }
            else
            {
                //Eliminando la Imgen del Artista
                if(userDelete.image)
                    fs.unlink('./uploads/users/' + userDelete.image);
            
                res.status(200).send({
                    user: userDelete
                });
            }
        }
    });
} 

module.exports={ 
    test, 
    saveUser, 
    loginUser,
    updateUser,
    deleteUser,
    uploadImagen,
    getImagenFile
}