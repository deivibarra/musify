import { Component, OnInit } from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { SongService } from "../services/song.service";
import { UploadService } from "../services/upload.service";

//Models
import { Song } from "../models/song";
import { Album } from "../models/album";

@Component({
    selector: 'song-add',
    templateUrl: '../views/song-edit.html',
    providers:[UserService,SongService,UploadService]
})

export class SongEditComponent implements OnInit{

    public titulo:string;
    public song:Song;
    public album:Album;
    public identity;
    public token;
    public url:string;
    public alertSong:string = '';
    public filesToUpload: Array<File> = [];

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService: SongService,
        private _uploadService: UploadService

    ){
        this.titulo= 'Edit song';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song('',0,'','','','');
        this.album = new Album('','','',0,'','');

    }

    ngOnInit(): void {
        console.log("song-edit.component.ts loaded");
        this.getSong();
    }

    onSubmit(){
        this._songService.updateAlbum(this.token,this.song._id,this.song).subscribe(
            (response:any)=>{
                if(!response.song){
                    this.alertSong = "Server Error";
                }else{
                    this.alertSong = "Song has been updated successfully";
                    
                    //Subir archivo de la cancion
                    if(!this.filesToUpload || this.filesToUpload.length==0){
                        this._router.navigate(['/detail-album',this.album._id]);
                    }else{
                        console.log("Este es el songId:"+this.song._id);
                        this._uploadService.makeFileRequest(this.url+'upload-song-file/'+this.song._id,[],this.filesToUpload, this.token, 'file').then(
                            (result:any)=> {
                                this._router.navigate(['/detail-album',this.album._id]);
                            },
                            (error)=>{
                                this.alertSong = "Server Error";
                            }
                        );
                    }
                }
            },
            error=>{
                if(error != null){
                  this.alertSong = error.error.message;
                  console.log(error);
                }
              }
        );
}

    fileChangeEvent(fileInput:any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
        console.log(this.filesToUpload);
      }

    getSong(){
        this._route.params.forEach((params:Params)=>{
            let id = params['id'];

            this._songService.getSong(this.token,id).subscribe(
                (response:any)=>{
                    if(!response.song){
                        this.alertSong = "Server Error";
                    }else{
                        this.song = response.song;
                        this.album = response.song.album;
                    }
                },
                error=>{
                    if(error != null){
                      this.alertSong = error.error.message;
                      console.log(error);
                    }
                  }
            );
        });

    }
}