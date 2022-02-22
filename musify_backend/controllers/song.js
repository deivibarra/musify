'use strict'

//Imporar el modelo song
var Song = require('../models/song');
var Album = require('../models/album');


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
    song.album = params.album;

    if(!song.album){
        res.status(404).send({message: "No tiene asignado el album"});
    }
    else{
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
}

function getSong(req, res)
{
    var SongId = req.params.id;
    Song.findById(SongId).populate({path:'album'}).exec((err, song)=>{
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
    var albumId = req.params.id;
    
    if(!albumId){
        var find = Song.find({}).sort('name');
    }
    else{
        var find = Song.find({album:albumId}).sort('name');
    }
    //console.log(find);
    find.populate({path:'album'}).exec((err, songs)=>{
        if(err){
            res.status(500).send({message: "Error en la peticion "});
        }
        else if(!songs){
            res.status(404).send({message: "No se encontro ningun song"});
        }
        else{
                res.status(200).send({songs:songs});
            }            
    });

    //if(req.params.page){
    //    var page = req.params.page;
    //}
    //else{
    //    var page = 1;
    //}

    //var itemPerPage = 4;
    
    //Song.find().sort('name').paginate(page, itemPerPage,function(err, songs, total){
    //if(err){
    //    res.status(500).send({message: "Error en la peticion"});
    //}
    //else if(!songs){
    //    res.status(404).send({message: "No se encontro ningun song"});
    //}
    //else{
    //        res.status(200).send({totalsong:total,songs:songs});
    //    }
    //})
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
    var file_path = req.files.file.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];
    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];
    console.log(file_name);
    if(file_ext == "mp3" || file_ext == "ogg")
    {
        Song.findByIdAndUpdate(songId,{file: file_name},(err, songUpdate)=>{
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
            message: "Formato de imagen invalido solo se permite mp3 o ogg"
        });
    }

}

function getSongFile(req,res){
    var songFile = req.params.songFile;
    var pathFile = './uploads/song/'+songFile;
    fs.exists(pathFile,function(exists){
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(404).send({message: "La cancion no se encontro"});
        }
    });
}

/*
function getFile(req, res){
    var fileMP3 = req.params.file;
    var pathFile = './uploads/song/' + fileMP3;
    console.log(pathFile);
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
*/

function deleteSong(req, res){
    var songId = req.params.id;
    Song.findByIdAndRemove(songId, (err, songDelete)=> {
        if(err){
            res.status(500).send({
                message: "Error de servidor"
            });
        }else{
            if(!songDelete){
                res.status(404).send({
                    message: "No se encontrol el song"
                });
            }
            else
            {
                if(songDelete.file)
                    fs.unlink('./uploads/song/' + songDelete.file);
                res.status(200).send({
                    song: songDelete
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
    getSongFile
}