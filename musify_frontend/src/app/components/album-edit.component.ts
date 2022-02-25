import { Component, OnInit } from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { Album } from "../models/album";
import { AlbumService } from "../services/album.service";
import { UploadService } from "../services/upload.service";
import { Artist } from "../models/artist";

@Component({
    selector: 'album-edit',
    templateUrl: '../views/album-edit.html',
    providers:[UserService,AlbumService,UploadService]
})

export class AlbumEditComponent implements OnInit{

    public titulo:string;

    public album:Album;
    public artist:Artist;
    public identity;
    public token;
    public url:string;
    public alertAlbum:string = '';
    public filesToUpload: Array<File> = [];

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _uploadService: UploadService

    ){
        this.titulo= 'Edit album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('','','',0,'','');
        this.artist = new Artist('','','','');
    }

    ngOnInit(): void {
        console.log("album-edit.component.ts loaded");
        this.getAlbum();
    }

    onSubmit(){
            this._albumService.updateAlbum(this.token,this.album._id,this.album).subscribe(
                (response:any)=>{
                    if(!response.album){
                        this.alertAlbum = "Server Error";
                    }else{
                        this.alertAlbum = "Album has been updated successfully";
                        
                        //Subir la imagen del artista
                        if(!this.filesToUpload || this.filesToUpload.length==0){
                            this._router.navigate(['/detail-artist',this.artist._id]);
                        }else{
                            this._uploadService.makeFileRequest(this.url+'upload-image-album/'+this.album._id,[],this.filesToUpload, this.token, 'image').then(
                                (result:any)=> {
                                    this._router.navigate(['/detail-artist',this.artist._id]);
                                },
                                (error)=>{
                                }
                            );
                        }
                    }
                },
                error=>{
                    if(error != null){
                      this.alertAlbum = error.error.message;
                      console.log(error);
                    }
                  }
            );
    }

    fileChangeEvent(fileInput:any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
        console.log(this.filesToUpload);
      }

    getAlbum(){
        this._route.params.forEach((params:Params)=>{
            let album_id = params['id'];

            this._albumService.getAlbum(this.token,album_id).subscribe(
                (response:any)=>{
                    if(!response.album){
                        this._router.navigate(['/']);
                    }else{
                        this.album = response.album;
                        this.artist = response.album.artist;
                        console.log(this.album);
                    }
                },
                error=>{
                    if(error != null){
                      this.alertAlbum = error.error.message;
                      console.log(error);
                    }
                  }                
            );
        });
    }
}