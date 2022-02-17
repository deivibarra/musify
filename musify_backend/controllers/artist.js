'use strict'

//Imporar el modelo artist
var Artist = require('../models/artist');
var Song = require('../models/song');
var Album = require('../models/album');


//Importar libreria Manejo de Archivo
var fs = require('fs');
var path = require('path');

//Importar Pagination
var pagination = require('mongoose-pagination');

function test(req, res){
    res.status(200).send({message:"Probando controller del Artist"});
}


function saveArtist(req, res){
    var artist = new Artist();
    var params = req.body;

    //Mapeo de Campos
    artist.name = params.name;
    artist.description = params.description;
    artist.image = '';

    if(artist.name != null && artist.description != null ){
        //Guardando el usuario
        artist.save((err,artistStored)=>{
            if(err){
                res.status(500).send({message:"Error guardando el Artist"});
            }else if(!artistStored){
                res.status(404).send({message:"Error Artist no guardado"});
            }
            else{
                res.status(200).send({artist:artistStored});
            }
        });
    }
    else{
        res.status(201).send({message: "Todos los campos son obligatorios"});
    }
}

function getArtist(req, res)
{
    var ArtistId = req.params.id;
    Artist.findById(ArtistId, (err, artist)=>{
    if(err){
        res.status(500).send({message: "Error en la peticion"});
    }
    else if(!artist){
        res.status(404).send({message: "No se encontro el artista"});
    }
    else{
            res.status(200).send({artist:artist});
        }
    })
}

function getArtists(req, res)
{
    if(req.params.page){
        var page = req.params.page;
    }
    else{
        var page = 1;
    }

    var itemPerPage = 4;
    //console.log('aqui');
    
    Artist.find().sort('name').paginate(page, itemPerPage,function(err, artists, total){
    if(err){
        res.status(500).send({message: "Error en la peticion"});
    }
    else if(!artists){
        res.status(404).send({message: "No se encontro ningun artista"});
    }
    else{
            res.status(200).send({totalartist:total,artists:artists});
        }
    })
}


function updateArtist(req, res){
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update,(err, artistUpdate)=>{
       // console.log(artistUpdate);
        if(err){
            res.status(500).send({
                message: "Error de servidor"
            });
        }else{
            if(!artistUpdate){
                res.status(404).send({
                    message: "No se encontrol el artist"
                });
            }
            else
            {
                res.status(200).send({
                    artist: artistUpdate
                });
            }
        }
    });

}

function uploadImagen(req,res){
    var artistId = req.params.id;
    var file_name = "sin_nombre";

    //Extraer nombre de archivo y extension
    var file_path = req.files.image.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];
    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];
    console.log(file_name);
    if(file_ext == "png" || file_ext == "gif"|| file_ext == "jpg")
    {
        Artist.findByIdAndUpdate(artistId,{image: file_name},(err, artistUpdate)=>{
            if(err){
                res.status(500).send({
                    message: "Error de servidor"
                });
            }else{
                if(!artistUpdate){
                    res.status(404).send({
                        message: "No se encontrol el artista"
                    });
                }
                else
                {
                    res.status(200).send({
                        artist: artistUpdate
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
    var pathFile = './uploads/artist/' + imagenFile;

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

function deleteArtist(req, res){

    var artistId = req.params.id;
    Artist.findByIdAndRemove(artistId, (err, artistDelete)=> {
        if(err){
            res.status(500).send({
                message: "Error de servidor Artist"
            });
        }else{
            if(!artistDelete){
                res.status(404).send({
                    message: "No se encontrol el artist"
                });
            }
            else
            {
                Album.findByIdAndRemove(artistDelete._id, (err, albumDelete)=> {
                if(err){
                    res.status(500).send({
                        message: "Error de servidor Album"
                    });
                }else{
                    if(albumDelete){
                        Song.findByIdAndRemove(albumDelete._id, (err, songDelete)=> {
                            if(err){
                                res.status(500).send({
                                    message: "Error de servidor Song"
                                });
                            }
                            else if(!songDelete){
                                res.status(200).send({
                                    album: albumDelete
                                });
                            }
                            else{
                                res.status(200).send({
                                    song: songDelete
                                });
                            }
                        });
                    }
                    else{
                        res.status(200).send({
                            artist: artistDelete
                        });
                    }
                }});
            }
        }
    });
} 

module.exports={ 
    test, 
    saveArtist, 
    getArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImagen,
    getImagenFile
}