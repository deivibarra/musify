import { Component, OnInit } from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { SongService } from "../services/song.service";

//Models
import { Song } from "../models/song";

@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.html',
    providers:[UserService,SongService]
})

export class SongAddComponent implements OnInit{

    public titulo:string;
    public song:Song;
    public identity;
    public token;
    public url:string;
    public alertSong:string = '';
    public filesToUpload: Array<File> = [];

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService: SongService

    ){
        this.titulo= 'Add new song';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song('',0,'','','','');

    }

    ngOnInit(): void {
        console.log("song-add.component.ts loaded");
    }

    fileChangeEvent(fileInput:any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
        console.log(this.filesToUpload);
      }

    onSubmit(){
        this._route.params.forEach((params:Params)=>{
            let album_id = params['album'];
            this.song.album = album_id;

            this._songService.addSong(this.token,this.song).subscribe(
                (response:any)=>{
                    if(!response.song){
                        this.alertSong = "Server Error";
                    }else{
                        this.alertSong = "Song has been created successfully";
                        this.song = response.song;
                        this._router.navigate(['/edit-song',response.song._id]);
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
        console.log(this.song);
    }
}