'use strict'

//Imporar el modelo song
var Song = require('../models/song');


//Importar libreria Manejo de Archivo
var fs = require('fs');
var path = require('path');

//Importar Pagination
var pagination = require('mongoose-pagination');


function test(req, res){
    res.status(200).send({message:"Probando controller del Song"});
}


function saveSong(req, res){
    var song = new Song();
    var params = req.body;

    //Mapeo de Campos
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = '';

    if(song.name != null && song.number != null && song.duration != null ){
        //Guardando el usuario
        song.save((err,songStored)=>{
            if(err){
                res.status(500).send({message:"Error guardando el Song"});
            }else if(!songStored){
                res.status(404).send({message:"Error Song no guardado"});
            }
            else{
                res.status(200).send({song:songStored});
            }
        });
    }
    else{
        res.status(201).send({message: "Todos los campos son obligatorios"});
    }
}

function getSong(req, res)
{
    var SongId = req.params.id;
    Song.findById(SongId, (err, song)=>{
    if(err){
        res.status(500).send({message: "Error en la peticion"});
    }
    else if(!song){
        res.status(404).send({message: "No se encontro el songa"});
    }
    else{
            res.status(200).send({song:song});
        }
    })
}


function getSongs(req, res)
{
    if(req.params.page){
        var page = req.params.page;
    }
    else{
        var page = 1;
    }

    var itemPerPage = 4;
    
    Song.find().sort('name').paginate(page, itemPerPage,function(err, songs, total){
    if(err){
        res.status(500).send({message: "Error en la peticion"});
    }
    else if(!songs){
        res.status(404).send({message: "No se encontro ningun song"});
    }
    else{
            res.status(200).send({totalsong:total,songs:songs});
        }
    })
}


function updateSong(req, res){
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update,(err, songUpdate)=>{
        if(err){
            res.status(500).send({
                message: "Error de servidor"
            });
        }else{
            if(!songUpdate){
                res.status(404).send({
                    message: "No se encontrol el song"
                });
            }
            else
            {
                res.status(200).send({
                    song: songUpdate
                });
            }
        }
    });

}

function uploadFile(req,res){
    var songId = req.params.id;
    var file_name = "sin_nombre";

    //Extraer nombre de archivo y extension
    var file_path = req.files.image.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];
    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];
    //console.log(file_name);
    if(file_ext == "mp4" || file_ext == "mov"|| file_ext == "wmv"|| file_ext == "avi")
    {
        Song.findByIdAndUpdate(songId,{image: file_name},(err, songUpdate)=>{
            if(err){
                res.status(500).send({
                    message: "Error de servidor"
                });
            }else{
                if(!songUpdate){
                    res.status(404).send({
                        message: "No se encontrol el archivo"
                    });
                }
                else
                {
                    res.status(200).send({
                        song: songUpdate
                    });
                }
            }
        });
    }
    else{
        res.status(201).send({
            message: "Formato de imagen invalido solo se permite mp4, mov, wmv y avi"
        });
    }

}

function getImagenFile(req, res){
    var imagenFile = req.params.imageFile;
    var pathFile = './uploads/song/' + imagenFile;

    fs.exists(pathFile, function(exists){
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }
        else{
            res.status(404).send({
                message: "El archivo no se encontro"
            });
        }
    });

}

function deleteSong(req, res){
    var songId = req.params.id;
    Song.findByIdAndRemove(songId, (err, docs)=> {
        if(err){
            res.status(500).send({
                message: "Error de servidor"
            });
        }else{
            if(!docs){
                res.status(404).send({
                    message: "No se encontrol el song"
                });
            }
            else
            {
                res.status(200).send({
                    song: docs
                });
            }
        }
    });
} 

module.exports={ 
    test, 
    saveSong, 
    getSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getImagenFile
}