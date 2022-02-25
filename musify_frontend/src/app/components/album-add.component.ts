import { Component, OnInit } from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { Artist } from "../models/artist";
import { ArtistService } from "../services/artist.service";
import { Album } from "../models/album";
import { AlbumService } from "../services/album.service";

@Component({
    selector: 'album-add',
    templateUrl: '../views/album-add.html',
    providers:[UserService,ArtistService,AlbumService]
})

export class AlbumAddComponent implements OnInit{

    public titulo:string;
    public artist: Artist;
    public album:Album;
    public identity;
    public token;
    public url:string;
    public alertAlbum:string = '';
    public filesToUpload: Array<File> = [];

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService

    ){
        this.titulo= 'Add new album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('','','','');
        this.album = new Album('','','',0,'','');
    }

    ngOnInit(): void {
        console.log("album-add.component.ts loaded");
    }

    onSubmit(){
        this._route.params.forEach((params:Params)=>{
            let artist_id = params['artist'];
            this.album.artist = artist_id;

            this._albumService.addAlbum(this.token,this.album).subscribe(
                (response:any)=>{
                    if(!response.album){
                        this.alertAlbum = "Server Error";
                    }else{
                        this.alertAlbum = "Album has been created successfully";
                        this.album = response.album;
                        this._router.navigate(['/edit-album',response.album._id]);
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
        console.log(this.album);



    }
}