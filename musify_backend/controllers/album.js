'use strict'

//Imporar el modelo album
var Artist = require('../models/artist');
var Song = require('../models/song');
var Album = require('../models/album');


//Importar libreria Manejo de Archivo
var fs = require('fs');
var path = require('path');

//Importar Pagination
var pagination = require('mongoose-pagination');


function test(req, res){
    res.status(200).send({message:"Probando controller del Album"});
}


function saveAlbum(req, res){
    var album = new Album();
    var params = req.body;

    //Mapeo de Campos
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = '';

    if(album.title != null && album.description != null && album.year != null ){
        //Guardando el usuario
        album.save((err,albumStored)=>{
            if(err){
                res.status(500).send({message:"Error guardando el Album"});
            }else if(!albumStored){
                res.status(404).send({message:"Error Album no guardado"});
            }
            else{
                res.status(200).send({album:albumStored});
            }
        });
    }
    else{
        res.status(201).send({message: "Todos los campos son obligatorios"});
    }
}

function getAlbum(req, res)
{
    var AlbumId = req.params.id;
    Album.findById(AlbumId, (err, album)=>{
    if(err){
        res.status(500).send({message: "Error en la peticion"});
    }
    else if(!album){
        res.status(404).send({message: "No se encontro el album"});
    }
    else{
            res.status(200).send({album:album});
        }
    })
}


function getAlbums(req, res)
{
    if(req.params.page){
        var page = req.params.page;
    }
    else{
        var page = 1;
    }

    var itemPerPage = 4;
  //  console.log('aqui');
    
    Album.find().sort('title').paginate(page, itemPerPage,function(err, albums, total){
    if(err){
        res.status(500).send({message: "Error en la peticion"});
    }
    else if(!album){
        res.status(404).send({message: "No se encontro ningun album"});
    }
    else{
            res.status(200).send({totalalbum:total,albums:artists});
        }
    })
}


function updateAlbum(req, res){
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update,(err, albumUpdate)=>{
       // console.log(userUpdate);
        if(err){
            res.status(500).send({
                message: "Error de servidor"
            });
        }else{
            if(!userUpdate){
                res.status(404).send({
                    message: "No se encontrol el album"
                });
            }
            else
            {
                res.status(200).send({
                    album: albumUpdate
                });
            }
        }
    });

}

function uploadImagen(req,res){
    var albumId = req.params.id;
    var file_name = "sin_nombre";

    //Extraer nombre de archivo y extension
    var file_path = req.files.image.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];
    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];
   // console.log(file_name);
    if(file_ext == "png" || file_ext == "gif"|| file_ext == "jpg")
    {
        Album.findByIdAndUpdate(albumId,{image: file_name},(err, albumUpdate)=>{
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
                        album: albumUpdate
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
    var pathFile = './uploads/album/' + imagenFile;

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

function deleteAlbum(req, res){
    var albumId = req.params.id;
    Album.findByIdAndRemove(albumId, (err, albumDelete)=> {
        if(err){
            res.status(500).send({
                message: "Error de servidor"
            });
        }else{
            if(!albumDelete){
                res.status(404).send({
                    message: "No se encontrol el album"
                });
            }
            else
            {
                Song.findByIdAndRemove({album:albumDelete.id}, (err, songDelete)=> {
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
                            res.status(200).send({
                                song: songDelete
                            });
                        }
                    }
                });
                //res.status(200).send({
                //    album: albumDelete
                //});
            }
        }
    });
} 

module.exports={ 
    test, 
    saveAlbum, 
    getAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImagen,
    getImagenFile
}